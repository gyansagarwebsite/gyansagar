import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function run() {
  try {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'materials_test', format: 'pdf' },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
        } else {
          console.log("Success URL:", result.secure_url);
        }
      }
    );
    // write a real dummy pdf 
    // %PDF-1.1
    // %¥±ë

    // 1 0 obj
    //   << /Type /Catalog
    //      /Pages 2 0 R
    //   >>
    // endobj

    // 2 0 obj
    //   << /Type /Pages
    //      /Kids [3 0 R]
    //      /Count 1
    //      /MediaBox [0 0 300 144]
    //   >>
    // endobj

    // 3 0 obj
    //   <<  /Type /Page
    //       /Parent 2 0 R
    //       /Resources
    //        << /Font
    //            << /F1
    //                << /Type /Font
    //                   /Subtype /Type1
    //                   /BaseFont /Times-Roman
    //                >>
    //            >>
    //        >>
    //       /Contents 4 0 R
    //   >>
    // endobj

    // 4 0 obj
    //   << /Length 55 >>
    // stream
    //   BT
    //     /F1 18 Tf
    //     0 0 Td
    //     (Hello World) Tj
    //   ET
    // endstream
    // endobj

    // xref
    // 0 5
    // 0000000000 65535 f 
    // 0000000018 00000 n 
    // 0000000077 00000 n 
    // 0000000178 00000 n 
    // 0000000457 00000 n 
    // trailer
    //   <<  /Root 1 0 R
    //       /Size 5
    //   >>
    // startxref
    // 565
    // %%EOF
    fs.writeFileSync('test.pdf', `%PDF-1.1
%¥±ë

1 0 obj
  << /Type /Catalog
     /Pages 2 0 R
  >>
endobj

2 0 obj
  << /Type /Pages
     /Kids [3 0 R]
     /Count 1
     /MediaBox [0 0 300 144]
  >>
endobj

3 0 obj
  <<  /Type /Page
      /Parent 2 0 R
      /Resources
       << /Font
           << /F1
               << /Type /Font
                  /Subtype /Type1
                  /BaseFont /Times-Roman
               >>
           >>
       >>
      /Contents 4 0 R
  >>
endobj

4 0 obj
  << /Length 55 >>
stream
  BT
    /F1 18 Tf
    0 0 Td
    (Hello World) Tj
  ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000018 00000 n 
0000000077 00000 n 
0000000178 00000 n 
0000000457 00000 n 
trailer
  <<  /Root 1 0 R
      /Size 5
  >>
startxref
565
%%EOF`);
    stream.end(fs.readFileSync('test.pdf'));
  } catch(e) {
    console.error("Crash:", e);
  }
}

run();
