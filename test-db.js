import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL,
  ssl: { rejectUnauthorized: false },
});

async function test() {
  try {
    console.log('Testing database connection...');
    console.log('URL:', process.env.SUPABASE_DB_URL.replace(/:[^:]*@/, ':****@')); // Hide password
    const res = await pool.query('SELECT NOW() as time, version() as version');
    console.log('✅ Connected successfully!');
    console.log('Server time:', res.rows[0].time);
    console.log('PostgreSQL version:', res.rows[0].version);
    await pool.end();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.error('Full error:', err);
  }
}

test();