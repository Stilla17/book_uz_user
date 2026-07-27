import React, { useState } from 'react';

import { Input } from '@/components/ui/input';

import type { SearchableOption } from './SearchableSelect';
import { Check, Search, X } from 'lucide-react';

type MultiSearchableSelectProps = {
    value: string[];
    options: SearchableOption[];
    placeholder: string;
    name: string;
    selectedLabel?: string;
    itemLabel?: string;
    disabled?: boolean;
    onChange: (value: string[]) => void;
};

const MultiSearchableSelect = ({
    value,
    options,
    placeholder,
    name,
    selectedLabel = 'muallif',
    itemLabel = 'muallif',
    disabled,
    onChange
}: MultiSearchableSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const selectedOptions = value
        .map((selectedValue) => options.find((option) => option.value === selectedValue))
        .filter((option): option is SearchableOption => Boolean(option));
    const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()));

    const toggleOption = (optionValue: string) => {
        onChange(
            value.includes(optionValue)
                ? value.filter((selectedValue) => selectedValue !== optionValue)
                : [...value, optionValue]
        );
    };

    return (
        <div className={`relative w-full max-w-full min-w-0 ${isOpen ? 'z-[100]' : ''}`}>
            {value.map((selectedValue) => (
                <input key={selectedValue} type='hidden' name={name} value={selectedValue} />
            ))}

            <button
                type='button'
                disabled={disabled}
                onClick={() => setIsOpen((current) => !current)}
                className='flex min-h-12 w-full max-w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-[#eadfce] bg-white px-4 py-2.5 text-left text-sm font-semibold text-[#2f2a25] shadow-sm disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-white'>
                <span className={selectedOptions.length ? 'min-w-0 flex-1' : 'min-w-0 flex-1 truncate text-[#9d907e]'}>
                    {selectedOptions.length ? `${selectedOptions.length} ta ${selectedLabel} tanlandi` : placeholder}
                </span>
                <Search size={16} className='shrink-0 text-[#9d907e]' />
            </button>

            {selectedOptions.length ? (
                <div className='mt-2 flex flex-wrap gap-2'>
                    {selectedOptions.map((option) => (
                        <span
                            key={option.value}
                            className='inline-flex max-w-full items-center gap-1.5 rounded-xl bg-[#f2e7d8] px-2.5 py-1.5 text-xs font-semibold text-[#2f2a25] dark:bg-slate-800 dark:text-white'>
                            <span className='truncate'>{option.label}</span>
                            <button
                                type='button'
                                onClick={() => toggleOption(option.value)}
                                aria-label={`${option.label} ${itemLabel}ini olib tashlash`}
                                className='shrink-0 rounded-md p-0.5 transition hover:bg-black/10 dark:hover:bg-white/10'>
                                <X size={13} />
                            </button>
                        </span>
                    ))}
                </div>
            ) : null}

            {isOpen ? (
                <div className='absolute top-full right-0 left-0 z-[9999] mt-2 max-w-full overflow-hidden rounded-2xl border border-[#eadfce] bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-950'>
                    <Input
                        autoFocus
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder='Qidirish...'
                        className='h-10 rounded-xl border-[#eadfce] bg-[#fffaf2] text-sm font-semibold dark:border-slate-800 dark:bg-slate-900'
                    />

                    <div className='no-scrollbar mt-2 max-h-56 overflow-y-auto'>
                        {filteredOptions.length ? (
                            filteredOptions.map((option) => {
                                const isSelected = value.includes(option.value);

                                return (
                                    <button
                                        key={option.value}
                                        type='button'
                                        onClick={() => toggleOption(option.value)}
                                        className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold transition hover:bg-[#f2e7d8] dark:hover:bg-slate-900 ${
                                            isSelected
                                                ? 'bg-[#ef7f1a] text-white hover:bg-[#ef7f1a]'
                                                : 'text-[#2f2a25] dark:text-white'
                                        }`}>
                                        <span className='truncate'>{option.label}</span>
                                        {isSelected ? <Check size={16} className='shrink-0' /> : null}
                                    </button>
                                );
                            })
                        ) : (
                            <p className='px-3 py-4 text-center text-sm font-semibold text-[#9d907e]'>
                                Natija topilmadi
                            </p>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default MultiSearchableSelect;
