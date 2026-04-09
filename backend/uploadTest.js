import axios from 'axios';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import FormData from 'form-data';

// Mint admin token
const token = jwt.sign({ id: 'mockadmin', role: 'admin' }, 'your_jwt_secret_here', { expiresIn: '1h' });

async function run() {
  try {
    fs.writeFileSync('./dummy.pdf', '%PDF-1.4\n1 0 obj <</Type/Catalog/Pages 2 0 R>> endobj');
    const form = new FormData();
    form.append('image', fs.createReadStream('./dummy.pdf'), { filename: 'dummy.pdf', contentType: 'application/pdf' });

    const response = await axios.post('http://localhost:8000/api/materials/upload', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log("Success:", response.data);
  } catch(e) {
    if (e.response) {
      console.error("Backend Error payload:", e.response.data);
      console.error("Backend Error status:", e.response.status);
    } else {
      console.error("Client error:", e);
    }
  }
}

run();
