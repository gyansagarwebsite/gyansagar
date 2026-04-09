import Material from '../models/Material.js';
import { createNotification } from './notificationController.js';


export const getMaterials = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const query = category ? { category } : {};

    const materials = await Material.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMaterial = async (req, res) => {
  try {
const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMaterial = async (req, res) => {
  try {
    const material = new Material(req.body);
    await material.save();

    // Create notification
    await createNotification({
      title: 'New Study Material',
      message: `New resource: ${material.title}`,
      type: 'material',
      link: '/materials',
    });

    res.status(201).json(material);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import axios from 'axios';
import https from 'https';
import { v2 as cloudinary } from 'cloudinary';

// Custom HTTPS agent to handle expired certificates on government websites
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export const downloadMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material || !material.pdfUrl) {
      return res.status(404).json({ message: 'Material or PDF not found' });
    }

    // Increment downloads
    material.downloads += 1;
    await material.save();

    // Define filename
    const filename = `${material.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;

    let targetUrl = material.pdfUrl;

    // Securely transform standard Cloudinary CDN URL into an authenticated Private API Download URL
    if (targetUrl.includes('cloudinary.com')) {
      try {
        const urlObj = new URL(targetUrl);
        const parts = urlObj.pathname.split('/'); // ["", "cloud_name", "image", "upload", ...]
        
        const currentCloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const urlCloudName = parts[1];

        // ONLY attempt signed download for OUR own Cloudinary account
        if (urlCloudName === currentCloudName) {
          const uploadIdx = parts.indexOf('upload');
          if (uploadIdx !== -1) {
            const resourceType = parts[uploadIdx - 1]; // 'raw' or 'image'
            const publicIdParts = parts.slice(uploadIdx + 2); // Exclude version string
            let publicId = publicIdParts.join('/');
            let format = '';

            if (resourceType === 'image') {
              format = 'pdf';
              publicId = publicId.replace(/\.pdf$/i, ''); // Image type expects extension omitted
            }

            // Generates an HMAC-SHA1 signed URL using process.env.CLOUDINARY_API_SECRET
            targetUrl = cloudinary.utils.private_download_url(publicId, format, {
              resource_type: resourceType,
              type: 'upload'
            });
          }
        }
      } catch (err) {
        console.warn('Could not transform Cloudinary URL, using original:', err.message);
      }
    }

    // Fetch the file securely via axios stream pipeline
    // We use the custom httpsAgent to ignore SSL certificate issues from source sites
    const fileResponse = await axios({
      url: targetUrl,
      method: 'GET',
      responseType: 'stream',
      httpsAgent: targetUrl.startsWith('https') ? httpsAgent : undefined,
      timeout: 30000, // 30 second timeout for slow government servers
    });

    // Set strictly forced download headers after successfully initiating stream
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');

    // Pipe directly to client browser
    fileResponse.data.pipe(res);

  } catch (error) {
    console.error('Download Error:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      return res.status(503).json({ 
        message: 'Source server unreachable', 
        error: 'The government website is currently down or has a DNS issue. Please try again later.' 
      });
    }

    if (error.code === 'CERT_HAS_EXPIRED' || error.message.includes('certificate has expired')) {
      return res.status(503).json({ 
        message: 'SSL Certificate Error', 
        error: 'The source website has an expired security certificate. Our proxy tried to bypass this but failed.' 
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({ 
        message: 'Source download error', 
        details: error.message 
      });
    } else {
      res.status(500).json({ 
        message: 'Error proxying download', 
        error: error.message 
      });
    }
  }
};
