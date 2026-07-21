import { useTheme } from '@/context/ThemeContext';

import { Moon, Sun } from 'lucide-react';

const HeaderAdmin = ({
    setIsLogoutModalOpen
}: {
    setIsLogoutModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { theme, setTheme } = useTheme();

    return (
        <header className='flex flex-wrap items-center justify-between gap-4 border-b border-base-300 bg-admin-header px-4 py-4 md:px-6'>
            <div>
                <p className='text-xs font-bold text-admin-subtle uppercase'>BookUz boshqaruvi</p>
                <h1 className='mt-1 text-2xl font-black text-base-content'>Admin Panel</h1>
            </div>

            <div className='flex items-center gap-2'>
                <button
                    type='button'
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    className='grid size-11 place-items-center rounded-2xl bg-admin-white text-admin-dim shadow-sm transition hover:text-primary'>
                    {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
                </button>

                <button
                    type='button'
                    onClick={() => setIsLogoutModalOpen(true)}
                    aria-label='Admin menyu'
                    title='Chiqish'
                    className='grid size-11 place-items-center rounded-2xl bg-accent text-sm font-black text-accent-content shadow-sm transition hover:opacity-90'>
                    A
                </button>
            </div>
        </header>
    );
};

export default HeaderAdmin;
