"use client";

import { useThemeStyles } from "@/hooks/useThemeStyles";

export const BookCardSkeleton = () => {
  const { getBgColor, getBorderColor } = useThemeStyles();

  return (
    <div className={`${getBgColor('card')} p-3 rounded-xl ${getBorderColor()} flex flex-col h-full`}>
      {/* Image Skeleton */}
      <div className={`relative h-[230px] w-full mb-3 overflow-hidden rounded-lg ${getBgColor('muted')} animate-pulse`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-600 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Content Skeletons */}
      <div className="space-y-3">
        {/* Title skeleton - 2 lines */}
        <div className="space-y-2">
          <div className={`h-4 ${getBgColor('muted')} rounded animate-pulse w-full`} />
          <div className={`h-4 ${getBgColor('muted')} rounded animate-pulse w-3/4`} />
        </div>

        {/* Author skeleton */}
        <div className={`h-3 ${getBgColor('muted')} rounded animate-pulse w-1/2`} />

        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          <div className={`h-4 ${getBgColor('muted')} rounded animate-pulse w-24`} />
          <div className={`h-4 ${getBgColor('muted')} rounded animate-pulse w-12`} />
        </div>

        {/* Price skeleton */}
        <div className={`pt-3 border-t ${getBorderColor()}`}>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className={`h-3 ${getBgColor('muted')} rounded animate-pulse w-16`} />
              <div className={`h-6 ${getBgColor('muted')} rounded animate-pulse w-24`} />
            </div>
            <div className={`h-10 w-10 ${getBgColor('muted')} rounded-xl animate-pulse`} />
          </div>
        </div>
      </div>
    </div>
  );
};