import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Derive backend URL from NEXT_PUBLIC_API_URL
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    let backendUrl = apiUrl.replace(/\/api$/, "") || "http://localhost:3000";

    // Ensure HTTP for localhost
    if (backendUrl.includes("localhost") || backendUrl.includes("127.0.0.1")) {
      backendUrl = backendUrl.replace(/^https:/i, "http:");
    }

    const createUserUrl = `${backendUrl}/users/create`;
    console.log(`[REGISTER] Creating user at: ${createUserUrl}`);

    const response = await fetch(createUserUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, first_name, last_name }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to create user" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("User creation error:", error);

    const errorMessage = error instanceof Error ? error.message : "";

    if (errorMessage.includes("ECONNREFUSED") || errorMessage.includes("fetch failed")) {
      return NextResponse.json(
        { message: "Cannot connect to backend server." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "An error occurred during user creation." },
      { status: 500 }
    );
  }
}
