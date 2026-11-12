import { getHeroBanners } from '@/lib/getHeroBanners';

import { HeroCarousel } from './HeroCarousel';

export async function Hero() {
    const banners = await getHeroBanners();

    return <HeroCarousel banners={banners} />;
}
