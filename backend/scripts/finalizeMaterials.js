import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import https from 'https';
import { v2 as cloudinary } from 'cloudinary';
import Material from '../src/models/Material.js';
import connectDB from '../src/config/db.js';
import '../src/utils/dnsSetup.js';

dotenv.config({ path: './backend/.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

const migrateToCloudinary = async () => {
    try {
        await connectDB();
        const materials = await Material.find({ pdfUrl: { $regex: /^(http:\/\/|https:\/\/)/ } });
        
        console.log(`🚀 Found ${materials.length} materials to migrate...`);

        for (const material of materials) {
            // Skip already migrated Cloudinary URLs from OUR account
            if (material.pdfUrl.includes(`cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}`)) {
                console.log(`⏭️  Skipping already migrated: ${material.title}`);
                continue;
            }

            console.log(`📥 Downloading: ${material.title} from ${material.pdfUrl}...`);
            try {
                const response = await axios({
                    url: material.pdfUrl,
                    method: 'GET',
                    responseType: 'arraybuffer',
                    httpsAgent: material.pdfUrl.startsWith('https') ? httpsAgent : undefined,
                    timeout: 20000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });

                console.log(`📤 Uploading to Cloudinary...`);
                // Upload buffer to Cloudinary
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { 
                            resource_type: 'auto', // Use 'auto' to let Cloudinary decide
                            folder: 'materials_stable',
                            public_id: material.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_' + Date.now()
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(response.data);
                });

                console.log(`✅ Success! New URL: ${result.secure_url}`);
                material.pdfUrl = result.secure_url;
                await material.save();
                
            } catch (err) {
                console.error(`❌ Failed to migrate ${material.title}: ${err.message}`);
                // Continue with next material
            }
        }

        console.log('🎉 Migration finished!');
        mongoose.connection.close();
    } catch (err) {
        console.error('💥 Crash during migration:', err);
        process.exit(1);
    }
};

migrateToCloudinary();
