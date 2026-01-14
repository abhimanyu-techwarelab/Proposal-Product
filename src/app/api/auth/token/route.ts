import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromCookies, isTokenValid } from '@/lib/jwt-auth';

/**
 * API endpoint to get the auth token for client-side use
 * This allows client-side code to get the token from HTTP-only cookies
 * to include in Authorization headers
 */
export async function GET(request: NextRequest) {
  try {
    // Get cookies from request headers
    const cookieHeader = request.headers.get('cookie') || '';
    const token = getTokenFromCookies(cookieHeader);

    if (!token || !isTokenValid(token)) {
      return NextResponse.json(
        { error: 'No valid token found' },
        { status: 401 }
      );
    }

    // Return the token (client will use it in Authorization header)
    return NextResponse.json({
      token,
    });
  } catch (error) {
    console.error('Token retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve token' },
      { status: 500 }
    );
  }
}
