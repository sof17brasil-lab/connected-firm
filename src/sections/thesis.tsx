import { TextRevealByWord } from '@/components/ui/text-reveal'
import { Reveal } from '@/components/site/reveal'
import { Band, Rule } from '@/components/site/section'
import { THESIS, THESIS_SECOND } from '@/lib/data'

/**
 * The one use of text-reveal on the site: the thesis line, lit word by word,
 * followed by the plain statement of what the role would look like day to day.
 */
export function Thesis() {
  return (
    <div className="bg-ivory">
      <TextRevealByWord text={THESIS} />

      <Band className="pb-24 md:pb-32">
        <Rule className="mb-12" />
        <Reveal>
          <p className="measure ml-auto text-lg text-slate md:text-xl">{THESIS_SECOND}</p>
        </Reveal>
      </Band>
    </div>
  )
}
