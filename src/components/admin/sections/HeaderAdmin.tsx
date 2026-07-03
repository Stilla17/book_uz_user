import { useTheme } from '@/context/ThemeContext';

import { BarChart3, Bell, Moon, Sun } from 'lucide-react';

const HeaderAdmin = ({
    setIsLogoutModalOpen
}: {
    setIsLogoutModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { theme, setTheme } = useTheme();

    return (
        <header className='flex flex-wrap items-center justify-between gap-4 border-b border-[#eadfce] bg-[#fff8ee] px-4 py-4 md:px-6 dark:border-slate-800 dark:bg-slate-950'>
            <div>
                <p className='text-xs font-bold text-[#9d907e] uppercase dark:text-slate-500'>BookUz boshqaruvi</p>
                <h1 className='mt-1 text-2xl font-black text-[#2f2a25] dark:text-white'>Admin Panel</h1>
            </div>

            <div className='flex items-center gap-2'>
                <button
                    type='button'
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    className='grid size-11 place-items-center rounded-2xl bg-white text-[#817466] shadow-sm transition hover:text-[#ef7f1a] dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white'>
                    {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
                </button>

                <button
                    type='button'
                    onClick={() => setIsLogoutModalOpen(true)}
                    aria-label='Admin menyu'
                    title='Chiqish'
                    className='grid size-11 place-items-center rounded-2xl bg-[#7c6dc8] text-sm font-black text-white shadow-sm transition hover:bg-[#6959bb]'>
                    A
                </button>
            </div>
        </header>
    );
};

export default HeaderAdmin;
