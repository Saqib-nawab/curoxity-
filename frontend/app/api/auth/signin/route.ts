import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/src/lib/auth';

const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL || 'http://127.0.0.1:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(`${FASTAPI_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status });
    }

    const response = NextResponse.json(
      { user: data.user },
      { status: backendResponse.status }
    );

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: data.access_token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Signin proxy failed';

    return NextResponse.json(
      { detail: `Signin proxy error: ${message}` },
      { status: 500 }
    );
  }
}