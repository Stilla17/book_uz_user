import React from 'react';

import { FilterSelectProps } from '@/types/category.types';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue
} from '../ui/select';

const FilterSelect = ({
    label,
    value,
    placeholder,
    options = [],
    groups = [],
    onChange,
    allLabel = 'Barchasi',
    disabled = false
}: FilterSelectProps) => {
    return (
        <div>
            <p className='mb-2 text-sm font-medium text-slate-600 dark:text-slate-300'>{label}</p>
            <Select
                value={value || 'all'}
                onValueChange={(nextValue) => onChange(nextValue === 'all' ? '' : nextValue)}
                disabled={disabled}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='all'>{allLabel}</SelectItem>
                    {groups.length > 0 && <SelectSeparator />}
                    {groups.map((group) => (
                        <SelectGroup key={group.label}>
                            <SelectLabel className='text-xs uppercase tracking-wide text-slate-400'>
                                {group.label}
                            </SelectLabel>
                            {group.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    ))}
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default FilterSelect;
