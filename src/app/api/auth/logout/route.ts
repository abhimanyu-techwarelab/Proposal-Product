import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Delete the cookie
    cookieStore.delete('product_auth_token');

    // Create response and explicitly set cookie deletion header
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Set cookie with expired date to ensure browser removes it
    // Match the exact same settings from login route
    response.cookies.set('product_auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Set to 0 to expire immediately
      path: '/',
      expires: new Date(0), // Also set expires to epoch time
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
