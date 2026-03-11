import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Rate limiting store (in-memory - use Redis in production for multiple instances)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 submissions per minute per IP

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return ip;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

// Input validation
function validateEmail(email: string): boolean {
  if (!email || email.length > 255) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  if (!phone) return false; // Now required
  // Extract digits only
  const digits = phone.replace(/\D/g, '');
  // Must have 10 digits (US format)
  return digits.length === 10;
}

function validateName(name: string): boolean {
  if (!name) return false; // Now required
  // Allow letters (including Unicode), spaces, hyphens, apostrophes, periods
  // More permissive to support international names
  if (name.length > 100) return false;
  // Just check it's not empty and doesn't contain obvious script injection
  const dangerousPattern = /[<>{}[\]]/;
  return !dangerousPattern.test(name);
}

// Format phone for storage (digits only)
function formatPhoneForStorage(phone: string): string {
  return phone.replace(/\D/g, '').substring(0, 10);
}

// Sanitize input - remove potentially dangerous characters
function sanitizeInput(input: string, maxLength: number): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .substring(0, maxLength);
}

// Ensure subscribers table exists
async function ensureTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add new columns if they don't exist (migration for existing tables)
    await client.query(`ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS phone VARCHAR(20)`);
    await client.query(`ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45)`);
    await client.query(`ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS user_agent TEXT`);
    await client.query(`ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`);

    // Create index on email for faster lookups
    await client.query(`CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers(created_at)`);
  } finally {
    client.release();
  }
}

// Initialize table on cold start
let tableInitialized = false;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    const { allowed, remaining } = checkRateLimit(rateLimitKey);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'Retry-After': '60'
          }
        }
      );
    }

    // Ensure table exists
    if (!tableInitialized) {
      try {
        await ensureTable();
        tableInitialized = true;
      } catch (dbError) {
        console.error('Database initialization error:', dbError);
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again.' },
          { status: 503 }
        );
      }
    }

    const body = await request.json();
    const { name, email, phone, honeypot } = body;

    // Honeypot check - if this hidden field is filled, it's likely a bot
    if (honeypot) {
      // Silently reject but return success to not alert bots
      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed',
      });
    }

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Validate formats
    if (!validateName(name)) {
      return NextResponse.json({ error: 'Please enter a valid name' }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    if (!validatePhone(phone)) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit phone number' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name, 100);
    const sanitizedEmail = email.trim().toLowerCase().substring(0, 255);
    const sanitizedPhone = formatPhoneForStorage(phone);

    // Get request metadata for audit
    const ipAddress = getRateLimitKey(request);
    const userAgent = request.headers.get('user-agent')?.substring(0, 500) || '';

    // Insert subscriber with parameterized query (prevents SQL injection)
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO subscribers (name, email, phone, ip_address, user_agent, updated_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
         ON CONFLICT (email) DO UPDATE SET
           name = COALESCE(NULLIF($1, ''), subscribers.name),
           phone = COALESCE(NULLIF($3, ''), subscribers.phone),
           updated_at = CURRENT_TIMESTAMP`,
        [sanitizedName, sanitizedEmail, sanitizedPhone, ipAddress, userAgent]
      );
    } finally {
      client.release();
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed',
      },
      {
        headers: {
          'X-RateLimit-Remaining': remaining.toString()
        }
      }
    );
  } catch (error) {
    // Log full error for debugging
    console.error('Subscribe error:', error);

    // Generic error response (don't leak internal details)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
        ? 'https://empoweredmuslimah.org'
        : '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
