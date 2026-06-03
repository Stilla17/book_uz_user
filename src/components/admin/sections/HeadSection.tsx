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
        <section className='flex flex-col gap-4 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:flex-row md:items-center md:justify-between md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
            <div>
                <h2 className='mt-1 text-2xl font-black text-[#2f2a25] dark:text-white'>{title}</h2>
                <p className='mt-2 max-w-2xl text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>{text}</p>
            </div>

            <Button asChild className='h-11 rounded-2xl bg-[#ef7f1a] px-5 font-black text-white hover:bg-orange-600'>
                <Link href={`/admin/${href}/new`}>
                    <Plus size={18} />
                    Yangi {title.toLowerCase()}
                </Link>
            </Button>
        </section>
    );
};

export default HeadSection;
