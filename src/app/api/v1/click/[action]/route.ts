import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ACTIONS = new Set(['prepare', 'complete']);

export async function POST(request: NextRequest, context: { params: Promise<{ action: string }> }) {
    const { action } = await context.params;

    if (!ALLOWED_ACTIONS.has(action)) {
        return NextResponse.json({ error: -3, error_note: 'Action not found' }, { status: 404 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
        return NextResponse.json({ error: -8, error_note: 'API URL is not configured' }, { status: 500 });
    }

    try {
        const body = await request.text();
        const response = await fetch(`${apiUrl.replace(/\/$/, '')}/click/${action}`, {
            method: 'POST',
            headers: {
                'content-type': request.headers.get('content-type') || 'application/x-www-form-urlencoded'
            },
            body,
            cache: 'no-store'
        });

        return new NextResponse(await response.text(), {
            status: response.status,
            headers: { 'content-type': response.headers.get('content-type') || 'application/json' }
        });
    } catch {
        return NextResponse.json({ error: -8, error_note: 'Internal server error' }, { status: 502 });
    }
}
