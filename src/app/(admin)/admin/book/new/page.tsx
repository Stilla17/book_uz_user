'use client';

import { useEffect, useMemo } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useCreateBook } from '@/components/admin/hooks/bookHooks/useCreateBook';
import { useUpdateBook } from '@/components/admin/hooks/bookHooks/useUpdateBook';
import { useBookDetailQuery } from '@/components/admin/hooks/queries/book';
import { useImagePreview } from '@/components/admin/hooks/useImagePreview';
import { Field, SectionTitle, inputClass } from '@/components/admin/other/FiledSettingsAdmin';
import SearchableSelect, { type SearchableOption } from '@/components/admin/other/SearchableSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { filterService } from '@/services/filter.service';
import { Book, BookFormValues } from '@/types/book';
import { getLatestImageUrl } from '@/utils/image';
import { useQuery } from '@tanstack/react-query';

import { ArrowLeft, BookOpen, FileText, ImagePlus, Loader, Save, Sparkles, Upload, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const getRelationId = (value: unknown) => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && '_id' in value) {
        return String((value as { _id?: string })._id || '');
    }

    return '';
};

const getBookSubCategoryId = (book: Book) => {
    const maybeBook = book as Book & {
        subCategoryId?: string | { _id?: string };
        subCategory?: string | { _id?: string };
        subgenre?: string | { _id?: string };
    };

    return (
        getRelationId(maybeBook.subCategoryId) ||
        getRelationId(maybeBook.subCategory) ||
        getRelationId(maybeBook.subgenre)
    );
};

const getBookCategoryId = (book: Book) => {
    const maybeBook = book as Book & {
        category?: Array<{ _id?: string }> | string | { _id?: string };
    };

    if (Array.isArray(maybeBook.category)) {
        return maybeBook.category[0]?._id || '';
    }

    return getRelationId(maybeBook.category);
};

const getTextValue = (value: unknown) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);

    return '';
};

const getBookBarcode = (book: Book) => {
    const maybeBook = book as Book & {
        code?: string | number;
        sku?: string | number;
        article?: string | number;
    };

    return (
        getTextValue(maybeBook.barcode) ||
        getTextValue(maybeBook.isbn) ||
        getTextValue(maybeBook.details?.isbn) ||
        getTextValue(maybeBook.code) ||
        getTextValue(maybeBook.sku) ||
        getTextValue(maybeBook.article)
    );
};

const AdminNewBookPage = () => {
    const { handleSubmit, register, setValue, watch, reset } = useForm<BookFormValues>({
        defaultValues: {
            title: {
                uz: '',
                ru: '',
                en: ''
            },
            description: {
                uz: '',
                ru: '',
                en: ''
            },
            isbn: '',
            slug: '',
            category: '',
            subCategoryId: '',
            author: '',
            publisher: '',
            language: 'uz',
            contentLanguage: 'latin',
            cover: 'hardcover',
            format: 'paper',
            pages: 0,
            publishedYear: new Date().getFullYear(),
            weight: '',
            price: 0,
            oldPrice: undefined,
            discount: undefined
        }
    });
    const router = useRouter();
    const { imageFile, imagePreview, handleImageChange, setImagePreview, clearImagePreview } = useImagePreview();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const { mutate: createBook, isPending: isCreatePending } = useCreateBook();
    const { mutate: updateBook, isPending: isUpdatePending } = useUpdateBook();
    const { data: bookData, isLoading: isDetailLoading } = useBookDetailQuery(id);
    const isEdit = !!id;
    const isPending = id ? isUpdatePending : isCreatePending;

    useEffect(() => {
        if (bookData) {
            setValue('title.uz', typeof bookData.title === 'object' ? bookData.title?.uz || '' : bookData.title || '');
            setValue('title.ru', typeof bookData.title === 'object' ? bookData.title?.ru || '' : '');
            setValue('title.en', typeof bookData.title === 'object' ? bookData.title?.en || '' : '');

            setValue(
                'description.uz',
                typeof bookData.description === 'object' ? bookData.description?.uz || '' : bookData.description || ''
            );
            setValue('description.ru', typeof bookData.description === 'object' ? bookData.description?.ru || '' : '');
            setValue('description.en', typeof bookData.description === 'object' ? bookData.description?.en || '' : '');
            setValue('isbn', getBookBarcode(bookData));
            setValue('slug', bookData.slug || '');
            setValue('price', bookData.price || 0);
            setValue('oldPrice', bookData.oldPrice);
            setValue('discount', bookData.discount);

            setValue('category', getBookCategoryId(bookData));
            setValue('subCategoryId', getBookSubCategoryId(bookData));
            setValue('author', typeof bookData.author === 'string' ? bookData.author : bookData.author?._id || '');
            setValue('publisher', getRelationId(bookData.publisher));

            setValue('language', bookData.language || 'uz');
            setValue('contentLanguage', (bookData.contentLanguage as BookFormValues['contentLanguage']) || 'latin');
            setValue('cover', (bookData.cover as BookFormValues['cover']) || 'hardcover');
            setValue('format', bookData.format || 'paper');

            setValue('pages', bookData.pages || bookData.numberOfPage || bookData.details?.pages || 0);
            setValue(
                'publishedYear',
                bookData.year || bookData.publishedYear || bookData.details?.publishedYear || new Date().getFullYear()
            );
            setValue('weight', bookData.weight || bookData.details?.weight || '');

            const previewImage = getLatestImageUrl(bookData.images) || getLatestImageUrl(bookData.image);
            if (previewImage) {
                setImagePreview(previewImage);
            }
        }
    }, [bookData, setImagePreview, setValue]);

    const { data: filters, isLoading } = useQuery({
        queryKey: ['admin-book-form-filters'],
        queryFn: () => filterService.getAllFilters()
    });

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    const categories = filters?.categories ?? [];
    const authors = filters?.authors ?? [];
    const publishers = filters?.publishers ?? [];
    const categoryOptions = useMemo<SearchableOption[]>(
        () =>
            categories.map((category) => ({
                value: category._id,
                label: category.title?.uz || category.title?.ru || category.title?.en || 'Kategoriya'
            })),
        [categories]
    );
    const authorOptions = useMemo<SearchableOption[]>(
        () => authors.map((author) => ({ value: author._id, label: author.name })),
        [authors]
    );
    const publisherOptions = useMemo<SearchableOption[]>(
        () => publishers.map((publisher) => ({ value: publisher._id, label: publisher.name })),
        [publishers]
    );
    const categoryId = watch('category');
    const subCategoryId = watch('subCategoryId');
    const authorId = watch('author');
    const publisherId = watch('publisher');
    const language = watch('language');
    const contentLanguage = watch('contentLanguage');
    const cover = watch('cover');
    const format = watch('format');
    const selectedCategory = categories.find((category) => category._id === categoryId);
    const subCategoryOptions = useMemo<SearchableOption[]>(
        () =>
            [...(selectedCategory?.subCategories ?? []), ...(selectedCategory?.subgenres ?? [])]
                .filter((subCategory) => Boolean(subCategory._id))
                .map((subCategory) => ({
                    value: subCategory._id!,
                    label:
                        subCategory.title?.uz ||
                        subCategory.title?.ru ||
                        subCategory.title?.en ||
                        subCategory.slug ||
                        'Subkategoriya'
                })),
        [selectedCategory]
    );

    const appendText = (formData: FormData, key: string, value?: string | null) => {
        const trimmedValue = value?.trim();
        if (trimmedValue) formData.append(key, trimmedValue);
    };

    const appendNumber = (formData: FormData, key: string, value?: number | null) => {
        if (typeof value === 'number' && Number.isFinite(value)) {
            formData.append(key, String(value));
        }
    };

    const onSubmit = (values: BookFormValues) => {
        const coverValue = (values.cover as string) === 'hard' ? 'hardcover' : values.cover;

        if (!values.title.uz.trim()) {
            toast.error('Kitob nomi (UZ) majburiy');
            return;
        }

        if (!values.category || !values.subCategoryId || !values.author || !values.publisher) {
            toast.error('Kategoriya, subkategoriya, muallif va nashriyotni tanlang');
            return;
        }

        if (!Number.isFinite(values.price) || values.price <= 0) {
            toast.error("Asosiy narxni to'g'ri kiriting");
            return;
        }

        const formData = new FormData();

        if (imageFile) formData.append('images', imageFile);
        appendText(formData, 'title[uz]', values.title.uz);
        appendText(formData, 'title[ru]', values.title.ru);
        appendText(formData, 'title[en]', values.title.en);
        appendText(formData, 'description[uz]', values.description.uz);
        appendText(formData, 'description[ru]', values.description.ru);
        appendText(formData, 'description[en]', values.description.en);
        appendText(formData, 'barcode', values.isbn);
        appendText(formData, 'isbn', values.isbn);
        appendText(formData, 'details[isbn]', values.isbn);
        appendText(formData, 'slug', values.slug);
        formData.append('category', values.category);
        formData.append('subCategoryId', values.subCategoryId);
        formData.append('author', values.author);
        formData.append('publisher', values.publisher);
        formData.append('language', values.language);
        formData.append('contentLanguage', values.contentLanguage);
        formData.append('cover', coverValue);
        if (values.format !== 'paper') {
            formData.append('format', values.format);
        }
        appendNumber(formData, 'pages', values.pages);
        appendNumber(formData, 'numberOfPage', values.pages);
        appendNumber(formData, 'details[pages]', values.pages);
        appendNumber(formData, 'publishedYear', values.publishedYear);
        appendNumber(formData, 'year', values.publishedYear);
        appendNumber(formData, 'details[publishedYear]', values.publishedYear);
        appendText(formData, 'weight', values.weight);
        appendText(formData, 'details[weight]', values.weight);
        appendNumber(formData, 'price', values.price);
        appendNumber(formData, 'oldPrice', values.oldPrice);
        appendNumber(formData, 'discount', values.discount);

        if (id) {
            updateBook(
                { id, formData },
                {
                    onSuccess: (response: unknown) => {
                        const updated = (response as { data?: { image?: string; images?: string[] } })?.data;
                        const previewImage = getLatestImageUrl(updated?.images) || getLatestImageUrl(updated?.image);
                        if (previewImage) {
                            setImagePreview(previewImage);
                        }
                        toast.success('Kitob muvaffaqiyatli yangilandi');
                        router.push('/admin/book');
                        router.refresh();
                    }
                }
            );
        } else {
            createBook(formData, {
                onSuccess: () => {
                    reset();
                    clearImagePreview();
                    toast.success("Kitob muvaffaqiyatli qo'shildi");
                    router.push('/admin/book');
                    router.refresh();
                }
            });
        }
    };

    return (
        <div className='no-scrollbar h-[calc(100vh-150px)] space-y-4 overflow-y-auto pr-1 pb-4'>
            <section className='flex flex-col gap-4 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:flex-row md:items-center md:justify-between md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
                <div className='min-w-0'>
                    <Link
                        href='/admin/book'
                        className='inline-flex items-center gap-2 text-sm font-black text-[#9d907e] transition hover:text-[#ef7f1a] dark:text-slate-400 dark:hover:text-white'>
                        <ArrowLeft size={17} />
                        Barcha kitoblar
                    </Link>
                    <h2 className='mt-3 text-2xl font-black text-[#2f2a25] dark:text-white'>
                        {isEdit ? 'Kitobni tahrirlash' : "Yangi kitob qo'shish"}
                    </h2>
                    <p className='mt-2 max-w-2xl text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                        {isEdit
                            ? "Kitob ma'lumotlarini yangilang va o'zgarishlarni saqlang."
                            : "Kitob kartochkasi uchun asosiy ma'lumotlar, narx, zaxira va katalog parametrlarini kiriting."}
                    </p>
                </div>

                <div className='flex gap-2'>
                    <Button
                        asChild
                        variant='outline'
                        className='h-11 rounded-2xl border-[#eadfce] bg-white font-black dark:border-slate-800 dark:bg-slate-900'
                        disabled={isPending}>
                        <Link href='/admin/book'>Bekor qilish</Link>
                    </Button>
                    <Button
                        type='submit'
                        form='book-form'
                        disabled={isPending}
                        className='h-11 rounded-2xl bg-[#ef7f1a] px-5 font-black text-white hover:bg-orange-600 disabled:opacity-50'>
                        <Save size={18} />
                        {isPending ? 'Saqlanmoqda...' : isEdit ? 'Yangilash' : 'Saqlash'}
                    </Button>
                </div>
            </section>

            <form
                id='book-form'
                onSubmit={handleSubmit(onSubmit)}
                className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]'>
                {isDetailLoading && (
                    <div className='flex items-center justify-center gap-2 rounded-[24px] bg-[#fffaf2] p-8 text-sm font-semibold text-[#8b7e70] ring-1 ring-[#eadfce] xl:col-span-2 dark:bg-slate-950 dark:text-slate-400 dark:ring-slate-800'>
                        <Loader size={18} className='animate-spin' />
                        Yuklanmoqda...
                    </div>
                )}

                <div className='space-y-5'>
                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <SectionTitle icon={BookOpen} title="Asosiy ma'lumotlar" />

                        <div className='grid gap-4 md:grid-cols-2'>
                            <Field label='Kitob nomi (UZ)'>
                                <Input
                                    className={inputClass}
                                    placeholder='Masalan: Oq kema'
                                    {...register('title.uz', { required: true })}
                                />
                            </Field>
                            <Field label='Kitob nomi (RU)'>
                                <Input className={inputClass} placeholder='Название книги' {...register('title.ru')} />
                            </Field>
                            <Field label='Kitob nomi (EN)'>
                                <Input className={inputClass} placeholder='Book title' {...register('title.en')} />
                            </Field>
                            <Field label='ISBN / Barcode'>
                                <Input className={inputClass} placeholder='978...' {...register('isbn')} />
                            </Field>
                        </div>

                        <div className='mt-4 grid gap-4 md:grid-cols-3'>
                            <Field label='Tavsif (UZ)' hint='Qisqa va tushunarli tavsif yozing.'>
                                <textarea
                                    rows={6}
                                    className='min-h-36 w-full resize-none rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-semibold text-[#2f2a25] shadow-sm transition outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500'
                                    placeholder="Kitob haqida ma'lumot..."
                                    {...register('description.uz')}
                                />
                            </Field>
                            <Field label='Tavsif (RU)'>
                                <textarea
                                    rows={6}
                                    className='min-h-36 w-full resize-none rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-semibold text-[#2f2a25] shadow-sm transition outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500'
                                    placeholder='Описание книги...'
                                    {...register('description.ru')}
                                />
                            </Field>
                            <Field label='Tavsif (EN)'>
                                <textarea
                                    rows={6}
                                    className='min-h-36 w-full resize-none rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-semibold text-[#2f2a25] shadow-sm transition outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500'
                                    placeholder='Book description...'
                                    {...register('description.en')}
                                />
                            </Field>
                        </div>
                        <div className='mt-4 grid grid-cols-2 gap-4 space-y-4'>
                            <Field label='Asosiy narx'>
                                <Input
                                    type='number'
                                    className={inputClass}
                                    placeholder='85000'
                                    {...register('price', { valueAsNumber: true })}
                                />
                            </Field>
                            <Field label='Slug'>
                                <Input type='text' className={inputClass} placeholder='oq-kema' {...register('slug')} />
                            </Field>
                        </div>
                    </section>

                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <SectionTitle icon={FileText} title='Kitob xususiyatlari' />

                        <div className='grid gap-4 md:grid-cols-4'>
                            <Field label='Til'>
                                <Select value={language} onValueChange={(value) => setValue('language', value)}>
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
                                <Select
                                    value={contentLanguage}
                                    onValueChange={(value) =>
                                        setValue('contentLanguage', value as BookFormValues['contentLanguage'])
                                    }>
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
                                <Select
                                    value={cover}
                                    onValueChange={(value) => setValue('cover', value as BookFormValues['cover'])}>
                                    <SelectTrigger className='border-[#eadfce] bg-white font-semibold dark:border-slate-800 dark:bg-slate-900'>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='hardcover'>Qattiq</SelectItem>
                                        <SelectItem value='paper'>Yumshoq</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <Field label='Format'>
                                <Select
                                    value={format}
                                    onValueChange={(value) => setValue('format', value as BookFormValues['format'])}>
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
                                <Input
                                    type='number'
                                    className={inputClass}
                                    placeholder='320'
                                    {...register('pages', { valueAsNumber: true })}
                                />
                            </Field>
                            <Field label='Nashr yili'>
                                <Input
                                    type='number'
                                    className={inputClass}
                                    placeholder='2026'
                                    {...register('publishedYear', { valueAsNumber: true })}
                                />
                            </Field>
                            <Field label="Og'irligi">
                                <Input className={inputClass} placeholder='450 g' {...register('weight')} />
                            </Field>
                        </div>
                    </section>
                </div>

                <aside className='space-y-5'>
                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <SectionTitle icon={Sparkles} title='Katalog' />

                        <div className='grid gap-4'>
                            <Field label='Kategoriya'>
                                <SearchableSelect
                                    value={categoryId}
                                    name='category'
                                    options={categoryOptions}
                                    placeholder={isLoading ? 'Yuklanmoqda...' : 'Tanlang'}
                                    disabled={isLoading}
                                    onChange={(value) => {
                                        setValue('category', value);
                                        setValue('subCategoryId', '');
                                    }}
                                />
                            </Field>

                            <Field label='Subkategoriya'>
                                <SearchableSelect
                                    value={subCategoryId}
                                    name='subCategoryId'
                                    options={subCategoryOptions}
                                    placeholder={categoryId ? 'Tanlang' : 'Avval kategoriya tanlang'}
                                    disabled={isLoading || !categoryId}
                                    onChange={(value) => setValue('subCategoryId', value)}
                                />
                            </Field>

                            <Field label='Muallif'>
                                <SearchableSelect
                                    value={authorId}
                                    name='author'
                                    options={authorOptions}
                                    placeholder={isLoading ? 'Yuklanmoqda...' : 'Tanlang'}
                                    disabled={isLoading}
                                    onChange={(value) => setValue('author', value)}
                                />
                            </Field>

                            <Field label='Nashriyot'>
                                <SearchableSelect
                                    value={publisherId}
                                    name='publisher'
                                    options={publisherOptions}
                                    placeholder={isLoading ? 'Yuklanmoqda...' : 'Tanlang'}
                                    disabled={isLoading}
                                    onChange={(value) => setValue('publisher', value)}
                                />
                            </Field>
                        </div>
                    </section>

                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <SectionTitle icon={ImagePlus} title='Kitob rasmi' />

                        <div className='relative grid aspect-[3/4] place-items-center overflow-hidden rounded-[22px] border-2 border-dashed border-[#eadfce] bg-[#f7f0e6] p-5 text-center dark:border-slate-800 dark:bg-slate-900'>
                            {imagePreview ? (
                                <div className='absolute inset-0'>
                                    <img src={imagePreview} alt='Kitob rasmi' className='h-full w-full object-cover' />
                                    <button
                                        type='button'
                                        onClick={clearImagePreview}
                                        className='absolute top-3 right-3 grid size-9 place-items-center rounded-xl bg-white text-red-500 shadow-sm transition hover:bg-red-50 dark:bg-slate-950 dark:hover:bg-red-500/10'
                                        aria-label='Rasmni olib tashlash'>
                                        <X size={17} />
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className='mx-auto grid size-14 place-items-center rounded-2xl bg-white text-[#ef7f1a] shadow-sm dark:bg-slate-950'>
                                        <Upload size={24} />
                                    </div>
                                    <p className='mt-4 text-sm font-black text-[#2f2a25] dark:text-white'>
                                        Rasm yuklash
                                    </p>
                                    <p className='mt-1 text-xs font-semibold text-[#9d907e] dark:text-slate-500'>
                                        JPG, PNG yoki WEBP
                                    </p>
                                </div>
                            )}
                        </div>

                        <Input
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                            className='mt-4 h-auto rounded-2xl border-[#eadfce] bg-white py-3 text-sm font-semibold dark:border-slate-800 dark:bg-slate-900'
                        />
                    </section>
                </aside>
            </form>
        </div>
    );
};

export default AdminNewBookPage;
