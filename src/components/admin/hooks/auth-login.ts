import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';

import { login, logout } from '../services/auth.service';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

export const useLogin = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            if (!data.user) {
                Cookies.remove('token');
                toast.error(data.message || 'Bunday foydalanuvchi topilmadi');
                return;
            }

            if (data.user.role !== 'ADMIN') {
                Cookies.remove('token');
                toast.error('Bu panelga faqat admin kira oladi');
                return;
            }

            if (!data.token) {
                toast.error("Token topilmadi. Qayta urinib ko'ring");
                return;
            }

            Cookies.set('token', data.token);
            toast.success('Admin panelga xush kelibsiz');
            router.push('/admin');
            router.refresh();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error?.message || 'Email yoki parol xato');
        }
    });
};

export const useLogout = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            Cookies.remove('token');
            toast.success('Tizimdan chiqdingiz');
            router.push('/admin/auth/login');
            router.refresh();
        },
        onError: () => {
            Cookies.remove('token');
            router.push('/admin/auth/login');
            router.refresh();
        }
    });
};
