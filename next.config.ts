import type { NextConfig } from 'next';

import initializeBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = initializeBundleAnalyzer({
    enabled: process.env.BUNDLE_ANALYZER_ENABLED === 'true'
});

const ONE_MONTH = 60 * 60 * 24 * 30;

const nextConfig: NextConfig = {
    output: 'standalone',
    distDir: process.env.NEXT_DIST_DIR || '.next',

    images: {
        formats: ['image/avif', 'image/webp'],

        // Next optimallashtirgan rasmlarni kamida 30 kun saqlaydi.
        minimumCacheTTL: ONE_MONTH,

        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com'
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com'
            },
            {
                protocol: 'https',
                hostname: 'backend.book.uz'
            }
        ]
    },

    async headers() {
        return [
            {
                source: '/images/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            }
        ];
    }
};

export default withBundleAnalyzer(nextConfig);
