import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/src/lib/auth';

export async function POST() {
  const response = NextResponse.json({ detail: 'Signed out successfully.' });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}