'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { BookOpen } from 'lucide-react';

interface BookCoverProps {
    src?: string | null;
    alt: string;
    className?: string;
    fallbackClassName?: string;
    fill?: boolean;
    sizes?: string;
    iconSize?: number;
    priority?: boolean;
}

export const BookCover = ({
    src,
    alt,
    className = 'size-full object-contain',
    fallbackClassName = '',
    fill = false,
    sizes,
    iconSize = 40,
    priority = false
}: BookCoverProps) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [src]);

    if (!src || hasError) {
        return (
            <div
                role='img'
                aria-label={alt}
                className={`flex size-full items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-500 ${fallbackClassName}`}>
                <BookOpen size={iconSize} strokeWidth={1.5} aria-hidden='true' />
            </div>
        );
    }

    if (fill) {
        return (
            <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                priority={priority}
                className={className}
                onError={() => setHasError(true)}
            />
        );
    }

    return <img src={src} alt={alt} className={className} onError={() => setHasError(true)} />;
};
