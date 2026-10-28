'use client';

import { useState } from 'react';

import Image from 'next/image';

import PaginationFooter from '@/components/admin/other/PaginationFooter';
import { useCatalogManageQuery } from '@/hooks/queries/useCatalogManageQuery';
import type { CatalogCategoryFilter, CatalogItem } from '@/types/catalog';

import { Check, FileText, Loader2, Minus, Plus, Printer, RefreshCw, X } from 'lucide-react';

type CatalogUnit = 'pochka' | 'dona';

type CatalogSelection = {
    item: CatalogItem;
    unit: CatalogUnit;
    quantity: number;
};

const formatPrice = (price: number) => `${price.toLocaleString('uz-UZ')} so‘m`;

const categories: Array<{ value: CatalogCategoryFilter; label: string }> = [
    { value: 'hammasi', label: 'Hammasi' },
    { value: 'badiiy', label: 'Badiiy adabiyotlar' },
    { value: 'nobadiiy', label: 'Nobadiiy adabiyotlar' },
    { value: 'trend', label: 'Trend' },
    { value: 'bolalar-adabiyoti', label: 'Bolalar adabiyotlari' }
];

const PAGE_SIZE = 20;

const getPdfImageData = async (url: string) => {
    try {
        const imageRequestUrl =
            url.startsWith('data:') || url.startsWith('blob:')
                ? url
                : `/api/catalog-image?url=${encodeURIComponent(url)}`;
        const response = await fetch(imageRequestUrl);
        if (!response.ok) return null;

        const imageBitmap = await createImageBitmap(await response.blob());
        const canvas = document.createElement('canvas');
        const maxSize = 600;
        const scale = Math.min(1, maxSize / Math.max(imageBitmap.width, imageBitmap.height));
        canvas.width = Math.max(1, Math.round(imageBitmap.width * scale));
        canvas.height = Math.max(1, Math.round(imageBitmap.height * scale));

        const context = canvas.getContext('2d');
        if (!context) {
            imageBitmap.close();
            return null;
        }

        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
        imageBitmap.close();

        return canvas.toDataURL('image/jpeg', 0.85);
    } catch {
        return null;
    }
};

const getPdfTextImageData = (text: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 840;
    canvas.height = 260;

    const context = canvas.getContext('2d');
    if (!context) return null;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#1e293b';
    context.font = '600 34px Arial, sans-serif';
    context.textBaseline = 'top';

    const words = text.trim().split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    const maxWidth = canvas.width - 32;
    const maxLines = 4;
    let currentLine = '';

    for (const word of words) {
        const candidate = currentLine ? `${currentLine} ${word}` : word;

        if (context.measureText(candidate).width <= maxWidth || !currentLine) {
            currentLine = candidate;
            continue;
        }

        lines.push(currentLine);
        currentLine = word;

        if (lines.length === maxLines - 1) break;
    }

    if (currentLine && lines.length < maxLines) lines.push(currentLine);

    if (lines.length === maxLines && words.join(' ') !== lines.join(' ')) {
        let lastLine = `${lines[maxLines - 1]}...`;
        while (context.measureText(lastLine).width > maxWidth && lastLine.length > 3) {
            lastLine = `${lastLine.slice(0, -4).trimEnd()}...`;
        }
        lines[maxLines - 1] = lastLine;
    }

    lines.forEach((line, index) => context.fillText(line, 16, 14 + index * 54));

    return canvas.toDataURL('image/png');
};

export default function CatalogManagePage() {
    const [page, setPage] = useState(1);
    const [activeCategory, setActiveCategory] = useState<CatalogCategoryFilter>('hammasi');
    const [selections, setSelections] = useState<Record<string, CatalogSelection>>({});
    const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
    const [isPdfDownloading, setIsPdfDownloading] = useState(false);
    const { data, isLoading, isFetching, isError, refetch } = useCatalogManageQuery(activeCategory, page, PAGE_SIZE);
    const catalogItems = data?.catalogs ?? [];
    const selectedItems = Object.values(selections);

    const toggleSelection = (item: CatalogItem) => {
        setSelections((current) => {
            if (current[item._id]) {
                const next = { ...current };
                delete next[item._id];
                return next;
            }

            return { ...current, [item._id]: { item, unit: 'dona', quantity: 1 } };
        });
    };

    const updateSelection = (id: string, changes: Partial<Omit<CatalogSelection, 'item'>>) => {
        setSelections((current) => (current[id] ? { ...current, [id]: { ...current[id], ...changes } } : current));
    };

    const downloadPdf = async () => {
        if (selectedItems.length === 0 || isPdfDownloading) return;

        setIsPdfDownloading(true);

        try {
            const { jsPDF } = await import('jspdf');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const margin = 10;
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const tableWidth = pageWidth - margin * 2;
            const imageColumnWidth = 36;
            const nameColumnWidth = 84;
            const unitColumnWidth = 40;
            const quantityColumnWidth = tableWidth - imageColumnWidth - nameColumnWidth - unitColumnWidth;
            const headerHeight = 10;
            const rowHeight = 34;

            const drawHeader = () => {
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(17);
                pdf.setTextColor(15, 23, 42);
                pdf.text('Tanlangan kitoblar', margin, 17);

                const headerY = 23;
                pdf.setFillColor(241, 245, 249);
                pdf.setDrawColor(203, 213, 225);
                pdf.rect(margin, headerY, tableWidth, headerHeight, 'FD');
                pdf.setFontSize(10);
                pdf.text('Rasm', margin + 3, headerY + 6.5);
                pdf.text('Kitob nomi', margin + imageColumnWidth + 3, headerY + 6.5);
                pdf.text('Birlik', margin + imageColumnWidth + nameColumnWidth + 3, headerY + 6.5);
                pdf.text('Soni', margin + imageColumnWidth + nameColumnWidth + unitColumnWidth + 3, headerY + 6.5);

                return headerY + headerHeight;
            };

            let rowY = drawHeader();

            for (const { item, unit, quantity } of selectedItems) {
                if (rowY + rowHeight > pageHeight - margin) {
                    pdf.addPage();
                    rowY = drawHeader();
                }

                pdf.setDrawColor(226, 232, 240);
                pdf.rect(margin, rowY, tableWidth, rowHeight);
                pdf.line(margin + imageColumnWidth, rowY, margin + imageColumnWidth, rowY + rowHeight);

                pdf.line(
                    margin + imageColumnWidth + nameColumnWidth,
                    rowY,
                    margin + imageColumnWidth + nameColumnWidth,
                    rowY + rowHeight
                );

                pdf.line(
                    margin + imageColumnWidth + nameColumnWidth + unitColumnWidth,
                    rowY,
                    margin + imageColumnWidth + nameColumnWidth + unitColumnWidth,
                    rowY + rowHeight
                );

                const imageData = await getPdfImageData(item.image);

                if (imageData) {
                    pdf.addImage(imageData, 'JPEG', margin + 3, rowY + 3, 18, 28);
                }

                const nameImageData = getPdfTextImageData(item.moyskladName || 'Nomi topilmadi');

                if (nameImageData) {
                    pdf.addImage(
                        nameImageData,
                        'PNG',
                        margin + imageColumnWidth + 3,
                        rowY + 5,
                        nameColumnWidth - 6,
                        24
                    );
                }

                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(11);
                pdf.setTextColor(30, 41, 59);
                pdf.text(
                    unit === 'pochka' ? 'Pochka' : 'Dona',
                    margin + imageColumnWidth + nameColumnWidth + 3,
                    rowY + 18
                );
                pdf.text(
                    String(quantity),
                    margin + imageColumnWidth + nameColumnWidth + unitColumnWidth + quantityColumnWidth / 2,
                    rowY + 18,
                    { align: 'center' }
                );

                rowY += rowHeight;
            }

            if (pdf.getNumberOfPages() > 1) {
                for (let pageNumber = 1; pageNumber <= pdf.getNumberOfPages(); pageNumber += 1) {
                    pdf.setPage(pageNumber);
                    pdf.setFontSize(8);
                    pdf.setTextColor(100, 116, 139);
                    pdf.text(`${pageNumber} / ${pdf.getNumberOfPages()}`, pageWidth - margin, pageHeight - 5, {
                        align: 'right'
                    });
                }
            }

            pdf.save('tanlangan-kitoblar.pdf');
        } catch (error) {
            console.error('PDF faylini yaratib bo‘lmadi:', error);
            window.alert('PDF faylini yaratib bo‘lmadi. Qayta urinib ko‘ring.');
        } finally {
            setIsPdfDownloading(false);
        }
    };

    const getPriceWithNds = (item: CatalogItem) => {
        if (typeof item.wholesalePrice !== 'number') return item.price;
        return Math.round(item.wholesalePrice * 1.12);
    };

    return (
        <>
            <div
                className={`min-h-screen bg-slate-50 py-8 sm:py-12 dark:bg-slate-950 ${isPdfPreviewOpen ? 'print:hidden' : ''}`}>
                <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
                    <header className='mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
                        <div>
                            <p className='mb-2 text-xs font-semibold tracking-[0.18em] text-[#00a0e3] uppercase'>
                                Kitoblar to‘plami
                            </p>
                            <h1 className='text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white'>
                                Katalog
                            </h1>
                        </div>

                        <button
                            type='button'
                            disabled={selectedItems.length === 0}
                            onClick={() => setIsPdfPreviewOpen(true)}
                            className='inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-[#ef7f1a] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(239,127,26,0.22)] transition hover:-translate-y-0.5 hover:bg-[#dd6f0e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef7f1a]'>
                            <FileText size={17} />
                            PDF yuklash{selectedItems.length > 0 ? ` (${selectedItems.length})` : ''}
                        </button>
                    </header>

                    <nav
                        aria-label='Katalog kategoriyalari'
                        className='no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1'>
                        {categories.map((category) => {
                            const isActive = category.value === activeCategory;

                            return (
                                <button
                                    key={category.value}
                                    type='button'
                                    onClick={() => {
                                        setActiveCategory(category.value);
                                        setPage(1);
                                    }}
                                    className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a0e3] ${
                                        isActive
                                            ? 'border-[#00a0e3] bg-[#00a0e3] text-white shadow-[0_7px_20px_rgba(0,160,227,0.2)]'
                                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-white'
                                    }`}>
                                    {category.label}
                                </button>
                            );
                        })}
                    </nav>

                    <section className='relative min-h-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-5 dark:border-slate-800 dark:bg-slate-900'>
                        {isFetching && !isLoading && (
                            <div className='absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full bg-white/90 text-[#00a0e3] shadow-sm backdrop-blur dark:bg-slate-950/90'>
                                <Loader2 size={17} className='animate-spin' />
                            </div>
                        )}

                        {isLoading ? (
                            <div className='grid min-h-72 place-items-center text-slate-400'>
                                <Loader2 size={30} className='animate-spin' />
                            </div>
                        ) : isError ? (
                            <div className='grid min-h-72 place-items-center text-center'>
                                <div>
                                    <p className='font-semibold text-red-500'>Katalogni yuklab bo‘lmadi</p>
                                    <button
                                        type='button'
                                        onClick={() => void refetch()}
                                        className='mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'>
                                        <RefreshCw size={16} />
                                        Qayta urinish
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5'>
                                {catalogItems.map((item, index) => {
                                    const selection = selections[item._id];
                                    const isSelected = Boolean(selection);

                                    return (
                                        <article
                                            key={item._id}
                                            className={`h-fit min-w-0 self-start overflow-hidden rounded-2xl bg-white shadow-sm ring-1 transition dark:bg-slate-900 ${
                                                isSelected
                                                    ? 'ring-2 ring-[#00a0e3] dark:ring-[#00a0e3]'
                                                    : 'ring-slate-200 dark:ring-slate-700'
                                            }`}>
                                            <div className='relative aspect-4/5 overflow-hidden bg-slate-100 dark:bg-slate-800'>
                                                <Image
                                                    src={item.image}
                                                    alt={`${index + 1}-katalog rasmi`}
                                                    fill
                                                    unoptimized
                                                    className='object-contain p-2'
                                                />
                                                <div className='absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/90 via-slate-950/55 to-transparent px-4 pt-12 pb-4'>
                                                    <p className='text-base font-semibold text-white'>
                                                        {formatPrice(getPriceWithNds(item))}
                                                    </p>
                                                </div>
                                                <span className='absolute top-3 left-3 rounded-full bg-slate-950/55 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white backdrop-blur-sm'>
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <button
                                                    type='button'
                                                    role='checkbox'
                                                    aria-checked={isSelected}
                                                    aria-label={`${index + 1}-katalogni ${isSelected ? 'tanlovdan olib tashlash' : 'tanlash'}`}
                                                    onClick={() => toggleSelection(item)}
                                                    className={`absolute top-3 right-3 grid size-10 place-items-center rounded-xl shadow-md transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00a0e3] ${
                                                        isSelected
                                                            ? 'bg-[#00a0e3] text-white'
                                                            : 'bg-white/95 text-slate-500 hover:text-[#00a0e3]'
                                                    }`}>
                                                    {isSelected ? (
                                                        <Check size={21} strokeWidth={3} />
                                                    ) : (
                                                        <span className='size-5 rounded-md border-2 border-current' />
                                                    )}
                                                </button>
                                            </div>

                                            {selection && (
                                                <div className='space-y-3 p-3'>
                                                    <fieldset>
                                                        <legend className='mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400'>
                                                            Birlik turi
                                                        </legend>
                                                        <div className='grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800'>
                                                            {(['pochka', 'dona'] as const).map((unit) => (
                                                                <label
                                                                    key={unit}
                                                                    className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-1 py-2 text-xs font-semibold transition ${
                                                                        selection.unit === unit
                                                                            ? 'bg-white text-[#007eae] shadow-sm dark:bg-slate-700 dark:text-sky-300'
                                                                            : 'text-slate-500 dark:text-slate-400'
                                                                    }`}>
                                                                    <input
                                                                        type='radio'
                                                                        name={`unit-${item._id}`}
                                                                        value={unit}
                                                                        checked={selection.unit === unit}
                                                                        onChange={() =>
                                                                            updateSelection(item._id, { unit })
                                                                        }
                                                                        className='sr-only'
                                                                    />
                                                                    {unit === 'pochka' ? 'Pochka' : 'Dona'}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </fieldset>

                                                    <div className='flex items-center justify-between gap-2'>
                                                        <span className='text-xs font-semibold text-slate-500 dark:text-slate-400'>
                                                            Soni
                                                        </span>
                                                        <div className='flex h-9 items-center overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700'>
                                                            <button
                                                                type='button'
                                                                aria-label='Miqdorni kamaytirish'
                                                                disabled={selection.quantity <= 1}
                                                                onClick={() =>
                                                                    updateSelection(item._id, {
                                                                        quantity: selection.quantity - 1
                                                                    })
                                                                }
                                                                className='grid size-9 place-items-center text-slate-600 transition hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:hover:bg-slate-800'>
                                                                <Minus size={15} />
                                                            </button>
                                                            <span className='min-w-8 text-center text-sm font-bold text-slate-900 dark:text-white'>
                                                                {selection.quantity}
                                                            </span>
                                                            <button
                                                                type='button'
                                                                aria-label='Miqdorni oshirish'
                                                                onClick={() =>
                                                                    updateSelection(item._id, {
                                                                        quantity: selection.quantity + 1
                                                                    })
                                                                }
                                                                className='grid size-9 place-items-center text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'>
                                                                <Plus size={15} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                        {!isLoading && !isError && (
                            <PaginationFooter
                                pagination={data?.pagination}
                                page={page}
                                updatePage={setPage}
                                isFetching={isFetching}
                            />
                        )}
                    </section>
                </div>
            </div>

            {isPdfPreviewOpen && (
                <div className='fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 sm:p-8 print:static print:overflow-visible print:bg-white print:p-0'>
                    <section
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby='catalog-pdf-title'
                        className='mx-auto w-full max-w-4xl rounded-2xl bg-white p-5 shadow-2xl sm:p-8 print:max-w-none print:rounded-none print:p-0 print:shadow-none'>
                        <div className='mb-6 flex items-center justify-between gap-4 print:hidden'>
                            <div>
                                <p className='text-xs font-semibold tracking-wider text-[#00a0e3] uppercase'>Katalog</p>
                            </div>
                            <div className='flex gap-2'>
                                <button
                                    type='button'
                                    disabled={isPdfDownloading}
                                    onClick={() => void downloadPdf()}
                                    className='inline-flex h-10 items-center gap-2 rounded-lg bg-[#ef7f1a] px-4 text-sm font-semibold text-white transition hover:bg-[#dd6f0e] disabled:cursor-wait disabled:opacity-70'>
                                    {isPdfDownloading ? (
                                        <Loader2 size={16} className='animate-spin' />
                                    ) : (
                                        <Printer size={16} />
                                    )}
                                    {isPdfDownloading ? 'PDF tayyorlanmoqda...' : 'PDF qilib saqlash'}
                                </button>
                                <button
                                    type='button'
                                    aria-label='Jadvalni yopish'
                                    onClick={() => setIsPdfPreviewOpen(false)}
                                    className='grid size-10 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200'>
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className='bg-white p-1'>
                            <h1 className='mb-5 text-2xl font-bold text-slate-900'>Tanlangan kitoblar</h1>
                            <div className='overflow-x-auto'>
                                <table className='w-full min-w-140 border-collapse text-left print:min-w-0'>
                                    <thead>
                                        <tr className='border-y-2 border-slate-300 text-xs font-bold text-slate-600 uppercase'>
                                            <th className='px-3 py-3'>Rasm</th>
                                            <th className='px-3 py-3'>Kitob nomi</th>
                                            <th className='px-3 py-3'>Birlik</th>
                                            <th className='px-3 py-3 text-center'>Soni</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedItems.map(({ item, unit, quantity }) => (
                                            <tr key={item._id} className='border-b border-slate-200'>
                                                <td className='px-3 py-3'>
                                                    <Image
                                                        src={item.image}
                                                        alt='Kitob rasmi'
                                                        width={56}
                                                        height={72}
                                                        unoptimized
                                                        className='h-18 w-14 object-contain'
                                                    />
                                                </td>
                                                <td className='max-w-72 px-3 py-3 text-sm font-semibold text-slate-800'>
                                                    {item.moyskladName || 'Nomi topilmadi'}
                                                </td>
                                                <td className='px-3 py-3 text-sm font-semibold text-slate-800'>
                                                    {unit === 'pochka' ? 'Pochka' : 'Dona'}
                                                </td>
                                                <td className='px-3 py-3 text-center text-sm text-slate-800'>
                                                    {quantity}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </>
    );
}
