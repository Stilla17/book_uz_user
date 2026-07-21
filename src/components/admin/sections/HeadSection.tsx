import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { Plus } from 'lucide-react';

type HeadSectionProps = {
    text: string;
    title: string;
    href: string;
};

const HeadSection = ({ text, title, href }: HeadSectionProps) => {
    return (
        <section className='flex flex-col gap-4 rounded-[24px] bg-base-100 p-4 shadow-sm ring-1 ring-base-300 md:flex-row md:items-center md:justify-between md:p-5'>
            <div>
                <h2 className='mt-1 text-2xl font-black text-base-content'>{title}</h2>
                <p className='mt-2 max-w-2xl text-sm font-semibold text-admin-muted'>{text}</p>
            </div>

            <Button asChild className='h-11 rounded-2xl bg-warning px-5 font-black text-warning-content hover:opacity-90'>
                <Link href={`/admin/${href}/new`}>
                    <Plus size={18} />
                    Yangi {title.toLowerCase()}
                </Link>
            </Button>
        </section>
    );
};

export default HeadSection;
