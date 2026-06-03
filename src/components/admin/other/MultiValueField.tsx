import { useState } from 'react';

import type { SearchableOption } from './SearchableSelect';
import { Search, X } from 'lucide-react';

const MultiValueField = ({
    values,
    options,
    name,
    placeholder,
    disabled,
    onChange
}: {
    values: string[];
    options: SearchableOption[];
    name: string;
    placeholder: string;
    disabled?: boolean;
    onChange: (values: string[]) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const uniqueValues = values.filter((value, index, currentValues) => currentValues.indexOf(value) === index);
    const uniqueOptions = options.filter(
        (option, index, currentOptions) =>
            currentOptions.findIndex((currentOption) => currentOption.value === option.value) === index
    );
    const selectedOptions = uniqueValues
        .map((value) => uniqueOptions.find((option) => option.value === value))
        .filter(Boolean) as SearchableOption[];
    const normalizedQuery = query.trim().toLowerCase();
    const filteredOptions = uniqueOptions.filter(
        (option) => !uniqueValues.includes(option.value) && option.label.toLowerCase().includes(normalizedQuery)
    );

    const removeValue = (value: string) => {
        onChange(values.filter((currentValue) => currentValue !== value));
    };

    return (
        <div className='relative'>
            {uniqueValues.map((value) => (
                <input key={value} type='hidden' name={name} value={value} />
            ))}

            <div
                className={`min-h-12 w-full rounded-2xl border border-[#eadfce] bg-white px-3 py-2 shadow-sm transition dark:border-slate-800 dark:bg-slate-900 ${
                    disabled ? 'cursor-not-allowed opacity-60' : ''
                }`}>
                <div className='flex flex-wrap items-center gap-2'>
                    {selectedOptions.map((option) => (
                        <span
                            key={option.value}
                            className='inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#e7e5e4] px-3 py-1.5 text-sm font-semibold text-[#2f2a25] dark:bg-slate-800 dark:text-white'>
                            <span className='truncate'>{option.label}</span>
                            <button
                                type='button'
                                onClick={() => removeValue(option.value)}
                                className='grid size-5 shrink-0 place-items-center rounded-full bg-[#b8b5b2] text-white transition hover:bg-red-500'
                                aria-label={`${option.label} ni olib tashlash`}>
                                <X size={13} />
                            </button>
                        </span>
                    ))}

                    <div className='flex min-w-32 flex-1 items-center gap-2'>
                        <input
                            value={query}
                            disabled={disabled}
                            onFocus={() => setIsOpen(true)}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setIsOpen(true);
                            }}
                            placeholder={placeholder}
                            className='h-8 min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#2f2a25] outline-none placeholder:text-[#b8afa4] disabled:cursor-not-allowed dark:text-white dark:placeholder:text-slate-500'
                        />
                        <Search size={16} className='shrink-0 text-[#9d907e]' />
                    </div>
                </div>
            </div>

            {isOpen && !disabled ? (
                <div className='absolute top-full right-0 left-0 z-40 mt-2 rounded-2xl border border-[#eadfce] bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-950'>
                    <div className='no-scrollbar max-h-56 overflow-y-auto'>
                        {filteredOptions.length ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type='button'
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => {
                                        onChange([...uniqueValues, option.value]);
                                        setQuery('');
                                        setIsOpen(false);
                                    }}
                                    className='block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#2f2a25] transition hover:bg-[#f2e7d8] dark:text-white dark:hover:bg-slate-900'>
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

export default MultiValueField;
