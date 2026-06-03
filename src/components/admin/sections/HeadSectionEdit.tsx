import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { ArrowLeft, Save } from 'lucide-react';

type HeadSectionEditProps = {
    title: string;
    href: string;
    form?: string;
    formId?: string;
    backLabel?: string;
    createTitle?: string;
    editTitle?: string;
    description?: string;
    createDescription?: string;
    editDescription?: string;
    isEdit?: boolean;
    isPending?: boolean;
    cancelLabel?: string;
    submitLabel?: string;
    editSubmitLabel?: string;
    pendingLabel?: string;
};

const HeadSectionEdit = ({
    title,
    href,
    form,
    formId,
    backLabel,
    createTitle,
    editTitle,
    description,
    createDescription,
    editDescription,
    isEdit = false,
    isPending = false,
    cancelLabel = 'Bekor qilish',
    submitLabel = 'Saqlash',
    editSubmitLabel = 'Yangilash',
    pendingLabel = 'Saqlanmoqda...'
}: HeadSectionEditProps) => {
    const lowerTitle = title.toLowerCase();
    const submitFormId = formId ?? (form ? `${form}-form` : undefined);
    const heading = isEdit ? (editTitle ?? `${title}ni tahrirlash`) : (createTitle ?? `Yangi ${lowerTitle} qo'shish`);
    const helperText = isEdit ? (editDescription ?? description) : (createDescription ?? description);
    const buttonText = isPending ? pendingLabel : isEdit ? editSubmitLabel : submitLabel;

    return (
        <section className='flex flex-col gap-4 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:flex-row md:items-center md:justify-between md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
            <div className='min-w-0'>
                <Link
                    href={href}
                    className='inline-flex items-center gap-2 text-sm font-black text-[#9d907e] transition hover:text-[#ef7f1a] dark:text-slate-400 dark:hover:text-white'>
                    <ArrowLeft size={17} />
                    {backLabel ?? `Barcha ${lowerTitle}lar`}
                </Link>
                <h2 className='mt-3 text-2xl font-black text-[#2f2a25] dark:text-white'>{heading}</h2>
                {helperText ? (
                    <p className='mt-2 max-w-2xl text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                        {helperText}
                    </p>
                ) : null}
            </div>

            <div className='flex gap-2'>
                <Button
                    asChild
                    variant='outline'
                    disabled={isPending}
                    className='h-11 rounded-2xl border-[#eadfce] bg-white font-black dark:border-slate-800 dark:bg-slate-900'>
                    <Link href={href}>{cancelLabel}</Link>
                </Button>
                <Button
                    type='submit'
                    form={submitFormId}
                    disabled={isPending}
                    className='h-11 rounded-2xl bg-[#ef7f1a] px-5 font-black text-white hover:bg-orange-600 disabled:opacity-50'>
                    <Save size={18} />
                    {buttonText}
                </Button>
            </div>
        </section>
    );
};

export default HeadSectionEdit;
