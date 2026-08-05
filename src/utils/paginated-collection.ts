type FetchAllAndSortByCountOptions<Item, Response> = {
    fetchPage: (page: number, limit: number) => Promise<Response>;
    getItems: (response: Response) => Item[];
    getTotalPages: (response: Response) => number;
    getCount: (item: Item) => number | null | undefined;
    getName: (item: Item) => string;
    fetchLimit?: number;
};

export const fetchAllAndSortByCount = async <Item, Response>({
    fetchPage,
    getItems,
    getTotalPages,
    getCount,
    getName,
    fetchLimit = 100
}: FetchAllAndSortByCountOptions<Item, Response>) => {
    const firstPage = await fetchPage(1, fetchLimit);
    const totalPages = Math.max(1, Number(getTotalPages(firstPage)) || 1);
    const remainingPages =
        totalPages > 1
            ? await Promise.all(
                  Array.from({ length: totalPages - 1 }, (_, index) => fetchPage(index + 2, fetchLimit))
              )
            : [];

    return [firstPage, ...remainingPages]
        .flatMap(getItems)
        .sort((first, second) => {
            const countDifference = Number(getCount(second) || 0) - Number(getCount(first) || 0);

            return countDifference || getName(first).localeCompare(getName(second));
        });
};

export const paginateCollection = <Item>(items: Item[], page: number, perPage: number) => {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const currentPage = Math.min(Math.max(1, page), totalPages);

    return {
        items: items.slice((currentPage - 1) * perPage, currentPage * perPage),
        total,
        totalPages,
        currentPage
    };
};
