'use client';

import type { ElementType, ReactNode } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { filterService } from '@/services/filter.service';
import { useQuery } from '@tanstack/react-query';

import {
    ArrowLeft,
    BookOpen,
    Boxes,
    CalendarDays,
    DollarSign,
    FileText,
    ImagePlus,
    Languages,
    Save,
    Sparkles,
    Upload
} from 'lucide-react';

const Field = ({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) => (
    <label className='block space-y-2'>
        <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>{label}</span>
        {children}
        {hint ? <span className='block text-xs font-semibold text-[#9d907e] dark:text-slate-500'>{hint}</span> : null}
    </label>
);

const SectionTitle = ({ icon: Icon, title }: { icon: ElementType; title: string }) => (
    <div className='mb-4 flex items-center gap-2'>
        <span className='grid size-10 place-items-center rounded-2xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-900'>
            <Icon size={18} />
        </span>
        <h3 className='text-lg font-black text-[#2f2a25] dark:text-white'>{title}</h3>
    </div>
);

const inputClass =
    'h-12 rounded-2xl border-[#eadfce] bg-white font-semibold text-[#2f2a25] shadow-sm placeholder:text-[#b0a391] focus-visible:ring-[#ef7f1a]/30 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500';

const AdminNewBookPage = () => {
    const { data: filters, isLoading } = useQuery({
        queryKey: ['admin-book-form-filters'],
        queryFn: () => filterService.getAllFilters()
    });

    const categories = filters?.categories ?? [];
    const authors = filters?.authors ?? [];
    const publishers = filters?.publishers ?? [];

    return (
        <div className='space-y-5'>
            <section className='flex flex-col gap-4 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:flex-row md:items-center md:justify-between md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
                <div className='min-w-0'>
                    <Link
                        href='/admin/book'
                        className='inline-flex items-center gap-2 text-sm font-black text-[#9d907e] transition hover:text-[#ef7f1a] dark:text-slate-400 dark:hover:text-white'>
                        <ArrowLeft size={17} />
                        Barcha kitoblar
                    </Link>
                    <h2 className='mt-3 text-2xl font-black text-[#2f2a25] dark:text-white'>Yangi kitob qo'shish</h2>
                    <p className='mt-2 max-w-2xl text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                        Kitob kartochkasi uchun asosiy ma'lumotlar, narx, zaxira va katalog parametrlarini kiriting.
                    </p>
                </div>

                <div className='flex gap-2'>
                    <Button
                        asChild
                        variant='outline'
                        className='h-11 rounded-2xl border-[#eadfce] bg-white font-black dark:border-slate-800 dark:bg-slate-900'>
                        <Link href='/admin/book'>Bekor qilish</Link>
                    </Button>
                    <Button className='h-11 rounded-2xl bg-[#ef7f1a] px-5 font-black text-white hover:bg-orange-600'>
                        <Save size={18} />
                        Saqlash
                    </Button>
                </div>
            </section>

            <form className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]'>
                <div className='space-y-5'>
                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <SectionTitle icon={BookOpen} title="Asosiy ma'lumotlar" />

                        <div className='grid gap-4 md:grid-cols-2'>
                            <Field label='Kitob nomi (UZ)'>
                                <Input className={inputClass} placeholder='Masalan: Oq kema' />
                            </Field>
                            <Field label='Kitob nomi (RU)'>
                                <Input className={inputClass} placeholder='Название книги' />
                            </Field>
                            <Field label='Kitob nomi (EN)'>
                                <Input className={inputClass} placeholder='Book title' />
                            </Field>
                            <Field label='ISBN / Barcode'>
                                <Input className={inputClass} placeholder='978...' />
                            </Field>
                        </div>

                        <Field label='Tavsif' hint='Qisqa, tushunarli va sotuvga yordam beradigan tavsif yozing.'>
                            <textarea
                                rows={6}
                                className='min-h-36 w-full resize-y rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-semibold text-[#2f2a25] shadow-sm transition outline-none focus:border-[#ef7f1a] focus:ring-4 focus:ring-[#ef7f1a]/15 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500'
                                placeholder="Kitob haqida ma'lumot..."
                            />
                        </Field>
                    </section>

                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <SectionTitle icon={Sparkles} title='Katalog' />

                        <div className='grid gap-4 md:grid-cols-3'>
                            <Field label='Kategoriya'>
                                <Select disabled={isLoading}>
                                    <SelectTrigger className='border-[#eadfce] bg-white font-semibold dark:border-slate-800 dark:bg-slate-900'>
                                        <SelectValue placeholder={isLoading ? 'Yuklanmoqda...' : 'Tanlang'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category._id} value={category._id}>
                                                {category.title?.uz ||
                                                    category.title?.ru ||
                                                    category.title?.en ||
                                                    'Kategoriya'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field label='Muallif'>
                                <Select disabled={isLoading}>
                                    <SelectTrigger className='border-[#eadfce] bg-white font-semibold dark:border-slate-800 dark:bg-slate-900'>
                                        <SelectValue placeholder={isLoading ? 'Yuklanmoqda...' : 'Tanlang'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {authors.map((author) => (
                                            <SelectItem key={author._id} value={author._id}>
                                                {author.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field label='Nashriyot'>
                                <Select disabled={isLoading}>
                                    <SelectTrigger className='border-[#eadfce] bg-white font-semibold dark:border-slate-800 dark:bg-slate-900'>
                                        <SelectValue placeholder={isLoading ? 'Yuklanmoqda...' : 'Tanlang'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {publishers.map((publisher) => (
                                            <SelectItem key={publisher._id} value={publisher._id}>
                                                {publisher.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                    </section>

                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <SectionTitle icon={FileText} title='Kitob xususiyatlari' />

                        <div className='grid gap-4 md:grid-cols-4'>
                            <Field label='Til'>
                                <Select defaultValue='uz'>
                                    <SelectTrigger className='border-[#eadfce] bg-white font-semibold dark:border-slate-800 dark:bg-slate-900'>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='uz'>O'zbekcha</SelectItem>
                                        <SelectItem value='ru'>Ruscha</SelectItem>
                                        <SelectItem value='en'>Inglizcha</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field label='Yozuv'>
                                <Select defaultValue='latin'>
                                    <SelectTrigger className='border-[#eadfce] bg-white font-semibold dark:border-slate-800 dark:bg-slate-900'>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='latin'>Lotin</SelectItem>
                                        <SelectItem value='cyrillic'>Kirill</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field label='Muqova'>
                                <Select defaultValue='hard'>
                                    <SelectTrigger className='border-[#eadfce] bg-white font-semibold dark:border-slate-800 dark:bg-slate-900'>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='hard'>Qattiq</SelectItem>
                                        <SelectItem value='paper'>Yumshoq</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field label='Format'>
                                <Select defaultValue='paper'>
                                    <SelectTrigger className='border-[#eadfce] bg-white font-semibold dark:border-slate-800 dark:bg-slate-900'>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='paper'>Qog'oz</SelectItem>
                                        <SelectItem value='ebook'>Elektron</SelectItem>
                                        <SelectItem value='audio'>Audio</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field label='Betlar soni'>
                                <Input type='number' className={inputClass} placeholder='320' />
                            </Field>
                            <Field label='Nashr yili'>
                                <Input type='number' className={inputClass} placeholder='2026' />
                            </Field>
                            <Field label="Og'irligi">
                                <Input className={inputClass} placeholder='450 g' />
                            </Field>
                            <Field label="O'lchami">
                                <Input className={inputClass} placeholder='14 x 21 sm' />
                            </Field>
                        </div>
                    </section>
                </div>

                <aside className='space-y-5'>
                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <SectionTitle icon={ImagePlus} title='Kitob rasmi' />

                        <div className='grid aspect-[3/4] place-items-center rounded-[22px] border-2 border-dashed border-[#eadfce] bg-[#f7f0e6] p-5 text-center dark:border-slate-800 dark:bg-slate-900'>
                            <div>
                                <div className='mx-auto grid size-14 place-items-center rounded-2xl bg-white text-[#ef7f1a] shadow-sm dark:bg-slate-950'>
                                    <Upload size={24} />
                                </div>
                                <p className='mt-4 text-sm font-black text-[#2f2a25] dark:text-white'>Rasm yuklash</p>
                                <p className='mt-1 text-xs font-semibold text-[#9d907e] dark:text-slate-500'>
                                    JPG, PNG yoki WEBP
                                </p>
                            </div>
                        </div>

                        <Input
                            type='file'
                            accept='image/*'
                            className='mt-4 h-auto rounded-2xl border-[#eadfce] bg-white py-3 text-sm font-semibold dark:border-slate-800 dark:bg-slate-900'
                        />
                    </section>

                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <SectionTitle icon={DollarSign} title='Narx' />

                        <div className='space-y-4'>
                            <Field label='Asosiy narx'>
                                <Input type='number' className={inputClass} placeholder='85000' />
                            </Field>
                            <Field label='Eski narx'>
                                <Input type='number' className={inputClass} placeholder='99000' />
                            </Field>
                            <Field label='Chegirma (%)'>
                                <Input type='number' className={inputClass} placeholder='15' />
                            </Field>
                        </div>
                    </section>

                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <SectionTitle icon={Boxes} title='Zaxira' />

                        <div className='space-y-4'>
                            <Field label='Umumiy zaxira'>
                                <Input type='number' className={inputClass} placeholder='120' />
                            </Field>
                            <Field label='Holat'>
                                <Select defaultValue='active'>
                                    <SelectTrigger className='border-[#eadfce] bg-white font-semibold dark:border-slate-800 dark:bg-slate-900'>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='active'>Faol</SelectItem>
                                        <SelectItem value='draft'>Qoralama</SelectItem>
                                        <SelectItem value='hidden'>Yashirilgan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>
                    </section>

                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <SectionTitle icon={Languages} title='Belgilar' />

                        <div className='grid grid-cols-2 gap-3'>
                            {['Yangi', 'Top', 'Hit', 'Chegirma'].map((label) => (
                                <label
                                    key={label}
                                    className='flex h-11 items-center gap-2 rounded-2xl bg-white px-3 text-sm font-black text-[#6f6255] ring-1 ring-[#eadfce] dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800'>
                                    <input type='checkbox' className='size-4 accent-[#ef7f1a]' />
                                    {label}
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <SectionTitle icon={CalendarDays} title='Nashr sozlamalari' />
                        <Button className='h-12 w-full rounded-2xl bg-[#ef7f1a] font-black text-white hover:bg-orange-600'>
                            <Save size={18} />
                            Kitobni saqlash
                        </Button>
                    </section>
                </aside>
            </form>
        </div>
    );
};

export default AdminNewBookPage;
