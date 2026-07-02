import { motion } from 'framer-motion';
import { Grid3X3, Layers3 } from 'lucide-react';

export type CatalogViewMode = 'grid' | 'list';

type PanelResultsProps = {
    total: number;
    viewMode: CatalogViewMode;
    onViewModeChange: (viewMode: CatalogViewMode) => void;
};

const viewModeOptions: { value: CatalogViewMode; label: string; icon: typeof Grid3X3 }[] = [
    { value: 'grid', label: 'Grid korinish', icon: Grid3X3 },
    { value: 'list', label: 'List korinish', icon: Layers3 }
];

const PanelResults = ({ total, viewMode, onViewModeChange }: PanelResultsProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className='space-y-4'>
            <div className='rounded-2xl border border-white/70 bg-white/85 p-4 shadow-[0_24px_80px_-46px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:rounded-[1.75rem] sm:p-5 dark:border-slate-700/70 dark:bg-slate-900/80'>
                <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                    <div>
                        <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>Natijalar paneli</p>
                        <h2 className='text-2xl text-slate-900 dark:text-white'>{total} ta kitob topildi</h2>
                    </div>

                    <div className='inline-flex w-full items-center rounded-[1.5rem] bg-slate-950/95 p-1 shadow-[0_16px_36px_-24px_rgba(15,23,42,0.8)] sm:w-max dark:bg-slate-950'>
                        {viewModeOptions.map((option) => {
                            const Icon = option.icon;
                            const isActive = viewMode === option.value;

                            return (
                                <button
                                    key={option.value}
                                    type='button'
                                    aria-label={option.label}
                                    title={option.label}
                                    aria-pressed={isActive}
                                    onClick={() => onViewModeChange(option.value)}
                                    className={`grid h-10 w-10 place-items-center rounded-[1.15rem] transition-all ${
                                        isActive
                                            ? 'bg-white text-[#ef7f1a] shadow-sm dark:bg-slate-800 dark:text-orange-300'
                                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                    }`}>
                                    <Icon size={17} strokeWidth={2.25} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PanelResults;
