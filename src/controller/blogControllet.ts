import { Request, Response } from 'express';
import { pool } from '../db/pool';

export const createBlog = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const userId = (req as any).user.id;

  const result = await pool.query(
    'INSERT INTO blogs (owner_id, name, description) VALUES ($1, $2, $3) RETURNING *',
    [userId, name, description]
  );
  //console.log(result.rows)
  await pool.query('INSERT INTO blog_members (blog_id, user_id) VALUES ($1, $2)', [result.rows[0].id, userId]);
 

  res.status(201).json(result.rows[0]);
};

export const getMyBlogs = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const result = await pool.query('SELECT * FROM blogs WHERE owner_id = $1', [userId]);
  res.json(result.rows);
};

export const getMyJoinedBlogs = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const result = await pool.query(`
    SELECT b.* FROM blogs b
    JOIN blog_members bm ON bm.blog_id = b.id
    WHERE bm.user_id = $1
  `, [userId]);

  res.json(result.rows);
};

export const getBlogInfo = async (req: any, res: any) => {
  const { id } = req.params;

  const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
  if (result.rows.length === 0) return res.status(404).send('Blog not found');

  res.json(result.rows[0]);
};

export const updateBlog = async (req: any, res: any) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const userId = (req as any).user.id;

  const blog = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
  if (blog.rows.length === 0) return res.status(404).send('Blog not found');
  if (blog.rows[0].owner_id !== userId) return res.status(403).send('Forbidden');

  await pool.query('UPDATE blogs SET name = $1, description = $2 WHERE id = $3', [name, description, id]);
  res.send('Blog updated');
};

export const deleteBlog = async (req: any, res: any) => {
  const { id } = req.params;
  const userId = (req as any).user.id;

  const blog = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
  if (blog.rows.length === 0) return res.status(404).send('Blog not found');
  if (blog.rows[0].owner_id !== userId) return res.status(403).send('Forbidden');

  await pool.query('DELETE FROM blogs WHERE id = $1', [id]);
  res.send('Blog deleted');
};

export const searchBlogs = async (req: Request, res: Response) => {
  const { query } = req.query;

  const result = await pool.query(
    `SELECT * FROM blogs WHERE name ILIKE '%' || $1 || '%'`,
    [query]
  );

  res.json(result.rows);
};

export const joinBlog = async (req: any, res: any) => {
  const { blogId } = req.body;
  const userId = (req as any).user.id;

  const check = await pool.query('SELECT * FROM blog_members WHERE blog_id = $1 AND user_id = $2', [blogId, userId]);
  if (check.rows.length > 0) return res.status(400).send('Already joined');

  await pool.query('INSERT INTO blog_members (blog_id, user_id) VALUES ($1, $2)', [blogId, userId]);
  res.send('Joined blog');
};

export const leaveBlog = async (req: Request, res: Response) => {
  const { blogId } = req.body;
  const userId = (req as any).user.id;

  await pool.query('DELETE FROM blog_members WHERE blog_id = $1 AND user_id = $2', [blogId, userId]);
  res.send('Left blog');
};

export const getBlogUsers = async (req: Request, res: Response) => {
  const { blogId } = req.params;

  const result = await pool.query(`
    SELECT u.id, u.username FROM users u
    JOIN blog_members bm ON bm.user_id = u.id
    WHERE bm.blog_id = $1
  `, [blogId]);

  res.json(result.rows);
};
