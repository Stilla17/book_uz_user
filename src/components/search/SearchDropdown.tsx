"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Search, 
  X, 
  Loader2, 
  BookOpen, 
  User, 
  Grid3x3,
  ChevronRight
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchSuggestionsQuery } from "@/hooks/queries/useSearchSuggestionsQuery";
import type { SearchDropdownProps, SearchProduct } from "@/types/search.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.book.uz/user-api/';
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887";

const getImageUrl = (image?: string) => {
  if (!image) return FALLBACK_IMAGE;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;

  return `${API_BASE_URL.replace(/\/$/, '')}/${image.replace(/^\//, '')}`;
};

export const SearchDropdown = ({ searchQuery, setSearchQuery, onClose }: SearchDropdownProps) => {
  const router = useRouter();
  const [showResults, setShowResults] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(searchQuery, 500);
  const { data: results, isFetching: loading } = useSearchSuggestionsQuery(debouncedQuery);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [debouncedQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      if (onClose) onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleItemClick = () => {
    setShowResults(false);
    if (onClose) onClose();
  };

  const getProductTitle = (product: SearchProduct): string => {
    return product.title.uz || product.title.ru || product.title.en || "Noma'lum";
  };

  if (!showResults || (debouncedQuery.length < 2)) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
    >
      {loading ? (
        <div className="p-8 text-center">
          <Loader2 size={24} className="animate-spin mx-auto text-[#005CB9] mb-2" />
          <p className="text-sm text-gray-500">Qidirilmoqda...</p>
        </div>
      ) : (results?.totalCount ?? 0) > 0 ? (
        <div className="max-h-[80vh] overflow-y-auto">
          {/* Products */}
          {(results?.products?.length ?? 0) > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Kitoblar</h3>
              <div className="space-y-2">
                {results!.products.map((product) => (
                  <Link
                    key={product._id}
                    href={`/book/${product.slug}`}
                    onClick={handleItemClick}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="relative w-10 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={getImageUrl(product.images?.[0])}
                        alt={getProductTitle(product)}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-[#005CB9] truncate">
                        {getProductTitle(product)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.price.toLocaleString()} so'm
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {(results?.categories?.length ?? 0) > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Kategoriyalar</h3>
              <div className="space-y-2">
                {results!.categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/category/${category.slug}`}
                    onClick={handleItemClick}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#005CB9]/10 to-[#FF8A00]/10 flex items-center justify-center">
                      <Grid3x3 size={14} className="text-[#005CB9]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-[#005CB9]">
                        {category.title.uz}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Authors */}
          {(results?.authors?.length ?? 0) > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Mualliflar</h3>
              <div className="space-y-2">
                {results!.authors.map((author) => (
                  <Link
                    key={author._id}
                    href={`/author/${author.slug}`}
                    onClick={handleItemClick}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#005CB9]/10 to-[#FF8A00]/10 flex items-center justify-center">
                      <User size={14} className="text-[#005CB9]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-[#005CB9]">
                        {author.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* View all results */}
          <div className="p-4 bg-gradient-to-r from-[#005CB9]/5 to-[#FF8A00]/5">
            <button
              type="button"
              onClick={handleSearch}
              className="w-full flex items-center justify-between text-sm font-bold text-[#005CB9] hover:text-[#FF8A00] transition-colors"
            >
              <span>Barcha natijalar ({results?.totalCount ?? 0})</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500 mb-2">Hech narsa topilmadi</p>
          <p className="text-xs text-gray-400">"{debouncedQuery}" bo'yicha hech qanday natija yo'q</p>
        </div>
      )}
    </div>
  );
};
