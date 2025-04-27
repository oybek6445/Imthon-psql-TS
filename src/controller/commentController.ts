import { Request, Response } from 'express';
import { pool } from '../db/pool';

export const createComment = async (req: Request, res: any) => {
  try {
    const { postId, content } = req.body;
    const userId = (req as any).user.id;

    const post = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (post.rows.length === 0) return res.status(404).send('Post not found');

    const result = await pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [postId, userId, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const getCommentsByPostId = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const result = await pool.query(
      'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE post_id = $1 ORDER BY c.created_at ASC',
      [postId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const updateComment = async (req: Request, res: any) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = (req as any).user.id;

    const comment = await pool.query('SELECT * FROM comments WHERE id = $1', [commentId]);
    if (comment.rows.length === 0) return res.status(404).send('Comment not found');
    if (comment.rows[0].user_id !== userId) return res.status(403).send('Forbidden');

    await pool.query('UPDATE comments SET content = $1 WHERE id = $2', [content, commentId]);
    res.send('Comment updated');
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const deleteComment = async (req: Request, res: any) => {
  try {
    const { commentId } = req.params;
    const userId = (req as any).user.id;

    const comment = await pool.query('SELECT * FROM comments WHERE id = $1', [commentId]);
    if (comment.rows.length === 0) return res.status(404).send('Comment not found');
    if (comment.rows[0].user_id !== userId) return res.status(403).send('Forbidden');

    await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
    res.send('Comment deleted');
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).send('Internal Server Error');
  }
};
