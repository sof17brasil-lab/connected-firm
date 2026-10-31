import { TextRevealByWord } from '@/components/ui/text-reveal'
import { THESIS } from '@/lib/data'

/**
 * The one use of text-reveal on the site: the thesis line, lit word by word.
 */
export function Thesis() {
  return (
    <div>
      <TextRevealByWord text={THESIS} />
    </div>
  )
}
