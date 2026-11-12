'use client';

import { FormEvent, useMemo, useState } from 'react';

import {
    useAdminReferralsQuery,
    useCreateReferral,
    useDeleteReferral,
    useUpdateReferral
} from '@/components/admin/hooks/queries/referral';
import { formatPrice } from '@/utils/currency';

import { Check, Copy, Link2, MousePointerClick, Pencil, Plus, ShoppingBag, Trash2, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminReferralsPage = () => {
    const { data: referrals = [], isLoading } = useAdminReferralsQuery();
    const createReferral = useCreateReferral();
    const updateReferral = useUpdateReferral();
    const deleteReferral = useDeleteReferral();
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [bookPath, setBookPath] = useState('/');
    const [copiedCode, setCopiedCode] = useState('');
    const [editingId, setEditingId] = useState('');

    const totals = useMemo(
        () =>
            referrals.reduce(
                (sum, item) => ({
                    clicks: sum.clicks + item.clickCount,
                    orders: sum.orders + item.completedOrders,
                    customers: sum.customers + item.customersCount,
                    revenue: sum.revenue + item.revenue
                }),
                { clicks: 0, orders: 0, customers: 0, revenue: 0 }
            ),
        [referrals]
    );

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            if (editingId) {
                await updateReferral.mutateAsync({ id: editingId, data: { name, code } });
            } else {
                await createReferral.mutateAsync({ name, code });
            }
            setName('');
            setCode('');
            setEditingId('');
            toast.success(editingId ? 'Bloger ma’lumotlari yangilandi' : 'Bloger havolasi yaratildi');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Referral saqlanmadi');
        }
    };

    const startEditing = (id: string, referralName: string, referralCode: string) => {
        setEditingId(id);
        setName(referralName);
        setCode(referralCode);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEditing = () => {
        setEditingId('');
        setName('');
        setCode('');
    };

    const removeReferral = async (id: string, referralName: string) => {
        if (!window.confirm(`${referralName} referralini o‘chirmoqchimisiz?`)) return;

        try {
            await deleteReferral.mutateAsync(id);
            if (editingId === id) cancelEditing();
            toast.success('Bloger referrali o‘chirildi');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Referral o‘chirilmadi');
        }
    };

    const getLink = (referralCode: string) => {
        const origin = 'https://book.uz';
        const normalizedPath = bookPath.startsWith('/') && !bookPath.startsWith('//') ? bookPath : '/';

        return `${origin}/r/${referralCode}?to=${encodeURIComponent(normalizedPath)}`;
    };

    const copyLink = async (referralCode: string) => {
        await navigator.clipboard.writeText(getLink(referralCode));
        setCopiedCode(referralCode);
        window.setTimeout(() => setCopiedCode(''), 1500);
    };

    const cards = [
        { label: 'Jami kliklar', value: totals.clicks, icon: MousePointerClick },
        { label: 'Buyurtmalar', value: totals.orders, icon: ShoppingBag },
        { label: 'Noyob mijozlar', value: totals.customers, icon: Users },
        { label: 'Savdo summasi', value: formatPrice(totals.revenue), icon: Link2 }
    ];

    return (
        <div className='space-y-5'>
            <div>
                <h1 className='text-2xl font-black'>Bloger havolalari</h1>
                <p className='text-admin-dim mt-1 text-sm'>Referral havolalar, kliklar va ulardan kelgan savdolar.</p>
            </div>

            <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                {cards.map(({ label, value, icon: Icon }) => (
                    <div key={label} className='bg-admin-white ring-base-300 rounded-3xl p-5 shadow-sm ring-1'>
                        <Icon className='text-warning mb-3' size={22} />
                        <p className='text-admin-dim text-xs font-bold'>{label}</p>
                        <p className='mt-1 text-xl font-black'>{value}</p>
                    </div>
                ))}
            </div>

            <form
                onSubmit={submit}
                className='bg-admin-white ring-base-300 grid gap-3 rounded-3xl p-5 ring-1 lg:grid-cols-[1fr_1fr_auto_auto]'>
                <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder='Bloger nomi'
                    required
                    className='bg-base-200 h-11 rounded-xl px-4 outline-none'
                />
                <input
                    value={code}
                    onChange={(event) => setCode(event.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder='Kod: aziz_blog'
                    minLength={2}
                    required
                    className='bg-base-200 h-11 rounded-xl px-4 outline-none'
                />
                <button
                    disabled={createReferral.isPending || updateReferral.isPending}
                    className='bg-warning text-warning-content flex h-11 items-center justify-center gap-2 rounded-xl px-5 font-black disabled:opacity-60'>
                    {editingId ? <Pencil size={18} /> : <Plus size={18} />}
                    {editingId ? 'Saqlash' : "Qo'shish"}
                </button>
                {editingId ? (
                    <button
                        type='button'
                        onClick={cancelEditing}
                        className='bg-base-200 flex h-11 items-center justify-center gap-2 rounded-xl px-5 font-black'>
                        <X size={18} /> Bekor qilish
                    </button>
                ) : null}
            </form>

            <section className='bg-admin-white ring-base-300 overflow-hidden rounded-3xl ring-1'>
                <div className='border-base-300 flex flex-col gap-2 border-b p-4 md:flex-row md:items-center md:justify-between'>
                    <h2 className='font-black'>Blogerlar ({referrals.length})</h2>
                    <input
                        value={bookPath}
                        onChange={(event) => setBookPath(event.target.value)}
                        placeholder='/book/kitob-slug'
                        className='bg-base-200 h-10 min-w-72 rounded-xl px-3 text-sm outline-none'
                    />
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full min-w-[900px] text-left text-sm'>
                        <thead className='text-admin-dim border-base-300 border-b text-xs uppercase'>
                            <tr>
                                <th className='p-4'>Bloger</th>
                                <th className='p-4'>Kod</th>
                                <th className='p-4'>Klik</th>
                                <th className='p-4'>Buyurtma</th>
                                <th className='p-4'>Mijoz</th>
                                <th className='p-4'>Savdo</th>
                                <th className='p-4'>Holat</th>
                                <th className='p-4'>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className='p-8 text-center'>
                                        Yuklanmoqda...
                                    </td>
                                </tr>
                            ) : referrals.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className='p-8 text-center'>
                                        Hali bloger qo'shilmagan.
                                    </td>
                                </tr>
                            ) : (
                                referrals.map((referral) => (
                                    <tr key={referral._id} className='border-base-300 border-b last:border-0'>
                                        <td className='p-4 font-black'>{referral.name}</td>
                                        <td className='p-4 font-mono'>{referral.code}</td>
                                        <td className='p-4'>{referral.clickCount}</td>
                                        <td className='p-4'>{referral.completedOrders}</td>
                                        <td className='p-4'>{referral.customersCount}</td>
                                        <td className='p-4 font-bold'>{formatPrice(referral.revenue)}</td>
                                        <td className='p-4'>
                                            <button
                                                type='button'
                                                disabled={updateReferral.isPending}
                                                onClick={() =>
                                                    updateReferral.mutate({
                                                        id: referral._id,
                                                        data: { isActive: !referral.isActive }
                                                    })
                                                }
                                                className={`rounded-full px-3 py-1 text-xs font-black ${referral.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                                {referral.isActive ? 'Faol' : 'Nofaol'}
                                            </button>
                                        </td>
                                        <td className='p-4'>
                                            <div className='flex items-center gap-2'>
                                                <button
                                                    type='button'
                                                    title='Havolani nusxalash'
                                                    onClick={() => copyLink(referral.code)}
                                                    className='bg-base-200 inline-flex size-9 items-center justify-center rounded-xl'>
                                                    {copiedCode === referral.code ? (
                                                        <Check size={16} />
                                                    ) : (
                                                        <Copy size={16} />
                                                    )}
                                                </button>
                                                <button
                                                    type='button'
                                                    title='Tahrirlash'
                                                    onClick={() =>
                                                        startEditing(referral._id, referral.name, referral.code)
                                                    }
                                                    className='bg-base-200 inline-flex size-9 items-center justify-center rounded-xl'>
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    type='button'
                                                    title="O'chirish"
                                                    disabled={deleteReferral.isPending}
                                                    onClick={() => removeReferral(referral._id, referral.name)}
                                                    className='inline-flex size-9 items-center justify-center rounded-xl bg-red-50 text-red-600 disabled:opacity-50'>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminReferralsPage;
