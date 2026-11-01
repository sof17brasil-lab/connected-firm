import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInverted } from '@/components/site/invert-zone'
import { cn } from '@/lib/utils'

interface CounterState {
  total: number
  current: number
  register: () => number
  setCurrent: (index: number) => void
}

const CardCounterContext = createContext<CounterState | null>(null)

/**
 * Tracks the numbered data cards across the whole page so the fixed counter
 * can read "03 / 08". Cards register themselves on mount, which keeps the
 * total honest as sections are added.
 */
export function CardCounterProvider({ children }: { children: React.ReactNode }) {
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)

  const register = useCallback(() => {
    let index = 0
    setTotal((n) => {
      index = n + 1
      return index
    })
    return index
  }, [])

  const value = useMemo(
    () => ({ total, current, register, setCurrent }),
    [total, current, register],
  )

  return <CardCounterContext.Provider value={value}>{children}</CardCounterContext.Provider>
}

export function useCardCounter() {
  return useContext(CardCounterContext)
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Fixed bottom-centre HUD: the card counter and a link to the sources. */
export function CardCounter() {
  const counter = useCardCounter()
  const on = useInverted() > 0.5
  if (!counter || counter.total === 0) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center">
      <div
        className={cn(
          'pointer-events-auto flex items-center gap-1 rounded-full p-1 shadow-sm backdrop-blur-sm transition-colors',
          on ? 'bg-navy/80' : 'bg-ivory/85',
        )}
      >
        <span className={cn('eyebrow tabular px-3', on ? 'text-ivory/70' : 'text-muted-ink')}>
          {pad(counter.current)} <span className={on ? 'text-ivory/35' : 'text-stone'}>/</span>{' '}
          {pad(counter.total)}
        </span>
        <Link
          to="/sources"
          className={cn(
            'eyebrow rounded-full px-4 py-2 shadow-sm transition-colors hover:bg-sky',
            on ? 'bg-ivory text-navy' : 'bg-ivory text-navy',
          )}
        >
          All sources
        </Link>
      </div>
    </div>
  )
}
