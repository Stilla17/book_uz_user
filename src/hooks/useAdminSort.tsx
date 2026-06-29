import { useState } from 'react';

import { ArrowDown, ArrowDownUp, ArrowUp } from 'lucide-react';

export type AdminSortOrder = 'asc' | 'desc';
export type AdminSortKey<Key extends string> = Key | 'default';

type SortConfig<Item, Key extends string> = Record<Key, (item: Item) => string | number>;

type SortAdminItemsOptions<Item, Key extends string> = {
    items: Item[];
    sortConfig: SortConfig<Item, Key>;
    sortKey: AdminSortKey<Key>;
    sortOrder: AdminSortOrder;
};

export const sortAdminItems = <Item, Key extends string>({
    items,
    sortConfig,
    sortKey,
    sortOrder
}: SortAdminItemsOptions<Item, Key>) => {
    const list = [...items];

    if (sortKey === 'default') return list;

    const activeSortKey = sortKey as Key;
    const getValue = sortConfig[activeSortKey];

    return list.sort((a, b) => {
        const first = getValue(a);
        const second = getValue(b);

        if (typeof first === 'number' && typeof second === 'number') {
            return sortOrder === 'asc' ? first - second : second - first;
        }

        return sortOrder === 'asc'
            ? String(first).localeCompare(String(second), 'uz')
            : String(second).localeCompare(String(first), 'uz');
    });
};

export const useAdminSort = <Key extends string>() => {
    const [sortKey, setSortKey] = useState<AdminSortKey<Key>>('default');
    const [sortOrder, setSortOrder] = useState<AdminSortOrder>('asc');

    const handleSort = (key: Key) => {
        if (sortKey === key && sortOrder === 'asc') {
            setSortOrder('desc');
        } else if (sortKey === key && sortOrder === 'desc') {
            setSortKey('default');
            setSortOrder('asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const SortIcon = ({ column }: { column: Key }) => {
        if (sortKey !== column) {
            return <ArrowDownUp size={14} className='text-[#b0a391]' />;
        }

        return sortOrder === 'asc' ? (
            <ArrowUp size={14} className='text-[#ef7f1a]' />
        ) : (
            <ArrowDown size={14} className='text-[#ef7f1a]' />
        );
    };

    return {
        sortKey,
        sortOrder,
        handleSort,
        SortIcon
    };
};
