import express from 'express';
import {
  getProfile,
  uploadProfileImage,
  updateProfile,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

import { protect, adminOnly } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// User
router.get('/profile', protect, getProfile);
router.post('/upload', protect, upload.single('profileImage'), uploadProfileImage);
router.patch('/profile', protect, updateProfile);

// Admin
router.post('/',protect,adminOnly,createUser)
router.get('/', protect, adminOnly, getAllUsers);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;
