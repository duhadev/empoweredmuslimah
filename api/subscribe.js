const { Pool } = require('pg');

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Ensure subscribers table exists
async function ensureTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } finally {
    client.release();
  }
}

// Initialize table on cold start
let tableInitialized = false;

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure table exists
    if (!tableInitialized) {
      await ensureTable();
      tableInitialized = true;
    }

    const { name, email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Sanitize inputs
    const sanitizedName = name ? name.trim().substring(0, 255) : '';
    const sanitizedEmail = email.trim().toLowerCase().substring(0, 255);

    // Insert subscriber
    const client = await pool.connect();
    try {
      await client.query(
        'INSERT INTO subscribers (name, email) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET name = COALESCE(NULLIF($1, \'\'), subscribers.name)',
        [sanitizedName, sanitizedEmail]
      );
    } finally {
      client.release();
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed',
    });
  } catch (error) {
    console.error('Subscribe error:', error);

    // Handle specific errors
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
};
