'use client'

import * as React from 'react'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer flex size-5 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white shadow-sm outline-none transition-all focus-visible:ring-4 focus-visible:ring-[#00a0e3]/20 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-[#00a0e3] data-[state=checked]:bg-[#00a0e3] dark:border-slate-600 dark:bg-slate-950 dark:data-[state=checked]:border-[#ef7f1a] dark:data-[state=checked]:bg-[#ef7f1a]',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="text-white"
      >
        <Check className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
