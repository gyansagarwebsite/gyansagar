import mongoose from 'mongoose';
import Material from './src/models/Material.js';
import dotenv from 'dotenv';
import './src/utils/dnsSetup.js'; // MUST INCLUDE DNS PATCH

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const material = await Material.findById('69c974dfe43feef9c823ff5c'); // User's ID
    console.log("Material PDF URL IS EXACTLY:", material?.pdfUrl);
    process.exit(0);
  });
