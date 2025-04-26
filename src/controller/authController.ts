import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool';

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hash]);
  res.status(201).send('User created');
};


//any qilib qoydim hato berdi google dan yahshi javob topmadim AI ladan soragim kemadi
export const login = async (req: any, res: any) => {
  const { username, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  if (user.rows.length === 0) return res.status(400).send('Invalid credentials');

  const valid = await bcrypt.compare(password, user.rows[0].password);
  if (!valid) return res.status(400).send('Invalid credentials');

  const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  res.cookie('token', token, { httpOnly: true }).send('Logged in');
};
