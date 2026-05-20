'use client';

import { useEffect } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useCreateGenre } from '@/components/admin/hooks/genreHooks/useCreateGenre';
import { useUpdateGenre } from '@/components/admin/hooks/genreHooks/useUpdateGenre';
import { useDetailQuery, useGenreQuery } from '@/components/admin/hooks/queries/genre';
import { Field, SectionTitle, inputClass } from '@/components/admin/other/FiledSettingsAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ArrowLeft, FolderTree, Globe2, Plus, Save, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type SubgenreForm = {
    title: {
        uz: string;
        ru: string;
        en: string;
    };
    slug: string;
};

type GenreFormValues = {
    title: {
        uz: string;
        ru: string;
        en: string;
    };
    slug: string;
    subgenres: SubgenreForm[];
};

const GenreOptions = ({
    id,
    genres,
    getValue
}: {
    id: string;
    genres: NonNullable<ReturnType<typeof useGenreQuery>['data']>;
    getValue: (genre: NonNullable<ReturnType<typeof useGenreQuery>['data']>[number]) => string;
}) => (
    <datalist id={id}>
        {genres.map((genre) => (
            <option key={genre._id} value={getValue(genre)} />
        ))}
    </datalist>
);

const createEmptySubgenre = (): SubgenreForm => ({
    title: {
        uz: '',
        ru: '',
        en: ''
    },
    slug: ''
});

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/['"`]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const AdminNewGenrePage = () => {
    const { data: genres = [] } = useGenreQuery();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const editId = id;

    const { control, getValues, handleSubmit, register, setValue, reset } = useForm<GenreFormValues>({
        defaultValues: {
            title: {
                uz: '',
                ru: '',
                en: ''
            },
            slug: '',
            subgenres: [createEmptySubgenre()]
        }
    });

    const { mutateAsync: updateGenre, isPending: isUpdateGenre } = useUpdateGenre();
    const { mutateAsync: createGenre, isPending: isCreateGenre } = useCreateGenre();
    const { data: genreData } = useDetailQuery(id);

    const isPending = id ? isUpdateGenre : isCreateGenre;

    useEffect(() => {
        if (genreData) {
            reset({
                title: genreData.title,
                slug: genreData.slug || '',
                subgenres: genreData.subgenres.length
                    ? genreData.subgenres.map((subgenre) => ({
                          title: subgenre.title,
                          slug: subgenre.slug || ''
                      }))
                    : [createEmptySubgenre()]
            });
        }
    }, [genreData, reset]);

    const { append, fields, remove, replace } = useFieldArray({
        control,
        name: 'subgenres'
    });

    const handleTitleUzChange = (value: string) => {
        const selectedGenre = genres.find((genre) => genre.title.uz === value);

        if (selectedGenre) {
            setValue('title', selectedGenre.title);
            setValue('slug', selectedGenre.slug || '');
            return;
        }

        setValue('title.uz', value);
        if (!getValues('slug')) setValue('slug', slugify(value));
    };

    const handleSubgenreTitleUzChange = (index: number, value: string) => {
        if (!getValues(`subgenres.${index}.slug`)) setValue(`subgenres.${index}.slug`, slugify(value));
    };

    const removeSubgenre = (index: number) => {
        if (fields.length === 1) {
            replace([createEmptySubgenre()]);
            return;
        }

        remove(index);
    };

    const onSubmit = async (values: GenreFormValues) => {
        try {
            if (id) {
                await updateGenre({ id, data: values });
                toast.success('Janr muvaffaqiyatli yangilandi');
                router.push('/admin/genre');
                router.refresh();
            } else {
                await createGenre(values);
                reset({
                    title: {
                        uz: '',
                        ru: '',
                        en: ''
                    },
                    slug: '',
                    subgenres: [createEmptySubgenre()]
                });
                toast.success("Janr muvaffaqiyatli qo'shildi");
                router.push('/admin/genre');
                router.refresh();
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message || "Janr qo'shishda xatolik");
        }
    };
    return (
        <div className='space-y-5'>
            <section className='flex flex-col gap-4 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:flex-row md:items-center md:justify-between md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
                <div className='min-w-0'>
                    <Link
                        href='/admin/genre'
                        className='inline-flex items-center gap-2 text-sm font-black text-[#9d907e] transition hover:text-[#ef7f1a] dark:text-slate-400 dark:hover:text-white'>
                        <ArrowLeft size={17} />
                        Barcha janrlar
                    </Link>
                    <h2 className='mt-3 text-2xl font-black text-[#2f2a25] dark:text-white'>
                        {id ? 'Janrni yangilash' : "Yangi janr qo'shish"}
                    </h2>
                    <p className='mt-2 max-w-2xl text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                        {id
                            ? " Katalog janr nomlarini yangilang va o'zgarishlarni saqlang."
                            : " Katalog uchun janr nomi, slug, ko'rinish holati va subjanrlarni kiriting."}
                    </p>
                </div>

                <div className='flex gap-2'>
                    <Button
                        asChild
                        variant='outline'
                        className='h-11 rounded-2xl border-[#eadfce] bg-white font-black dark:border-slate-800 dark:bg-slate-900'>
                        <Link href='/admin/genre'>Bekor qilish</Link>
                    </Button>
                    <Button
                        type='submit'
                        form='genre-form'
                        className='h-11 rounded-2xl bg-[#ef7f1a] px-5 font-black text-white hover:bg-orange-600'>
                        <Save size={18} />
                        {isPending ? 'Saqlanmoqda...' : editId ? 'Yangilash' : 'Saqlash'}
                    </Button>
                </div>
            </section>

            <form id='genre-form' onSubmit={handleSubmit(onSubmit)}>
                <div className='space-y-5'>
                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <SectionTitle icon={Globe2} title="Janr ma'lumotlari" />

                        <div className='grid gap-4 md:grid-cols-4'>
                            <Field label='Nomi uz'>
                                <Input
                                    list='genre-title-uz-options'
                                    className={inputClass}
                                    placeholder='Badiiy adabiyot'
                                    {...register('title.uz', {
                                        required: true,
                                        onChange: (event) => handleTitleUzChange(event.target.value)
                                    })}
                                />
                            </Field>
                            <Field label='Nomi ru'>
                                <Input
                                    list='genre-title-ru-options'
                                    className={inputClass}
                                    placeholder='Russcha nomi'
                                    {...register('title.ru', { required: true })}
                                />
                            </Field>
                            <Field label='Nomi en'>
                                <Input
                                    list='genre-title-en-options'
                                    className={inputClass}
                                    placeholder='Fiction'
                                    {...register('title.en', { required: true })}
                                />
                            </Field>
                            <Field label='Slug'>
                                <Input
                                    list='genre-slug-options'
                                    className={inputClass}
                                    placeholder='badiiy-adabiyot'
                                    {...register('slug', {
                                        required: true,
                                        onChange: (event) => setValue('slug', slugify(event.target.value))
                                    })}
                                />
                            </Field>
                        </div>

                        <GenreOptions
                            id='genre-title-uz-options'
                            genres={genres}
                            getValue={(genre) => genre.title.uz}
                        />
                        <GenreOptions
                            id='genre-title-ru-options'
                            genres={genres}
                            getValue={(genre) => genre.title.ru}
                        />
                        <GenreOptions
                            id='genre-title-en-options'
                            genres={genres}
                            getValue={(genre) => genre.title.en}
                        />
                        <GenreOptions id='genre-slug-options' genres={genres} getValue={(genre) => genre.slug} />
                    </section>

                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                            <SectionTitle icon={FolderTree} title='Subjanrlar' />
                            <Button
                                type='button'
                                onClick={() => append(createEmptySubgenre())}
                                className='h-10 rounded-2xl bg-[#285c7f] px-4 font-black text-white hover:bg-[#214c69]'>
                                <Plus size={17} />
                                Subjanr
                            </Button>
                        </div>

                        <div className='space-y-3'>
                            {fields.map((subgenre, index) => (
                                <div
                                    key={subgenre.id}
                                    className='rounded-[22px] bg-white p-4 ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'>
                                    <div className='mb-3 flex items-center justify-between gap-3'>
                                        <p className='text-sm font-black text-[#6f6255] dark:text-slate-300'>
                                            Subjanr {index + 1}
                                        </p>
                                        <button
                                            type='button'
                                            onClick={() => removeSubgenre(index)}
                                            className='grid size-9 place-items-center rounded-xl text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10'
                                            aria-label='Subjanrni olib tashlash'>
                                            <Trash2 size={17} />
                                        </button>
                                    </div>

                                    <div className='grid gap-3 md:grid-cols-4'>
                                        <Input
                                            className={inputClass}
                                            placeholder='Nomi uz'
                                            {...register(`subgenres.${index}.title.uz`, {
                                                required: true,
                                                onChange: (event) =>
                                                    handleSubgenreTitleUzChange(index, event.target.value)
                                            })}
                                        />
                                        <Input
                                            className={inputClass}
                                            placeholder='Nomi ru'
                                            {...register(`subgenres.${index}.title.ru`, { required: true })}
                                        />
                                        <Input
                                            className={inputClass}
                                            placeholder='Nomi en'
                                            {...register(`subgenres.${index}.title.en`, { required: true })}
                                        />
                                        <Input
                                            className={inputClass}
                                            placeholder='Slug'
                                            {...register(`subgenres.${index}.slug`, {
                                                required: true,
                                                onChange: (event) =>
                                                    setValue(`subgenres.${index}.slug`, slugify(event.target.value))
                                            })}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </form>
        </div>
    );
};

export default AdminNewGenrePage;
