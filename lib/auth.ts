import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

/**
 * Admin Authentication Utility
 *
 * Uses API key authentication for admin routes.
 * The API key should be set in environment variables and never committed to git.
 *
 * For production, consider upgrading to:
 * - NextAuth.js with OAuth providers
 * - Clerk or Auth0 for managed authentication
 * - JWT-based session authentication
 */

// Secure string comparison to prevent timing attacks
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  try {
    // Use string encoding for secure comparison
    const bufA = (Buffer as any).from(a, 'utf8');
    const bufB = (Buffer as any).from(b, 'utf8');
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export interface AuthResult {
  authenticated: boolean;
  error?: string;
}

/**
 * Validate admin API key from request headers
 * Expects: Authorization: Bearer <ADMIN_API_KEY>
 */
export function validateAdminAuth(request: NextRequest): AuthResult {
  const adminApiKey = process.env.ADMIN_API_KEY;

  // Check if admin key is configured
  if (!adminApiKey || adminApiKey.length < 32) {
    console.error('ADMIN_API_KEY not configured or too short (min 32 chars)');
    return {
      authenticated: false,
      error: 'Server configuration error'
    };
  }

  // Get authorization header
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return {
      authenticated: false,
      error: 'Authorization header required'
    };
  }

  // Parse Bearer token
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return {
      authenticated: false,
      error: 'Invalid authorization format. Use: Bearer <token>'
    };
  }

  const providedKey = parts[1];

  // Secure comparison to prevent timing attacks
  if (!secureCompare(providedKey, adminApiKey)) {
    return {
      authenticated: false,
      error: 'Invalid API key'
    };
  }

  return { authenticated: true };
}

/**
 * Higher-order function to wrap admin routes with authentication
 */
export function withAdminAuth(
  handler: (request: NextRequest) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest) => {
    const auth = validateAdminAuth(request);

    if (!auth.authenticated) {
      // Log failed auth attempts (but not the actual key)
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
      console.warn(`Failed admin auth attempt from IP: ${ip}`);

      return NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    return handler(request);
  };
}

/**
 * Generate a secure random API key
 * Run this once to generate your ADMIN_API_KEY
 */
export function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 48;
  let result = '';
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}
