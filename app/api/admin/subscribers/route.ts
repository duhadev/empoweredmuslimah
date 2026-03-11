import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { validateAdminAuth } from '@/lib/auth';

/**
 * Protected Admin API - Subscribers Management
 *
 * All routes require authentication via Bearer token.
 * Usage: Authorization: Bearer <ADMIN_API_KEY>
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// GET /api/admin/subscribers - List all subscribers (protected)
export async function GET(request: NextRequest) {
  // Authenticate request
  const auth = validateAdminAuth(request);
  if (!auth.authenticated) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    console.warn(`Unauthorized admin access attempt from IP: ${ip}`);
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
    const search = searchParams.get('search') || '';
    const sortBy = ['created_at', 'email', 'name'].includes(searchParams.get('sort') || '')
      ? searchParams.get('sort')
      : 'created_at';
    const sortOrder = searchParams.get('order') === 'asc' ? 'ASC' : 'DESC';

    const offset = (page - 1) * limit;

    const client = await pool.connect();
    try {
      // Build query with optional search
      let whereClause = '';
      const queryParams: (string | number)[] = [];

      if (search) {
        whereClause = 'WHERE email ILIKE $1 OR name ILIKE $1';
        queryParams.push(`%${search}%`);
      }

      // Get total count
      const countQuery = `SELECT COUNT(*) FROM subscribers ${whereClause}`;
      const countResult = await client.query(countQuery, queryParams);
      const totalCount = parseInt(countResult.rows[0].count);

      // Get subscribers with pagination
      const subscribersQuery = `
        SELECT
          id,
          name,
          email,
          phone,
          created_at,
          updated_at
        FROM subscribers
        ${whereClause}
        ORDER BY ${sortBy} ${sortOrder}
        LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
      `;

      const subscribersResult = await client.query(subscribersQuery, [
        ...queryParams,
        limit,
        offset
      ]);

      // Note: ip_address and user_agent are intentionally excluded from response
      // They are stored for audit/security but not exposed via API

      return NextResponse.json({
        success: true,
        data: {
          subscribers: subscribersResult.rows,
          pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            hasMore: offset + subscribersResult.rows.length < totalCount
          }
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Admin subscribers error:', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/subscribers?id=<id> - Delete a subscriber (protected)
export async function DELETE(request: NextRequest) {
  // Authenticate request
  const auth = validateAdminAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Valid subscriber ID required' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM subscribers WHERE id = $1 RETURNING id, email',
        [parseInt(id)]
      );

      if (result.rowCount === 0) {
        return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
      }

      // Log deletion for audit
      console.log(`Subscriber deleted: ${result.rows[0].email} (ID: ${id})`);

      return NextResponse.json({
        success: true,
        message: 'Subscriber deleted successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Admin delete error:', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Export subscribers as CSV (protected)
export async function POST(request: NextRequest) {
  // Authenticate request
  const auth = validateAdminAuth(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action !== 'export') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT name, email, phone, created_at
        FROM subscribers
        ORDER BY created_at DESC
      `);

      // Generate CSV
      const headers = ['Name', 'Email', 'Phone', 'Subscribed At'];
      const csvRows = [
        headers.join(','),
        ...result.rows.map(row =>
          [
            `"${(row.name || '').replace(/"/g, '""')}"`,
            `"${row.email}"`,
            `"${(row.phone || '').replace(/"/g, '""')}"`,
            `"${row.created_at}"`
          ].join(',')
        )
      ];

      const csv = csvRows.join('\n');

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="subscribers_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Admin export error:', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
