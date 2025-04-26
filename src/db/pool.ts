import { Pool } from 'postgres-pool';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: 'postgresql://postgres:mitron2020@localhost:5432/postgres',
});