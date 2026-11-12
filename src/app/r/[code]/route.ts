import { NextRequest, NextResponse } from 'next/server';

type ReferralRouteContext = {
    params: Promise<{ code: string }>;
};

export const GET = async (request: NextRequest, { params }: ReferralRouteContext) => {
    const { code } = await params;
    const requestedDestination = request.nextUrl.searchParams.get('to') || '/';
    const destination =
        requestedDestination.startsWith('/') && !requestedDestination.startsWith('//') ? requestedDestination : '/';
    const redirectUrl = new URL(destination, process.env.SITE_URL);

    redirectUrl.searchParams.set('ref', code);
    return NextResponse.redirect(redirectUrl, 307);
};
