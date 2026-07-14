import React, { useMemo, useState } from 'react';

import type { FilterSelectGroup, FilterSelectOption } from '@/types/category.types';

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type MultiFilterSelectProps = {
    label: string;
    value: string[];
    placeholder: string;
    options?: FilterSelectOption[];
    groups?: FilterSelectGroup[];
    onChange: (value: string[]) => void;
    allLabel?: string;
    disabled?: boolean;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    isSearching?: boolean;
};

const getSelectedLabels = (selectedValues: string[], options: FilterSelectOption[], groups: FilterSelectGroup[]) => {
    const labelsByValue = new Map<string, string>();

    groups.forEach((group) => {
        group.options.forEach((option) => labelsByValue.set(option.value, option.label));
    });
    options.forEach((option) => labelsByValue.set(option.value, option.label));

    return selectedValues.map((selectedValue) => labelsByValue.get(selectedValue)).filter(Boolean);
};

const MultiFilterSelect = ({
    label,
    value,
    placeholder,
    options = [],
    groups = [],
    onChange,
    allLabel,
    disabled = false,
    searchValue,
    onSearchChange,
    isSearching = false
}: MultiFilterSelectProps) => {
    const { t } = useTranslation();
    const [internalSearch, setInternalSearch] = useState('');
    const isControlledSearch = Boolean(onSearchChange);
    const search = searchValue ?? internalSearch;
    const selectedLabels = getSelectedLabels(value, options, groups);
    const triggerText =
        selectedLabels.length === 0
            ? value.length > 0
                ? t('catalogPage.selectedCount', { count: value.length })
                : placeholder
            : selectedLabels.length === 1
              ? selectedLabels[0]
              : t('catalogPage.selectedCount', { count: selectedLabels.length });
    const normalizedSearch = search.trim().toLowerCase();

    const visibleGroups = useMemo(() => {
        if (!normalizedSearch || isControlledSearch) return groups;

        return groups
            .map((group) => ({
                ...group,
                options: group.options.filter((option) => option.label.toLowerCase().includes(normalizedSearch))
            }))
            .filter((group) => group.options.length > 0);
    }, [groups, isControlledSearch, normalizedSearch]);

    const visibleOptions = useMemo(() => {
        if (!normalizedSearch || isControlledSearch) return options;

        return options.filter((option) => option.label.toLowerCase().includes(normalizedSearch));
    }, [isControlledSearch, normalizedSearch, options]);

    const handleSearchChange = (nextSearch: string) => {
        if (onSearchChange) {
            onSearchChange(nextSearch);
            return;
        }

        setInternalSearch(nextSearch);
    };

    const toggleValue = (nextValue: string) => {
        if (value.includes(nextValue)) {
            onChange(value.filter((item) => item !== nextValue));
            return;
        }

        onChange([...value, nextValue]);
    };

    return (
        <div>
            <p className='mb-2 text-sm font-medium text-slate-600 dark:text-slate-300'>{label}</p>
            <DropdownMenu>
                <DropdownMenuTrigger
                    disabled={disabled}
                    className='flex h-12 w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 shadow-sm transition-colors outline-none hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900'>
                    <span className={selectedLabels.length ? 'truncate' : 'truncate text-slate-400'}>
                        {triggerText}
                    </span>
                    <ChevronDown className='size-4 shrink-0 opacity-60' />
                </DropdownMenuTrigger>
                <DropdownMenuContent className='max-h-80 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto rounded-2xl p-1'>
                    <button
                        type='button'
                        onClick={() => onChange([])}
                        className='w-full rounded-xl px-2 py-2.5 text-left text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800'>
                        {allLabel ?? t('catalogPage.all')}
                    </button>

                    {(isControlledSearch || options.length > 8 || groups.length > 4) && (
                        <div className='sticky top-0 z-10 bg-white p-1 dark:bg-slate-950'>
                            <input
                                value={search}
                                onChange={(event) => handleSearchChange(event.target.value)}
                                onKeyDown={(event) => event.stopPropagation()}
                                placeholder={t('catalogPage.searchShort')}
                                className='w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#ef7f1a] dark:border-slate-700 dark:bg-slate-900'
                            />
                        </div>
                    )}

                    {isSearching && (
                        <div className='px-3 py-3 text-sm text-slate-400'>{t('catalogPage.searching')}</div>
                    )}

                    {visibleGroups.length > 0 && <DropdownMenuSeparator />}
                    {visibleGroups.map((group) => (
                        <React.Fragment key={group.label}>
                            <DropdownMenuLabel className='text-xs tracking-wide text-slate-400 uppercase'>
                                {group.label}
                            </DropdownMenuLabel>
                            {group.options.map((option) => (
                                <DropdownMenuCheckboxItem
                                    key={option.value}
                                    checked={value.includes(option.value)}
                                    onCheckedChange={() => toggleValue(option.value)}
                                    onSelect={(event) => event.preventDefault()}>
                                    {option.label}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </React.Fragment>
                    ))}

                    {visibleOptions.length > 0 && visibleGroups.length > 0 && <DropdownMenuSeparator />}
                    {visibleOptions.map((option) => (
                        <DropdownMenuCheckboxItem
                            key={option.value}
                            checked={value.includes(option.value)}
                            onCheckedChange={() => toggleValue(option.value)}
                            onSelect={(event) => event.preventDefault()}>
                            {option.label}
                        </DropdownMenuCheckboxItem>
                    ))}

                    {!isSearching && visibleGroups.length === 0 && visibleOptions.length === 0 && (
                        <div className='px-3 py-5 text-center text-sm text-slate-400'>{t('catalogPage.notFound')}</div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default MultiFilterSelect;
