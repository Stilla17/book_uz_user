import React from 'react';

import Link from 'next/link';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const BreadCrumb = ({ items }: BreadcrumbProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
            <Link href='/' className='hover:text-blue-600 dark:hover:text-blue-400'>
                Bosh sahifa
            </Link>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <React.Fragment key={index}>
                        <ChevronRight size={16} className='flex-shrink-0' />
                        {isLast || !item.path ? (
                            <span className='truncate font-medium text-gray-900 dark:text-white'>{item.label}</span>
                        ) : (
                            <Link
                                href={item.path}
                                className='whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400'>
                                {item.label}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </motion.div>
    );
};

export default BreadCrumb;
