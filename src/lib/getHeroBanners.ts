import type { UserBanner } from '@/services/userBanner.service';

import 'server-only';

type BannerApiResponse = {
    data?: UserBanner[];
};

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '');

export async function getHeroBanners(): Promise<UserBanner[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
        console.error('Hero banner API URL topilmadi');
        return [];
    }

    try {
        const response = await fetch(`${normalizeBaseUrl(baseUrl)}/banners?type=hero`, {
            headers: {
                Accept: 'application/json'
            },
            next: {
                revalidate: 60,
                tags: ['hero-banners']
            }
        });

        if (!response.ok) {
            console.error(`Hero bannerlarni olishda xato: ${response.status}`);
            return [];
        }

        const result = (await response.json()) as BannerApiResponse;

        return Array.isArray(result.data) ? result.data : [];
    } catch (error) {
        console.error('Hero bannerlarni olishda xato:', error);
        return [];
    }
}
