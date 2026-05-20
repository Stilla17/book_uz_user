'use client';

import { type ReactNode, useState } from 'react';

import { useLogout } from '@/components/admin/hooks/auth-login';
import AdminRedirect from '@/components/admin/redirect/AdminRedirect';
import AsideAdmin from '@/components/admin/sections/AsideAdmin';
import HeaderAdmin from '@/components/admin/sections/HeaderAdmin';

import { Loader2, LogOut } from 'lucide-react';

type AdminLayoutProps = {
    children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { mutate: logout, isPending: isLoggingOut } = useLogout();

    const handleLogout = () => {
        logout(undefined, {
            onSettled: () => setIsLogoutModalOpen(false)
        });
    };

    return (
        <AdminRedirect>
            <div className='h-screen overflow-hidden bg-[#d8ccbd] p-3 text-[#2f2a25] md:p-5 dark:bg-slate-950 dark:text-white'>
                <div className='mx-auto flex h-[calc(100vh-24px)] max-w-full overflow-hidden rounded-[28px] bg-[#f7f0e6] shadow-[0_24px_80px_rgba(64,45,30,0.18)] md:h-[calc(100vh-40px)] dark:bg-slate-900'>
                    <AsideAdmin />

                    <div className='flex min-w-0 flex-1 flex-col'>
                        <HeaderAdmin setIsLogoutModalOpen={setIsLogoutModalOpen} />

                        <main className='min-w-0 flex-1 overflow-y-auto bg-[#f7f0e6] p-4 md:p-6 dark:bg-slate-900'>
                            {children}
                        </main>
                    </div>
                </div>

                {isLogoutModalOpen && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm'>
                        <div className='w-full max-w-sm rounded-[24px] bg-[#fffaf2] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                            <div className='mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-500/10'>
                                <LogOut size={24} />
                            </div>

                            <div className='mt-4 text-center'>
                                <h2 className='text-xl font-black text-[#2f2a25] dark:text-white'>
                                    Tizimdan chiqasizmi?
                                </h2>
                                <p className='mt-2 text-sm leading-6 font-semibold text-[#8b7e70] dark:text-slate-400'>
                                    Admin paneldan chiqish uchun tasdiqlang.
                                </p>
                            </div>

                            <div className='mt-6 grid grid-cols-2 gap-3'>
                                <button
                                    type='button'
                                    disabled={isLoggingOut}
                                    onClick={() => setIsLogoutModalOpen(false)}
                                    className='h-11 rounded-2xl bg-white text-sm font-black text-[#6f6255] ring-1 ring-[#eadfce] transition hover:bg-[#f2e7d8] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800'>
                                    Bekor qilish
                                </button>
                                <button
                                    type='button'
                                    disabled={isLoggingOut}
                                    onClick={handleLogout}
                                    className='flex h-11 items-center justify-center gap-2 rounded-2xl bg-red-500 text-sm font-black text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70'>
                                    {isLoggingOut ? (
                                        <Loader2 size={17} className='animate-spin' />
                                    ) : (
                                        <LogOut size={17} />
                                    )}
                                    Chiqish
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminRedirect>
    );
}
