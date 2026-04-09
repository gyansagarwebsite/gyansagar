import { uploadImage } from './src/utils/cloudinaryUpload.js';
import FormData from 'form-data';
import fs from 'fs';
import express from 'express';
import dbConnect from './src/config/db.js';

const app = express();
app.use(express.json());

app.post('/test', async (req, res) => {
  // simulate multer req.file
  req.file = {
    mimetype: 'application/pdf',
    originalname: 'real_test.pdf',
    buffer: fs.readFileSync('./dummy.pdf')
  };
  await uploadImage(req, res);
});

async function run() {
  await dbConnect();
  app.listen(8001, async () => {
    fs.writeFileSync('./dummy.pdf', '%PDF-1.4\n1 0 obj <</Type/Catalog/Pages 2 0 R>> endobj');
    const res = await fetch('http://localhost:8001/test', { method: 'POST' });
    const json = await res.json();
    console.log("Uploaded URL:", json.url);
    if(json.url) {
      const fetchRes = await fetch(json.url);
      console.log("Fetch Status:", fetchRes.status);
    }
    process.exit(0);
  });
}

run();
