import { NextResponse } from 'next/server';

const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL || 'http://127.0.0.1:8000';

export async function GET() {
  try {
    const backendResponse = await fetch(`${FASTAPI_BASE_URL}/health`, {
      method: 'GET',
      cache: 'no-store',
    });

    const contentType = backendResponse.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const data = await backendResponse.json();
      return NextResponse.json(data, { status: backendResponse.status });
    }

    const text = await backendResponse.text();

    return new NextResponse(text, {
      status: backendResponse.status,
      headers: {
        'Content-Type': contentType || 'text/plain',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to reach FastAPI backend';

    return NextResponse.json(
      { detail: `Health proxy error: ${message}` },
      { status: 500 }
    );
  }
}