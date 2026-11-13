import { Hero } from '@/components/sections/Hero';
import { HomepageSections } from '@/components/sections/HomepageSections';
import HomepageStructuredData from '@/components/seo/HomepageStructuredData';
import { createPageMetadata, defaultDescription, defaultTitle } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    return createPageMetadata({ title: defaultTitle, description: defaultDescription, path: '/', locale });
}

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
    const { locale } = await params;

    return (
        <div className='bg-background flex flex-col dark:bg-slate-900'>
            <HomepageStructuredData locale={locale} />

            <h1 className='sr-only'>Book.uz — O‘zbekistondagi onlayn kitob do‘koni</h1>

            <Hero />

            <HomepageSections />
        </div>
    );
};

export default Page;
