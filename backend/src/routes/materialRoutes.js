import express from 'express';
import {
  getMaterials,
  getMaterial,
  createMaterial,
  deleteMaterial,
  downloadMaterial
} from '../controllers/materialController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadToCloudinary, uploadImage } from '../utils/cloudinaryUpload.js';

const router = express.Router();

router.route('/')
  .get(getMaterials)
  .post(protect, admin, createMaterial);

router.post('/upload', protect, admin, uploadToCloudinary, uploadImage);

router.route('/:id')
  .get(getMaterial)
  .delete(protect, admin, deleteMaterial);

router.get('/:id/download', downloadMaterial);

export default router;
