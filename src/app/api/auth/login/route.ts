import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeJWT } from "@/lib/jwt-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Derive backend URL from NEXT_PUBLIC_API_URL (remove /api suffix if present)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    let backendUrl = apiUrl.replace(/\/api$/, "") || "http://localhost:3000";

    // Ensure HTTP for localhost (fix SSL errors in development)
    if (backendUrl.includes("localhost") || backendUrl.includes("127.0.0.1")) {
      backendUrl = backendUrl.replace(/^https:/i, "http:");
    }

    const loginUrl = `${backendUrl}/auth/login`;
    console.log(`[LOGIN] Attempting to connect to backend: ${loginUrl}`);

    // Call backend login endpoint
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Login failed" }));
      return NextResponse.json(
        { error: errorData.error || "Invalid email or password" },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Backend returns access_token (see auth.controller.ts)
    const token = data.access_token || data.token || data.jwt;

    if (!token) {
      return NextResponse.json(
        { error: "No token received from backend" },
        { status: 500 }
      );
    }

    // Decode token to check if user is an admin
    const payload = decodeJWT(token);

    // Block admin users from logging into Product app
    if (payload && payload.has_admin_access === true) {
      return NextResponse.json(
        {
          error:
            "Admin users cannot access the Product application. Please use the Admin Panel instead.",
        },
        { status: 403 }
      );
    }

    // Decode token to get expiration time
    let maxAge = 60 * 60 * 24; // Default 24 hours in seconds

    if (payload && payload.exp) {
      // Calculate time until expiration in seconds
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiration = payload.exp - currentTime;

      // Only use calculated value if it's positive, otherwise use default
      if (timeUntilExpiration > 0) {
        maxAge = timeUntilExpiration;
      }
    }

    // Set HTTP-only cookie with JWT token
    const cookieStore = await cookies();
    cookieStore.set("product_auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAge, // Match JWT token expiration
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Login successful",
    });
  } catch (error: any) {
    console.error("Login error:", error);

    // Provide more specific error messages
    if (
      error.code === "ERR_SSL_WRONG_VERSION_NUMBER" ||
      error.message?.includes("SSL")
    ) {
      return NextResponse.json(
        {
          error:
            "Backend connection error: SSL/TLS mismatch. Ensure backend is running on HTTP (not HTTPS) for local development.",
        },
        { status: 500 }
      );
    }

    if (
      error.code === "ECONNREFUSED" ||
      error.message?.includes("fetch failed")
    ) {
      return NextResponse.json(
        {
          error:
            "Cannot connect to backend server. Please ensure the backend is running.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred during login. Please try again." },
      { status: 500 }
    );
  }
}
