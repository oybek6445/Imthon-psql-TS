import { Router } from 'express';
import { authMiddleware } from '../middleware/authMIddleware';
import {
  createBlog,
  getMyBlogs,
  getMyJoinedBlogs,
  getBlogInfo,
  updateBlog,
  deleteBlog,
  searchBlogs,
  joinBlog,
  leaveBlog,
  getBlogUsers,
} from '../controller/blogControllet';

const router = Router();

router.post('/create', authMiddleware, createBlog);
router.get('/get-my-blogs', authMiddleware, getMyBlogs);
router.get('/get-my-joined-blogs', authMiddleware, getMyJoinedBlogs);
router.get('/get-blog-info/:id', authMiddleware, getBlogInfo);
router.put('/update/:id', authMiddleware, updateBlog);
router.delete('/delete/:id', authMiddleware, deleteBlog);
router.get('/search', authMiddleware, searchBlogs);
router.post('/join-blog', authMiddleware, joinBlog);
router.post('/leave-blog', authMiddleware, leaveBlog);
router.get('/get-users/:blogId', authMiddleware, getBlogUsers);

export default router;
