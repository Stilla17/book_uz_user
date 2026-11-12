import type { HrStatus } from '@/types/hr';

export const hrStatusMeta: Record<HrStatus, { label: string; className: string }> = {
    new: { label: 'Yangi', className: 'bg-blue-100 text-blue-700' },
    reviewing: { label: 'Ko‘rib chiqilmoqda', className: 'bg-amber-100 text-amber-700' },
    approved: { label: 'Qabul qilindi', className: 'bg-emerald-100 text-emerald-700' },
    rejected: { label: 'Rad etildi', className: 'bg-red-100 text-red-700' }
};

export const hrStatusOptions = Object.entries(hrStatusMeta) as [HrStatus, (typeof hrStatusMeta)[HrStatus]][];

export const getHrErrorMessage = (error: unknown, fallback: string) => {
    const apiError = error as { response?: { data?: { message?: string } } };
    return apiError.response?.data?.message || fallback;
};

export const formatHrDate = (value?: string) => {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? '—'
        : new Intl.DateTimeFormat('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};
