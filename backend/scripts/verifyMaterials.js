import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Material from '../src/models/Material.js';
import connectDB from '../src/config/db.js';
import '../src/utils/dnsSetup.js';

dotenv.config({ path: './backend/.env' });

const verify = async () => {
    try {
        await connectDB();
        const count = await Material.countDocuments();
        console.log(`✅ Total materials in database: ${count}`);
        const sample = await Material.find().limit(2);
        console.log('Sample titles:', sample.map(s => s.title));
        mongoose.connection.close();
    } catch (err) {
        console.error('❌ Verification failed:', err);
    }
};

verify();
