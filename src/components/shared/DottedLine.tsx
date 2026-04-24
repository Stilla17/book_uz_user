import React from 'react';

type Dotteds = {
    label: string;
    value?: string;
};

const DottedLine = ({ label, value }: Dotteds) => {
    return (
        <div className='flex items-center gap-3 text-sm md:text-base mt-4'>
            <span className='shrink-0 text-gray-500 dark:text-gray-400'>{label}</span>
            <span className='flex-1 border-b border-dotted border-gray-300 dark:border-gray-600' />
            <span className='shrink-0 font-medium text-gray-900 dark:text-white'>{value}</span>
        </div>
    );
};

export default DottedLine;
