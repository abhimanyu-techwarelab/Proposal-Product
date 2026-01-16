import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromCookies, isTokenValid } from '@/lib/jwt-auth';

/**
 * API endpoint to get the current logged-in user's information
 */
export async function GET(request: NextRequest) {
  try {
    // Get cookies from request headers
    const cookieHeader = request.headers.get('cookie') || '';
    const token = getTokenFromCookies(cookieHeader);

    console.log('[/api/auth/me] Token present:', !!token);

    if (!token || !isTokenValid(token)) {
      console.log('[/api/auth/me] No valid token found');
      return NextResponse.json(
        { error: 'No valid token found' },
        { status: 401 }
      );
    }

    // Fetch user data from backend using /users/me endpoint (no permission required)
    // Derive backend URL from NEXT_PUBLIC_API_URL (remove /api suffix if present)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    let backendUrl = apiUrl.replace(/\/api$/, '') || 'http://localhost:3000';

    // Ensure HTTP for localhost (fix SSL errors in development)
    if (backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1')) {
      backendUrl = backendUrl.replace(/^https:/i, 'http:');
    }

    console.log('[/api/auth/me] Fetching from backend:', `${backendUrl}/users/me`);

    const response = await fetch(`${backendUrl}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('[/api/auth/me] Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('[/api/auth/me] Backend error:', errorText);
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: response.status }
      );
    }

    const userData = await response.json();

    // Return user data (excluding sensitive fields like password_hash)
    return NextResponse.json({
      id: userData.id,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      organization_id: userData.organization_id,
      role_id: userData.role_id,
      profile_image: userData.profile_image,
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve user information' },
      { status: 500 }
    );
  }
}
