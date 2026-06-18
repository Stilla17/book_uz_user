import { ServicesSection } from '@/components/sections/ServicesSection';
import { SupportSection } from '@/components/sections/SupportSection';

const ServicePage = () => {
    return (
        <main className='bg-background min-h-screen dark:bg-slate-900'>
            <div className='[&_.services-section-header]:items-center [&_.services-section-header]:text-center [&_.services-section-header]:md:flex-col'>
                <ServicesSection />
            </div>
            <SupportSection />
        </main>
    );
};

export default ServicePage;
