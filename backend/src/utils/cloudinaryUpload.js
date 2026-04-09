import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF allowed.'));
    }
  }
});

export const uploadToCloudinary = upload.single('image');

export const uploadImage = async (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check if Cloudinary configured
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
      // Use Cloudinary
      const resourceType = req.file.mimetype === 'application/pdf' ? 'image' : 'auto';
      const uploadOptions = { 
        resource_type: resourceType,
        folder: 'materials',
        format: resourceType === 'image' && req.file.mimetype === 'application/pdf' ? 'pdf' : undefined
      };

      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary stream error:', error);
            return res.status(500).json({ message: error.message || 'Cloudinary upload failed', details: error });
          }
          res.json({ url: result.secure_url });
        }
      );
      stream.end(req.file.buffer);
    } else {
      // Save locally
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const uploadsDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filename = Date.now() + '_' + req.file.originalname;
      const filepath = path.join(uploadsDir, filename);
      fs.writeFileSync(filepath, req.file.buffer);

      const url = `/materials/files/${filename}`;
      res.json({ url });
    }
  } catch (error) {
    console.error('OUTER CRASH in uploadImage:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};
