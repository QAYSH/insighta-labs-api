import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

console.log('Database URL exists:', !!process.env.SUPABASE_DB_URL);
if (!process.env.SUPABASE_DB_URL) {
  console.error('❌ SUPABASE_DB_URL environment variable is not set!');
  console.log('Make sure you have a .env file with SUPABASE_DB_URL=your_connection_string');
}

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
});

export default pool;