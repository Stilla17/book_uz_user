import Link from 'next/link';

type AdminBookPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

const AdminBookPage = async ({ params }: AdminBookPageProps) => {
    const { slug } = await params;

    return (
        <main className='min-h-screen bg-slate-50 p-6 dark:bg-slate-950'>
            <section className='mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                <p className='text-sm font-bold text-[#ef7f1a]'>Admin</p>
                <h1 className='mt-2 text-2xl font-black text-slate-950 dark:text-white'>Kitob sahifasi</h1>
                <p className='mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400'>
                    Bu sahifa uchun batafsil admin ko'rinishi hali ulanmagan. Slug: {slug}
                </p>
                <Link
                    href='/admin'
                    className='mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#ef7f1a] px-5 text-sm font-black text-white transition hover:bg-orange-600'>
                    Admin panelga qaytish
                </Link>
            </section>
        </main>
    );
};

export default AdminBookPage;
