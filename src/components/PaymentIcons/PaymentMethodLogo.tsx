const PaymentMethodLogo = ({ name }: { name: string }) => {
    switch (name) {
        case 'Uzcard':
            return (
                <div className='flex h-7 w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#26c281] to-[#0ea5e9] px-3 text-[10px] font-black tracking-[0.08em] text-white uppercase'>
                    Uzcard
                </div>
            );

        case 'Click':
            return (
                <div className='flex h-7 w-full items-center justify-center gap-1 rounded-lg bg-[#7c3aed] px-3 text-[10px] font-black text-white'>
                    <span className='flex h-4 w-4 items-center justify-center rounded-full border border-white/70'>
                        <span className='h-1.5 w-1.5 rounded-full bg-white' />
                    </span>
                    <span>click</span>
                </div>
            );

        case 'Payme':
            return (
                <div className='flex h-7 w-full items-center justify-center gap-1 rounded-lg bg-[#2557ff] px-3 text-[10px] font-black text-white'>
                    <span className='flex h-4 w-4 items-center justify-center rounded-full border border-white/80'>
                        <span className='h-2 w-2 rounded-full bg-white' />
                    </span>
                    <span>payme</span>
                </div>
            );

        case 'Humo':
            return (
                <div className='flex h-7 w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-[10px] font-black text-slate-700 uppercase'>
                    <span className='rounded bg-[#f3f4f6] px-1.5 py-0.5 tracking-[0.08em]'>Humo</span>
                </div>
            );

        case 'Visa':
            return (
                <div className='flex h-7 w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-[12px] font-black italic text-[#1a4fff] uppercase'>
                    Visa
                </div>
            );

        case 'Mastercard':
            return (
                <div className='flex h-7 w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-3'>
                    <div className='relative h-4 w-8'>
                        <span className='absolute left-0 top-0 h-4 w-4 rounded-full bg-[#ea001b] opacity-95' />
                        <span className='absolute right-0 top-0 h-4 w-4 rounded-full bg-[#f79e1b] opacity-95' />
                    </div>
                </div>
            );

        default:
            return <span className='text-xs font-bold text-slate-700'>{name}</span>;
    }
}

export default PaymentMethodLogo;