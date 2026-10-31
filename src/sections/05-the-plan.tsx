import { ProgramRun } from '@/components/ui/animated-scroll'
import { PILOT_TOTAL_LABEL, PROGRAMS } from '@/lib/data'

/**
 * Section 3 on the page. The run carries its own heading and closing copy,
 * because both are part of the same pinned move.
 */
export function ThePlan() {
  return (
    <section id="the-plan" className="relative scroll-mt-4">
      <ProgramRun
        programs={PROGRAMS}
        label="03 — The plan"
        heading="Four small programs, one year, New York."
        subheading={`A pilot, not a department: ${PILOT_TOTAL_LABEL} for the year.`}
        closing={[
          [
            'Each program is optional, short, and cheap enough',
            'to stop without anybody having to defend the decision.',
          ],
          [
            'The whole year costs less than one failed hire,',
            'and every part of it can be stopped without drama.',
          ],
        ]}
      />
    </section>
  )
}
