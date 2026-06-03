export const PublishersSkeleton = () => (
    <div className='grid gap-3 p-4'>
        {Array.from({ length: 6 }).map((_, index) => (
            <article
                key={index}
                className='grid gap-4 rounded-[20px] bg-white p-4 ring-1 ring-[#eadfce] md:grid-cols-[minmax(0,1fr)_130px_120px_auto] md:items-center dark:bg-slate-900 dark:ring-slate-800'>
                <div className='flex min-w-0 items-center gap-3'>
                    <div className='size-13 shrink-0 animate-pulse rounded-2xl bg-[#f2e7d8] dark:bg-slate-950' />
                    <div className='min-w-0 flex-1 space-y-2'>
                        <div className='h-4 w-44 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-950' />
                        <div className='h-3 w-28 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-950' />
                    </div>
                </div>

                <div className='space-y-2'>
                    <div className='h-3 w-16 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-950' />
                    <div className='h-4 w-10 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-950' />
                </div>

                <div className='space-y-2'>
                    <div className='h-3 w-14 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-950' />
                    <div className='h-4 w-20 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-950' />
                </div>

                <div className='flex justify-end gap-2'>
                    <div className='size-9 animate-pulse rounded-xl bg-[#f2e7d8] dark:bg-slate-950' />
                    <div className='size-9 animate-pulse rounded-xl bg-[#f2e7d8] dark:bg-slate-950' />
                </div>
            </article>
        ))}
    </div>
);

export const BooksTableSkeleton = () => (
    <>
        {Array.from({ length: 7 }).map((_, index) => (
            <tr key={index} className='border-b border-[#f0e4d3] last:border-0 dark:border-slate-900'>
                <td className='px-4 py-4'>
                    <div className='flex items-center gap-3'>
                        <div className='size-14 animate-pulse rounded-2xl bg-[#f2e7d8] dark:bg-slate-900' />
                        <div className='min-w-0 flex-1 space-y-2'>
                            <div className='h-4 w-44 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-900' />
                            <div className='h-3 w-28 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-900' />
                        </div>
                    </div>
                </td>
                <td className='px-4 py-4'>
                    <div className='h-4 w-28 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-900' />
                </td>
                <td className='px-4 py-4'>
                    <div className='h-4 w-24 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-900' />
                </td>
                <td className='px-4 py-4'>
                    <div className='h-7 w-28 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-900' />
                </td>
                <td className='px-4 py-4'>
                    <div className='h-7 w-16 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-900' />
                </td>
                <td className='px-4 py-4'>
                    <div className='ml-auto h-8 w-28 animate-pulse rounded-xl bg-[#f2e7d8] dark:bg-slate-900' />
                </td>
            </tr>
        ))}
    </>
);

export const BooksCardSkeleton = () => (
    <>
        {Array.from({ length: 5 }).map((_, index) => (
            <article
                key={index}
                className='rounded-[20px] bg-white p-3 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'>
                <div className='flex gap-3'>
                    <div className='size-16 shrink-0 animate-pulse rounded-2xl bg-[#f2e7d8] dark:bg-slate-800' />
                    <div className='min-w-0 flex-1 space-y-2'>
                        <div className='h-4 w-4/5 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-800' />
                        <div className='h-3 w-1/2 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-800' />
                        <div className='h-4 w-24 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-800' />
                    </div>
                </div>
                <div className='mt-3 flex items-center justify-between'>
                    <div className='h-7 w-28 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-800' />
                    <div className='h-8 w-24 animate-pulse rounded-xl bg-[#f2e7d8] dark:bg-slate-800' />
                </div>
            </article>
        ))}
    </>
);

export const AdminCommentsSkeleton = () => (
    <>
        {Array.from({ length: 4 }).map((_, index) => (
            <article
                key={index}
                className='rounded-[22px] bg-white p-4 ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'>
                <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                    <div className='min-w-0 flex-1 space-y-3'>
                        <div className='flex flex-wrap items-center gap-2'>
                            <div className='h-6 w-24 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-950' />
                            <div className='h-6 w-28 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-950' />
                        </div>
                        <div className='h-5 w-3/4 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-950' />
                    </div>

                    <div className='flex items-center gap-1'>
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                            <div
                                key={starIndex}
                                className='size-4 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-950'
                            />
                        ))}
                    </div>
                </div>

                <div className='mt-4 space-y-2 rounded-2xl bg-[#fffaf2] p-4 dark:bg-slate-950'>
                    <div className='h-4 w-full animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-900' />
                    <div className='h-4 w-5/6 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-900' />
                    <div className='h-4 w-2/3 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-900' />
                </div>

                <div className='mt-4 flex flex-col gap-3 border-t border-[#f0e4d3] pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800'>
                    <div className='h-4 w-32 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-950' />

                    <div className='flex items-center justify-end gap-2'>
                        <div className='size-8 animate-pulse rounded-xl bg-[#f2e7d8] dark:bg-slate-950' />
                        <div className='size-8 animate-pulse rounded-xl bg-[#f2e7d8] dark:bg-slate-950' />
                        <div className='size-8 animate-pulse rounded-xl bg-[#f2e7d8] dark:bg-slate-950' />
                    </div>
                </div>
            </article>
        ))}
    </>
);
