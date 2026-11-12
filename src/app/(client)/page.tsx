import { Hero } from '@/components/sections/Hero';
import { HomepageSections } from '@/components/sections/HomepageSections';
import HomepageStructuredData from '@/components/seo/HomepageStructuredData';

const Page = () => {
    return (
        <div className='bg-background flex flex-col dark:bg-slate-900'>
            <HomepageStructuredData />

            <h1 className='sr-only'>Book.uz — O‘zbekistondagi onlayn kitob do‘koni</h1>

            <Hero />

            <HomepageSections />
        </div>
    );
};

export default Page;
