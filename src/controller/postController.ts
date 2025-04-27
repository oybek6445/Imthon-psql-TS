import { Request, Response } from 'express';
import { pool } from '../db/pool';

export const createPost = async (req: Request, res: Response) => {
  try {
    const { blogId, title, content } = req.body;
    const userId = (req as any).user.id;

    const blog = await pool.query('SELECT * FROM blogs WHERE id = $1', [blogId]);
    if (blog.rows.length === 0) return res.status(404).send('Blog not found');
    if (blog.rows[0].owner_id !== userId) return res.status(403).send('Forbidden');

    const result = await pool.query(
      'INSERT INTO posts (blog_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [blogId, title, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;

    const result = await pool.query('SELECT * FROM posts WHERE blog_id = $1', [blogId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (result.rows.length === 0) return res.status(404).send('Post not found');

    await pool.query('UPDATE posts SET views = views + 1 WHERE id = $1', [postId]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching post by id:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;
    const userId = (req as any).user.id;

    const post = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (post.rows.length === 0) return res.status(404).send('Post not found');

    const blog = await pool.query('SELECT * FROM blogs WHERE id = $1', [post.rows[0].blog_id]);
    if (blog.rows.length === 0) return res.status(404).send('Blog not found');
    if (blog.rows[0].owner_id !== userId) return res.status(403).send('Forbidden');

    await pool.query('UPDATE posts SET title = $1, content = $2 WHERE id = $3', [title, content, postId]);
    res.send('Post updated');
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = (req as any).user.id;

    const post = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (post.rows.length === 0) return res.status(404).send('Post not found');

    const blog = await pool.query('SELECT * FROM blogs WHERE id = $1', [post.rows[0].blog_id]);
    if (blog.rows.length === 0) return res.status(404).send('Blog not found');
    if (blog.rows[0].owner_id !== userId) return res.status(403).send('Forbidden');

    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    res.send('Post deleted');
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const sortPostsByDate = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;

    const result = await pool.query('SELECT * FROM posts WHERE blog_id = $1 ORDER BY created_at DESC', [blogId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error sorting posts:', error);
    res.status(500).send('Internal Server Error');
  }
};
