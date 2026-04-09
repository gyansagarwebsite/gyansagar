import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function run() {
  try {
    console.log("Starting upload...");
    const buffer = Buffer.from("%PDF-1.4\n1 0 obj <</Type/Catalog>> endobj");
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'materials_test', format: 'pdf' },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
        } else {
          console.log("Success:", result);
        }
      }
    );
    stream.end(buffer);
  } catch(e) {
    console.error("Crash:", e);
  }
}

run();
