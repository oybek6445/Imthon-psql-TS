import { Router } from 'express';
import { authMiddleware } from '../middleware/authMIddleware';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  sortPostsByDate,
} from '../controller/postController';

const router = Router();

router.post('/create', authMiddleware, createPost);
router.get('/get-all/:blogId', authMiddleware, getAllPosts);
router.get('/get-by-id/:postId', authMiddleware, getPostById);
router.put('/update/:postId', authMiddleware, updatePost);
router.delete('/delete/:postId', authMiddleware, deletePost);
router.get('/sort-by-date/:blogId', authMiddleware, sortPostsByDate);

export default router;
