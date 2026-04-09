import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function run() {
  const public_id = 'materials/bsqd4aqzqk8favw510mq.pdf';
  const signedUrl = cloudinary.utils.private_download_url(public_id, '', { // raw needs empty format or it adds .pdf.pdf
    resource_type: 'raw',
    type: 'upload'
  });
  console.log("RAW URL:", signedUrl);

  try {
    const res = await axios.head(signedUrl);
    console.log("Success! HTTP", res.status);
  } catch(e) {
    console.log("Failed:", e.response?.status, e.response?.data);
  }
}
run();
