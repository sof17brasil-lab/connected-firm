import { useEffect, useState } from 'react'

/**
 * Tracks `prefers-reduced-motion`, including later changes to the setting.
 *
 * Starts at `true` on the very first render so that no animation can begin
 * before we know the user's preference.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return reduced
}
