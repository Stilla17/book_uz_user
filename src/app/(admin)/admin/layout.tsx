'use client';

import { type ReactNode, useState } from 'react';

import { useLogout } from '@/components/admin/hooks/auth-login';
import AdminRedirect from '@/components/admin/redirect/AdminRedirect';
import AsideAdmin from '@/components/admin/sections/AsideAdmin';
import HeaderAdmin from '@/components/admin/sections/HeaderAdmin';
import { AdminThemeProvider, useAdminTheme } from '@/context/AdminThemeContext';
import { useTheme } from '@/context/ThemeContext';

import { Loader2, LogOut } from 'lucide-react';

type AdminLayoutProps = {
    children: ReactNode;
};

const AdminLayoutContent = ({ children }: AdminLayoutProps) => {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const { adminTheme } = useAdminTheme();
    const { theme } = useTheme();
    const resolvedAdminTheme = adminTheme === 'valentine' ? 'valentine' : theme === 'dark' ? 'dark' : 'bookuzadmin';

    const handleLogout = () => {
        logout(undefined, {
            onSettled: () => setIsLogoutModalOpen(false)
        });
    };

    return (
        <AdminRedirect>
            <div data-theme={resolvedAdminTheme} className='admin-theme-scope h-screen overflow-hidden bg-admin-shell p-3 text-base-content md:p-5'>
                <div className='mx-auto flex h-[calc(100vh-24px)] max-w-full overflow-hidden rounded-[28px] bg-base-200 shadow-[0_24px_80px_rgba(64,45,30,0.18)] md:h-[calc(100vh-40px)]'>
                    <AsideAdmin />

                    <div className='flex min-w-0 flex-1 flex-col'>
                        <HeaderAdmin setIsLogoutModalOpen={setIsLogoutModalOpen} />

                        <main className='min-w-0 flex-1 overflow-y-auto bg-base-200 p-4 md:p-6'>
                            {children}
                        </main>
                    </div>
                </div>

                {isLogoutModalOpen && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm'>
                        <div className='w-full max-w-sm rounded-[24px] bg-base-100 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] ring-1 ring-base-300'>
                            <div className='mx-auto grid size-14 place-items-center rounded-2xl bg-error/10 text-error'>
                                <LogOut size={24} />
                            </div>

                            <div className='mt-4 text-center'>
                                <h2 className='text-xl font-black text-base-content'>
                                    Tizimdan chiqasizmi?
                                </h2>
                                <p className='mt-2 text-sm leading-6 font-semibold text-admin-muted'>
                                    Admin paneldan chiqish uchun tasdiqlang.
                                </p>
                            </div>

                            <div className='mt-6 grid grid-cols-2 gap-3'>
                                <button
                                    type='button'
                                    disabled={isLoggingOut}
                                    onClick={() => setIsLogoutModalOpen(false)}
                                    className='h-11 rounded-2xl bg-base-100 text-sm font-black text-admin-soft ring-1 ring-base-300 transition hover:bg-base-200 disabled:cursor-not-allowed disabled:opacity-70'>
                                    Bekor qilish
                                </button>
                                <button
                                    type='button'
                                    disabled={isLoggingOut}
                                    onClick={handleLogout}
                                    className='flex h-11 items-center justify-center gap-2 rounded-2xl bg-error text-sm font-black text-error-content transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70'>
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
};

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <AdminThemeProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AdminThemeProvider>
    );
}
