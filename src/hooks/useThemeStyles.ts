"use client";

import { useTheme } from '@/context/ThemeContext';

export const useThemeStyles = () => {
  const { isDark, colors } = useTheme();

  const getBgColor = (type: 'default' | 'card' | 'muted' | 'primary' = 'default') => {
    switch(type) {
      case 'card': return isDark ? 'bg-slate-900' : 'bg-white';
      case 'muted': return isDark ? 'bg-slate-800' : 'bg-gray-50';
      case 'primary': return isDark ? 'bg-blue-600' : 'bg-[#005CB9]';
      default: return isDark ? 'bg-slate-900' : 'bg-white';
    }
  };

  const getTextColor = (type: 'default' | 'muted' | 'primary' = 'default') => {
    switch(type) {
      case 'muted': return isDark ? 'text-slate-400' : 'text-gray-500';
      case 'primary': return isDark ? 'text-blue-400' : 'text-[#005CB9]';
      default: return isDark ? 'text-white' : 'text-gray-900';
    }
  };

  const getBorderColor = () => {
    return isDark ? 'border-slate-700' : 'border-gray-200';
  };

  const gradientFrom = isDark ? 'from-blue-600/20' : 'from-[#005CB9]/10';
  const gradientTo = isDark ? 'to-orange-600/20' : 'to-[#FF8A00]/10';
  const gradientBlue = isDark ? 'from-blue-600 to-blue-500' : 'from-[#005CB9] to-blue-500';
  const gradientOrange = isDark ? 'from-orange-600 to-orange-500' : 'from-[#FF8A00] to-orange-500';
  const gradientBlueOrange = isDark 
    ? 'from-blue-600 to-orange-600' 
    : 'from-[#005CB9] to-[#FF8A00]';

  return {
    isDark,
    colors,
    getBgColor,
    getTextColor,
    getBorderColor,
    gradientFrom,
    gradientTo,
    gradientBlue,
    gradientOrange,
    gradientBlueOrange,
  };
};