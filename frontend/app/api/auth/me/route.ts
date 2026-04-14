import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/src/lib/auth';

const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL || 'http://127.0.0.1:8000';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
    }

    const backendResponse = await fetch(`${FASTAPI_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      const response = NextResponse.json(data, { status: backendResponse.status });

      if (backendResponse.status === 401) {
        response.cookies.set({
          name: AUTH_COOKIE_NAME,
          value: '',
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 0,
        });
      }

      return response;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to fetch current user';

    return NextResponse.json(
      { detail: `Auth me proxy error: ${message}` },
      { status: 500 }
    );
  }
}