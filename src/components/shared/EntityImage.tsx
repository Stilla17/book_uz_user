'use client';

import { useEffect, useState } from 'react';

import { getImageUrl, type ImageValue } from '@/utils/image';

import { BookOpen, Building2, UserRound } from 'lucide-react';

type EntityImageProps = {
    src?: ImageValue;
    alt: string;
    type: 'author' | 'publisher' | 'book';
    className?: string;
    imageClassName?: string;
    iconClassName?: string;
};

const EntityImage = ({
    src,
    alt,
    type,
    className = '',
    imageClassName = '',
    iconClassName = ''
}: EntityImageProps) => {
    const imageUrl = getImageUrl(src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [imageUrl]);

    const showFallback = !imageUrl || hasError;
    const Icon = type === 'author' ? UserRound : type === 'publisher' ? Building2 : BookOpen;

    return (
        <div
            className={`flex items-center justify-center overflow-hidden bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 ${className}`}
            role={showFallback ? 'img' : undefined}
            aria-label={showFallback ? alt : undefined}>
            {showFallback ? (
                <Icon aria-hidden='true' className={iconClassName} />
            ) : (
                <img
                    src={imageUrl}
                    alt={alt}
                    loading='lazy'
                    decoding='async'
                    className={imageClassName}
                    onError={() => setHasError(true)}
                />
            )}
        </div>
    );
};

export default EntityImage;
