import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_IMAGE_HOSTS = new Set(['res.cloudinary.com', 'backend.book.uz', 'images.unsplash.com']);

const isAllowedImageHost = (hostname: string) =>
    ALLOWED_IMAGE_HOSTS.has(hostname) || hostname.endsWith('.r2.dev');

export const GET = async (request: NextRequest) => {
    const source = request.nextUrl.searchParams.get('url');

    if (!source) {
        return NextResponse.json({ message: 'Rasm manzili berilmagan' }, { status: 400 });
    }

    try {
        const imageUrl = new URL(source);

        if (imageUrl.protocol !== 'https:' || !isAllowedImageHost(imageUrl.hostname)) {
            return NextResponse.json({ message: 'Rasm manziliga ruxsat berilmagan' }, { status: 400 });
        }

        const imageResponse = await fetch(imageUrl, {
            signal: AbortSignal.timeout(15_000),
            next: { revalidate: 86_400 }
        });
        const contentType = imageResponse.headers.get('content-type') || '';

        if (!imageResponse.ok || !contentType.startsWith('image/')) {
            return NextResponse.json({ message: 'Rasmni yuklab bo‘lmadi' }, { status: 502 });
        }

        return new NextResponse(await imageResponse.arrayBuffer(), {
            headers: {
                'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
                'Content-Type': contentType
            }
        });
    } catch {
        return NextResponse.json({ message: 'Rasmni yuklab bo‘lmadi' }, { status: 502 });
    }
};
