import { Router } from 'express';
import { authMiddleware } from '../middleware/authMIddleware';
import {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
} from '../controller/commentController';

const router = Router();

router.post('/create', authMiddleware, createComment);
router.get('/:postId/get-comments', authMiddleware, getCommentsByPostId);
router.put('/update/:commentId', authMiddleware, updateComment);
router.delete('/delete/:commentId', authMiddleware, deleteComment);

export default router;
