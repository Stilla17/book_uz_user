import { NextRequest, NextResponse } from 'next/server';

const AUTH_PATHS = new Set([
    'register',
    'login',
    'phone/login',
    'phone/send-otp',
    'phone/verify-otp',
    'refresh',
    'logout',
    'forgot-password',
    'reset-password'
]);

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    const { path } = await params;
    const authPath = path.join('/');

    if (!AUTH_PATHS.has(authPath)) {
        return NextResponse.json({ success: false, message: 'Auth endpoint topilmadi' }, { status: 404 });
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiBaseUrl) {
        return NextResponse.json({ success: false, message: 'API URL sozlanmagan' }, { status: 500 });
    }

    const refreshToken = request.cookies.get('refreshToken')?.value;
    const body = await request.text();
    const response = await fetch(`${apiBaseUrl}/auth/${authPath}`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
            'Content-Type': request.headers.get('content-type') || 'application/json',
            ...(refreshToken ? { Cookie: `refreshToken=${encodeURIComponent(refreshToken)}` } : {})
        },
        body: body || undefined
    });

    const proxyResponse = new NextResponse(await response.text(), {
        status: response.status,
        headers: {
            'Content-Type': response.headers.get('content-type') || 'application/json',
            'Cache-Control': 'no-store'
        }
    });

    const setCookie = response.headers.get('set-cookie');
    if (setCookie) proxyResponse.headers.set('Set-Cookie', setCookie);

    return proxyResponse;
}
