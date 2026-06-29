import React, { useState } from 'react';

import { Input } from '@/components/ui/input';

import { Search } from 'lucide-react';

export type SearchableOption = {
    value: string;
    label: string;
};

const SearchableSelect = ({
    value,
    options,
    placeholder,
    name,
    disabled,
    onChange
}: {
    value: string;
    options: SearchableOption[];
    placeholder: string;
    name: string;
    disabled?: boolean;
    onChange: (value: string) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const selectedOption = options.find((option) => option.value === value);
    const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()));

    return (
        <div className={`relative w-full max-w-full min-w-0 ${isOpen ? 'z-[100]' : ''}`}>
            <input type='hidden' name={name} value={value} />
            <button
                type='button'
                disabled={disabled}
                onClick={() => setIsOpen((current) => !current)}
                className='flex h-12 w-full max-w-full min-w-0 items-center justify-between gap-3 overflow-hidden rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-left text-sm font-semibold text-[#2f2a25] shadow-sm disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900 dark:text-white'>
                <span className={selectedOption ? 'min-w-0 flex-1 truncate' : 'min-w-0 flex-1 truncate text-[#9d907e]'}>
                    {selectedOption?.label ?? placeholder}
                </span>
                <Search size={16} className='shrink-0 text-[#9d907e]' />
            </button>

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
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type='button'
                                    onClick={() => {
                                        onChange(option.value);
                                        setQuery('');
                                        setIsOpen(false);
                                    }}
                                    className={`block w-full truncate rounded-xl px-3 py-2 text-left text-sm font-semibold transition hover:bg-[#f2e7d8] dark:hover:bg-slate-900 ${
                                        option.value === value
                                            ? 'bg-[#ef7f1a] text-white hover:bg-[#ef7f1a]'
                                            : 'text-[#2f2a25] dark:text-white'
                                    }`}>
                                    {option.label}
                                </button>
                            ))
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

export default SearchableSelect;
