'use client'

import type * as React from 'react'
import { cn } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface XScrollProps extends React.ComponentProps<typeof ScrollArea> {}

/**
 * Horizontal scroller for content too wide for a phone: stat card rows, the
 * roadmap and the wide tables. `w-1 flex-1` is the flexbox trick that stops the
 * content forcing the container wider than its parent.
 */
export default function XScroll({ children, className, ...props }: XScrollProps) {
  return (
    <div className="flex">
      <ScrollArea className={cn('w-1 flex-1', className)} {...props}>
        {children}
        <ScrollBar orientation="horizontal" className="[&>div]:bg-stone" />
      </ScrollArea>
    </div>
  )
}
