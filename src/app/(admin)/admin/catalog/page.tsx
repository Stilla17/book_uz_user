'use client';

import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';

import Image from 'next/image';

import {
    useCreateCatalog,
    useDeleteCatalog,
    useSyncCatalogPrices,
    useToggleCatalogStatus,
    useUpdateCatalog
} from '@/components/admin/hooks/catalogHooks/useCatalogMutations';
import { useCatalogListQuery } from '@/components/admin/hooks/queries/catalog';
import PaginationFooter from '@/components/admin/other/PaginationFooter';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { CatalogCategory, CatalogCategoryFilter, CatalogItem, CatalogStatusFilter } from '@/types/catalog';

import {
    Baby,
    BookOpen,
    Check,
    ChevronDown,
    Eye,
    EyeOff,
    GraduationCap,
    ImagePlus,
    Loader2,
    Pencil,
    RefreshCw,
    Save,
    Sparkles,
    Trash2,
    X
} from 'lucide-react';
import toast from 'react-hot-toast';

const PAGE_SIZE = 20;
const dateFormatter = new Intl.DateTimeFormat('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
});
const formatPrice = (price: number) => `${price.toLocaleString('uz-UZ')} so‘m`;

const categories: Array<{ value: CatalogCategoryFilter; label: string }> = [
    { value: 'hammasi', label: 'Hammasi' },
    { value: 'badiiy', label: 'Badiiy adabiyotlar' },
    { value: 'nobadiiy', label: 'Nobadiiy adabiyotlar' },
    { value: 'trend', label: 'Trend' },
    { value: 'bolalar-adabiyoti', label: 'Bolalar adabiyotlari' }
];

const statuses: Array<{ value: CatalogStatusFilter; label: string }> = [
    { value: 'hammasi', label: 'Barcha holatlar' },
    { value: 'active', label: 'Faol' },
    { value: 'inactive', label: 'Nofaol' }
];

const editableCategories = categories.filter(
    (category): category is { value: CatalogCategory; label: string } => category.value !== 'hammasi'
);

const categoryIcons = {
    badiiy: BookOpen,
    nobadiiy: GraduationCap,
    trend: Sparkles,
    'bolalar-adabiyoti': Baby
} satisfies Record<CatalogCategory, typeof BookOpen>;

const getErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error !== 'object' || error === null) return fallback;

    const response = 'response' in error ? error.response : undefined;
    if (typeof response !== 'object' || response === null || !('data' in response)) return fallback;

    const data = response.data;
    if (typeof data !== 'object' || data === null || !('message' in data)) return fallback;

    return typeof data.message === 'string' ? data.message : fallback;
};

export default function AdminCatalogPage() {
    const [activeCategory, setActiveCategory] = useState<CatalogCategoryFilter>('hammasi');
    const [activeStatus, setActiveStatus] = useState<CatalogStatusFilter>('hammasi');
    const [page, setPage] = useState(1);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
    const [moyskladExternalCode, setMoyskladExternalCode] = useState('');
    const [category, setCategory] = useState<CatalogCategory>('badiiy');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [pendingStatusId, setPendingStatusId] = useState<string | null>(null);

    const { data, isLoading, isFetching, isError, refetch } = useCatalogListQuery(
        page,
        PAGE_SIZE,
        activeCategory,
        activeStatus
    );
    const createCatalog = useCreateCatalog();
    const updateCatalog = useUpdateCatalog();
    const deleteCatalog = useDeleteCatalog();
    const syncCatalogPrices = useSyncCatalogPrices();
    const toggleCatalogStatus = useToggleCatalogStatus();

    const catalogItems = data?.catalogs ?? [];
    const isSaving = createCatalog.isPending || updateCatalog.isPending;
    const selectedCategory = editableCategories.find((item) => item.value === category)!;
    const SelectedCategoryIcon = categoryIcons[category];

    useEffect(() => {
        if (!imageFile) {
            setImagePreview(editingItem?.image ?? '');
            return;
        }

        const previewUrl = URL.createObjectURL(imageFile);
        setImagePreview(previewUrl);

        return () => URL.revokeObjectURL(previewUrl);
    }, [editingItem?.image, imageFile]);

    const resetEditor = () => {
        setIsEditorOpen(false);
        setEditingItem(null);
        setMoyskladExternalCode('');
        setCategory('badiiy');
        setImageFile(null);
        setImagePreview('');
    };

    const openCreateEditor = () => {
        setEditingItem(null);
        setMoyskladExternalCode('');
        setCategory(activeCategory === 'hammasi' ? 'badiiy' : activeCategory);
        setImageFile(null);
        setImagePreview('');
        setIsEditorOpen(true);
    };

    const openEditEditor = (item: CatalogItem) => {
        setEditingItem(item);
        setMoyskladExternalCode(item.moyskladExternalCode ?? '');
        setCategory(item.category);
        setImageFile(null);
        setImagePreview(item.image);
        setIsEditorOpen(true);
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        setImageFile(event.target.files?.[0] ?? null);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!moyskladExternalCode.trim()) {
            toast.error('Внешний кодni kiriting');
            return;
        }

        if (!editingItem && !imageFile) {
            toast.error('Katalog rasmini tanlang');
            return;
        }

        const formData = new FormData();
        formData.append('moyskladExternalCode', moyskladExternalCode.trim());
        formData.append('category', category);
        if (imageFile) formData.append('image', imageFile);

        const mutationOptions = {
            onSuccess: () => {
                toast.success(editingItem ? 'Katalog elementi yangilandi' : 'Katalog elementi qo‘shildi');
                resetEditor();
            },
            onError: (error: unknown) => toast.error(getErrorMessage(error, 'Katalogni saqlashda xatolik'))
        };

        if (editingItem) {
            updateCatalog.mutate({ id: editingItem._id, formData }, mutationOptions);
            return;
        }

        createCatalog.mutate(formData, mutationOptions);
    };

    const handleDelete = (id: string) => {
        if (pendingDeleteId !== id) {
            setPendingDeleteId(id);
            return;
        }

        deleteCatalog.mutate(id, {
            onSuccess: () => {
                toast.success('Katalog elementi o‘chirildi');
                setPendingDeleteId(null);
                if (catalogItems.length === 1 && page > 1) setPage((currentPage) => currentPage - 1);
            },
            onError: (error: unknown) => {
                toast.error(getErrorMessage(error, 'Katalogni o‘chirishda xatolik'));
                setPendingDeleteId(null);
            }
        });
    };

    const changeCategory = (nextCategory: CatalogCategoryFilter) => {
        setActiveCategory(nextCategory);
        setPage(1);
        setPendingDeleteId(null);
    };

    const changeStatus = (nextStatus: CatalogStatusFilter) => {
        setActiveStatus(nextStatus);
        setPage(1);
        setPendingDeleteId(null);
    };

    const handleToggleStatus = (item: CatalogItem) => {
        setPendingStatusId(item._id);
        toggleCatalogStatus.mutate(item._id, {
            onSuccess: () => {
                toast.success(item.isActive === false ? 'Katalog faollashtirildi' : 'Katalog faolsizlashtirildi');
                setPendingStatusId(null);
            },
            onError: (error: unknown) => {
                toast.error(getErrorMessage(error, "Katalog holatini o'zgartirishda xatolik"));
                setPendingStatusId(null);
            }
        });
    };

    const handleSyncPrices = () => {
        syncCatalogPrices.mutate(undefined, {
            onSuccess: (response) => {
                const result = response?.data;
                toast.success(`Narxlar yangilandi: ${result?.synchronized ?? 0} ta, xato: ${result?.failed ?? 0} ta`);
            },
            onError: (error: unknown) => toast.error(getErrorMessage(error, 'Narxlarni sinxronlashda xatolik'))
        });
    };

    const getPriceWithNds = (item: CatalogItem) => {
        if (typeof item.wholesalePrice !== 'number') return item.price;
        return Math.round(item.wholesalePrice * 1.12);
    };

    return (
        <div className='space-y-5'>
            <section className='bg-base-100 ring-base-300 flex flex-col gap-4 rounded-[24px] p-4 shadow-sm ring-1 md:flex-row md:items-center md:justify-between md:p-5'>
                <div>
                    <p className='text-info text-xs font-black tracking-[0.16em] uppercase'>Kitoblar to‘plami</p>
                    <h1 className='text-base-content mt-1 text-2xl font-black'>Katalog</h1>
                    <p className='text-admin-muted mt-2 max-w-2xl text-sm font-semibold'>
                        Katalog rasmlari, narxlari va kategoriyalarini boshqaring.
                    </p>
                </div>

                <div className='flex flex-wrap gap-2'>
                    <button
                        type='button'
                        disabled={syncCatalogPrices.isPending}
                        onClick={handleSyncPrices}
                        className='bg-base-200 text-admin-muted hover:text-info inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-60'>
                        <RefreshCw size={17} className={syncCatalogPrices.isPending ? 'animate-spin' : ''} />
                        Narxlarni sync
                    </button>
                    <button
                        type='button'
                        onClick={openCreateEditor}
                        className='bg-warning text-warning-content inline-flex h-11 items-center gap-2 rounded-2xl px-5 text-sm font-black transition hover:opacity-90'>
                        <ImagePlus size={18} />
                        Katalog qo‘shish
                    </button>
                </div>
            </section>

            {isEditorOpen && (
                <form
                    onSubmit={handleSubmit}
                    className='bg-base-100 ring-base-300 rounded-[24px] p-4 shadow-sm ring-1 md:p-5'>
                    <div className='mb-5 flex items-start justify-between gap-4'>
                        <div>
                            <h2 className='text-base-content text-xl font-black'>
                                {editingItem ? 'Katalogni tahrirlash' : 'Yangi katalog elementi'}
                            </h2>
                            <p className='text-admin-muted mt-1 text-sm font-semibold'>
                                Rasm, MoySklad Внешний код va kategoriyani kiriting. Narx avtomatik olinadi.
                            </p>
                        </div>
                        <button
                            type='button'
                            onClick={resetEditor}
                            aria-label='Formani yopish'
                            className='bg-base-200 text-admin-muted hover:text-error grid size-10 shrink-0 place-items-center rounded-2xl transition'>
                            <X size={18} />
                        </button>
                    </div>

                    <div className='grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]'>
                        <label className='border-base-300 bg-base-200 hover:border-info relative flex aspect-[4/5] cursor-pointer items-center justify-center overflow-hidden rounded-[22px] border-2 border-dashed text-center transition'>
                            {imagePreview ? (
                                <Image
                                    src={imagePreview}
                                    alt='Katalog rasmi'
                                    fill
                                    unoptimized
                                    className='object-cover'
                                />
                            ) : (
                                <span className='text-admin-muted flex flex-col items-center gap-2 px-4 text-sm font-bold'>
                                    <ImagePlus size={28} />
                                    Rasm tanlash
                                </span>
                            )}
                            <span className='absolute inset-x-3 bottom-3 rounded-xl bg-black/65 px-3 py-2 text-xs font-black text-white backdrop-blur-sm'>
                                {imagePreview ? 'Rasmni almashtirish' : 'PNG, JPG yoki WEBP'}
                            </span>
                            <input type='file' accept='image/*' onChange={handleImageChange} className='sr-only' />
                        </label>

                        <div className='grid content-start gap-4 md:grid-cols-2'>
                            <label className='grid gap-2'>
                                <span className='text-base-content text-sm font-black'>MoySklad Внешний код</span>
                                <div className='bg-base-200 ring-base-300 focus-within:ring-info flex h-12 overflow-hidden rounded-2xl ring-1'>
                                    <input
                                        type='text'
                                        required
                                        value={moyskladExternalCode}
                                        onChange={(event) => setMoyskladExternalCode(event.target.value)}
                                        placeholder='Masalan: AbC123-xYz'
                                        className='min-w-0 flex-1 bg-transparent px-4 font-mono text-sm font-bold outline-none'
                                    />
                                </div>
                                {editingItem?.priceSyncedAt && (
                                    <span className='text-admin-muted text-xs font-semibold'>
                                        Oxirgi sync: {dateFormatter.format(new Date(editingItem.priceSyncedAt))}
                                    </span>
                                )}
                            </label>

                            <div className='grid gap-2'>
                                <span className='text-base-content text-sm font-black'>Kategoriya</span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type='button'
                                            className='group bg-base-200 ring-base-300 hover:ring-info/50 focus-visible:ring-info data-[state=open]:ring-info flex h-12 w-full items-center gap-3 rounded-2xl px-3 text-left ring-1 transition outline-none focus-visible:ring-2 data-[state=open]:ring-2'>
                                            <span className='bg-info/10 text-info grid size-8 shrink-0 place-items-center rounded-xl'>
                                                <SelectedCategoryIcon size={16} />
                                            </span>
                                            <span className='text-base-content min-w-0 flex-1 truncate text-sm font-black'>
                                                {selectedCategory.label}
                                            </span>
                                            <ChevronDown
                                                size={17}
                                                className='text-admin-muted shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180'
                                            />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align='start'
                                        sideOffset={8}
                                        className='w-[var(--radix-dropdown-menu-trigger-width)] rounded-2xl border-[#eadfce] bg-[#fffaf2] p-2 shadow-[0_18px_50px_rgba(64,45,30,0.18)] dark:border-slate-700 dark:bg-slate-900'>
                                        <DropdownMenuRadioGroup
                                            value={category}
                                            onValueChange={(value) => setCategory(value as CatalogCategory)}>
                                            {editableCategories.map((item) => {
                                                const CategoryIcon = categoryIcons[item.value];

                                                return (
                                                    <DropdownMenuRadioItem
                                                        key={item.value}
                                                        value={item.value}
                                                        className='mb-1 min-h-12 gap-3 rounded-xl py-2 pr-3 pl-9 font-bold text-[#5f5449] last:mb-0 focus:bg-[#f2e7d8] focus:text-[#2f2923] data-[state=checked]:bg-[#00a0e3]/10 data-[state=checked]:text-[#008dcc] dark:text-slate-200 dark:focus:bg-slate-800 dark:focus:text-white dark:data-[state=checked]:bg-sky-500/15 dark:data-[state=checked]:text-sky-300'>
                                                        <span className='grid size-8 shrink-0 place-items-center rounded-xl bg-white text-[#817466] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:text-slate-300 dark:ring-slate-700'>
                                                            <CategoryIcon size={16} />
                                                        </span>
                                                        <span className='truncate text-sm'>{item.label}</span>
                                                    </DropdownMenuRadioItem>
                                                );
                                            })}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className='flex flex-wrap gap-3 pt-1 md:col-span-2'>
                                <button
                                    type='submit'
                                    disabled={isSaving}
                                    className='bg-info text-info-content inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60'>
                                    {isSaving ? <Loader2 size={18} className='animate-spin' /> : <Save size={18} />}
                                    {editingItem ? 'O‘zgarishlarni saqlash' : 'Saqlash'}
                                </button>
                                <button
                                    type='button'
                                    onClick={resetEditor}
                                    disabled={isSaving}
                                    className='bg-base-200 text-admin-muted hover:bg-base-300 h-11 rounded-2xl px-5 text-sm font-black transition disabled:opacity-60'>
                                    Bekor qilish
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}

            <section className='bg-base-100 ring-base-300 overflow-hidden rounded-[24px] shadow-sm ring-1'>
                <nav
                    aria-label='Katalog kategoriyalari'
                    className='no-scrollbar border-base-300 flex gap-2 overflow-x-auto border-b p-4'>
                    {categories.map((item) => {
                        const isActive = item.value === activeCategory;

                        return (
                            <button
                                key={item.value}
                                type='button'
                                onClick={() => changeCategory(item.value)}
                                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-black transition ${
                                    isActive
                                        ? 'bg-info text-info-content shadow-sm'
                                        : 'bg-base-200 text-admin-muted hover:text-base-content'
                                }`}>
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className='border-base-300 flex flex-wrap items-center gap-2 border-b px-4 py-3'>
                    <span className='text-admin-muted mr-1 text-xs font-black tracking-wider uppercase'>Holati:</span>
                    {statuses.map((item) => (
                        <button
                            key={item.value}
                            type='button'
                            onClick={() => changeStatus(item.value)}
                            className={`rounded-full px-4 py-2 text-xs font-black transition ${
                                activeStatus === item.value
                                    ? 'bg-base-content text-base-100'
                                    : 'bg-base-200 text-admin-muted hover:text-base-content'
                            }`}>
                            {item.label}
                        </button>
                    ))}
                </div>

                <div className='overflow-x-auto'>
                    {isLoading ? (
                        <div className='text-admin-muted grid min-h-64 place-items-center'>
                            <Loader2 size={30} className='animate-spin' />
                        </div>
                    ) : isError ? (
                        <div className='grid min-h-64 place-items-center text-center'>
                            <div>
                                <p className='text-error font-black'>Katalogni yuklab bo‘lmadi</p>
                                <button
                                    type='button'
                                    onClick={() => void refetch()}
                                    className='bg-base-200 mt-3 inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-sm font-black'>
                                    <RefreshCw size={16} />
                                    Qayta urinish
                                </button>
                            </div>
                        </div>
                    ) : (
                        <table className='w-full min-w-[1060px] border-collapse'>
                            <thead>
                                <tr className='border-base-300 bg-base-200/70 border-b text-left'>
                                    <th className='text-admin-muted w-20 px-5 py-4 text-xs font-black tracking-wider uppercase'>
                                        №
                                    </th>
                                    <th className='text-admin-muted px-5 py-4 text-xs font-black tracking-wider uppercase'>
                                        Rasm
                                    </th>
                                    <th className='text-admin-muted px-5 py-4 text-xs font-black tracking-wider uppercase'>
                                        Внешний код
                                    </th>
                                    <th className='text-admin-muted px-5 py-4 text-xs font-black tracking-wider uppercase'>
                                        Kategoriya
                                    </th>
                                    <th className='text-admin-muted px-5 py-4 text-xs font-black tracking-wider uppercase'>
                                        Narxi
                                    </th>
                                    <th className='text-admin-muted px-5 py-4 text-xs font-black tracking-wider uppercase'>
                                        Holati
                                    </th>
                                    <th className='text-admin-muted px-5 py-4 text-xs font-black tracking-wider uppercase'>
                                        Narx sinxronizatsiyasi
                                    </th>
                                    <th className='text-admin-muted px-5 py-4 text-right text-xs font-black tracking-wider uppercase'>
                                        Amallar
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-base-300 divide-y'>
                                {catalogItems.length ? (
                                    catalogItems.map((item, index) => {
                                        const itemCategory = editableCategories.find(
                                            (option) => option.value === item.category
                                        );
                                        const ItemCategoryIcon = categoryIcons[item.category];

                                        return (
                                            <tr key={item._id} className='hover:bg-base-200/60 transition'>
                                                <td className='px-5 py-3'>
                                                    <span className='bg-base-200 text-admin-muted inline-flex min-w-9 justify-center rounded-xl px-2.5 py-2 text-xs font-black'>
                                                        {String((page - 1) * PAGE_SIZE + index + 1).padStart(2, '0')}
                                                    </span>
                                                </td>
                                                <td className='px-5 py-3'>
                                                    <div className='bg-base-200 ring-base-300 relative h-16 w-12 overflow-hidden rounded-xl shadow-sm ring-1'>
                                                        <Image
                                                            src={item.image}
                                                            alt={`${index + 1}-katalog rasmi`}
                                                            fill
                                                            unoptimized
                                                            className='object-cover'
                                                        />
                                                    </div>
                                                </td>
                                                <td className='px-5 py-3'>
                                                    <code className='bg-base-200 text-base-content rounded-lg px-2.5 py-1.5 text-xs font-black'>
                                                        {item.moyskladExternalCode || 'Kiritilmagan'}
                                                    </code>
                                                </td>
                                                <td className='px-5 py-3'>
                                                    <span className='bg-info/10 text-info inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black'>
                                                        <ItemCategoryIcon size={15} />
                                                        {itemCategory?.label ?? item.category}
                                                    </span>
                                                </td>
                                                <td className='px-5 py-3'>
                                                    <span className='text-base-content text-sm font-black'>
                                                        {formatPrice(getPriceWithNds(item))}
                                                    </span>
                                                    <span className='text-admin-muted ml-1 text-xs font-bold'>
                                                        so‘m
                                                    </span>
                                                </td>
                                                <td className='px-5 py-3'>
                                                    <button
                                                        type='button'
                                                        role='switch'
                                                        aria-checked={item.isActive !== false}
                                                        disabled={toggleCatalogStatus.isPending}
                                                        onClick={() => handleToggleStatus(item)}
                                                        title={
                                                            item.isActive !== false
                                                                ? 'Faolsizlashtirish'
                                                                : 'Faollashtirish'
                                                        }
                                                        className={`inline-flex min-w-24 items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                                            item.isActive !== false
                                                                ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                                                                : 'bg-base-200 text-admin-muted hover:bg-base-300'
                                                        }`}>
                                                        {pendingStatusId === item._id ? (
                                                            <Loader2 size={15} className='animate-spin' />
                                                        ) : item.isActive !== false ? (
                                                            <Eye size={15} />
                                                        ) : (
                                                            <EyeOff size={15} />
                                                        )}
                                                        {item.isActive !== false ? 'Faol' : 'Nofaol'}
                                                    </button>
                                                </td>
                                                <td className='text-admin-muted px-5 py-3 text-sm font-bold'>
                                                    <span
                                                        title={item.priceSyncError}
                                                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black ${
                                                            item.priceSyncStatus === 'synced'
                                                                ? 'bg-emerald-500/10 text-emerald-600'
                                                                : item.priceSyncStatus === 'error'
                                                                  ? 'bg-error/10 text-error'
                                                                  : 'bg-amber-500/10 text-amber-600'
                                                        }`}>
                                                        {item.priceSyncStatus === 'synced'
                                                            ? 'Sinxronlangan'
                                                            : item.priceSyncStatus === 'error'
                                                              ? 'Sync xatosi'
                                                              : 'Kutilmoqda'}
                                                    </span>
                                                    {item.priceSyncedAt && (
                                                        <span className='mt-1 block text-xs'>
                                                            {dateFormatter.format(new Date(item.priceSyncedAt))}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className='px-5 py-3'>
                                                    <div className='flex items-center justify-end gap-2'>
                                                        <button
                                                            type='button'
                                                            onClick={() => openEditEditor(item)}
                                                            aria-label='Tahrirlash'
                                                            title='Tahrirlash'
                                                            className='bg-base-200 text-admin-muted hover:bg-info/10 hover:text-info grid size-10 place-items-center rounded-xl transition'>
                                                            <Pencil size={17} />
                                                        </button>
                                                        <button
                                                            type='button'
                                                            disabled={deleteCatalog.isPending}
                                                            onClick={() => handleDelete(item._id)}
                                                            aria-label={
                                                                pendingDeleteId === item._id
                                                                    ? 'O‘chirishni tasdiqlash'
                                                                    : 'O‘chirish'
                                                            }
                                                            title={
                                                                pendingDeleteId === item._id
                                                                    ? 'Tasdiqlash uchun yana bosing'
                                                                    : 'O‘chirish'
                                                            }
                                                            className={`grid size-10 place-items-center rounded-xl transition disabled:opacity-60 ${
                                                                pendingDeleteId === item._id
                                                                    ? 'bg-error text-error-content'
                                                                    : 'bg-error/10 text-error hover:bg-error hover:text-error-content'
                                                            }`}>
                                                            {deleteCatalog.isPending &&
                                                            deleteCatalog.variables === item._id ? (
                                                                <Loader2 size={17} className='animate-spin' />
                                                            ) : pendingDeleteId === item._id ? (
                                                                <Check size={17} />
                                                            ) : (
                                                                <Trash2 size={17} />
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className='px-5 py-16 text-center'>
                                            <span className='bg-base-200 text-admin-muted mx-auto grid size-14 place-items-center rounded-2xl'>
                                                <ImagePlus size={24} />
                                            </span>
                                            <p className='text-base-content mt-4 text-sm font-black'>
                                                Katalog elementlari topilmadi
                                            </p>
                                            <p className='text-admin-muted mt-1 text-xs font-semibold'>
                                                Yuqoridagi “Katalog qo‘shish” tugmasi orqali yangi element yarating.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                <PaginationFooter
                    pagination={data?.pagination}
                    page={page}
                    updatePage={setPage}
                    isFetching={isFetching}
                />
            </section>
        </div>
    );
}
