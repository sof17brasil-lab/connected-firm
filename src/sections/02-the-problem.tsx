import { StatCard } from '@/components/charts/stat-card'
import { ArcChart, OutlineBars, UnitCircles } from '@/components/charts/outline/charts'
import { Footnote } from '@/components/site/footnote'
import { Reveal } from '@/components/site/reveal'
import { SourcePill } from '@/components/site/source-pill'
import { Band, Eyebrow, Finding, Rule, WhatThisMeans } from '@/components/site/section'
import { RESEARCH_PARTNERS, RESEARCH_PEOPLE } from '@/lib/data'

/** The research not told as a card, set as a findings list. */
const LIST = [
  { label: 'Integration', figure: 'Best predictor', from: RESEARCH_PARTNERS[2] },
  { label: 'Nobody is measuring', figure: '85%', from: RESEARCH_PARTNERS[3] },
  { label: 'Friendship and retention', figure: '37% vs 49%', from: RESEARCH_PEOPLE[1] },
  { label: 'Small budgets, real effect', figure: '4-5 points', from: RESEARCH_PEOPLE[3] },
  { label: 'Replacing an associate', figure: '$200K-$500K', from: RESEARCH_PEOPLE[4] },
  { label: 'Associate attrition', figure: '~20%', from: RESEARCH_PEOPLE[5] },
  { label: 'What actually keeps people', figure: '9.4%', from: RESEARCH_PEOPLE[6] },
]

export function TheProblem() {
  const lateral = RESEARCH_PARTNERS[0]
  const cost = RESEARCH_PARTNERS[1]
  const lonely = RESEARCH_PEOPLE[0]
  const belonging = RESEARCH_PEOPLE[2]

  return (
    <Band id="the-problem" className="py-28 md:py-40">
      <Reveal>
        <Eyebrow>02 — The problem</Eyebrow>
      </Reveal>
      <Rule className="mt-6 mb-16" />

      <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[1.25fr_1fr]">
        <Reveal>
          <h2 className="text-h2 text-navy">
            Lateral partners leave, and people who feel alone leave with them.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="measure self-end text-lg text-slate">
            None of this is specific to White &amp; Case. It is what the published research
            says about law firms generally, which is why it is worth planning around.
          </p>
        </Reveal>
      </div>

      <Reveal className="mt-20">
        <StatCard
          figure="30-38%"
          connector="of"
          subject="lateral partners"
          body="leave within five years of joining."
          caveat={lateral.caveat}
          sources={lateral.sources}
          chart={(animate) => (
            <UnitCircles animate={animate} filled={3.4} total={10} display="~1 in 3" />
          )}
        />
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <Reveal>
          <StatCard
            figure="$4.04M"
            subject="per failed hire"
            body="The cost of one failed lateral partner at an Am Law 50 firm."
            caveat={cost.caveat}
            sources={cost.sources}
            chart={(animate) => (
              <OutlineBars
                animate={animate}
                max={5}
                data={[
                  { label: 'one failed partner', value: 4.0392, display: '$4.04M', highlight: true },
                  { label: 'one associate (high)', value: 0.5, display: '$500K' },
                ]}
              />
            )}
          />
        </Reveal>

        <Reveal delay={0.08}>
          <StatCard
            figure="61%"
            connector="of"
            subject="lawyers"
            body="scored above average on the UCLA loneliness scale — the highest of any profession studied."
            sources={lonely.sources}
            chart={(animate) => <ArcChart animate={animate} pct={61} display="61%" />}
          />
        </Reveal>
      </div>

      <Reveal className="mt-10">
        <StatCard
          figure="18% vs 61%"
          subject="considered quitting"
          body="Workers satisfied with their sense of belonging, against those who were not."
          caveat={belonging.caveat}
          sources={belonging.sources}
          chart={(animate) => (
            <OutlineBars
              animate={animate}
              max={70}
              data={[
                { label: 'feels they belong', value: 18, display: '18%', highlight: true },
                { label: 'does not', value: 61, display: '61%' },
              ]}
            />
          )}
        />
      </Reveal>

      {/* Everything else, as a quiet findings list rather than more cards. */}
      <div className="mt-28 grid gap-x-20 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <h3 className="font-display text-[clamp(1.7rem,2.4vw,2.3rem)] leading-tight text-navy">
              The rest of the evidence
            </h3>
            <p className="measure mt-5 text-slate">
              Drawn from <SourcePill id={6} label="Above the Law" />
              <SourcePill id={13} label="RFBerlin" /> and six other published sources.
            </p>
          </Reveal>
        </div>

        <div>
          {LIST.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.04}>
              <Finding label={item.label} figure={item.figure}>
                {item.from.body}
                <Footnote ids={item.from.sources} className="ml-1" />
                {item.from.caveat && (
                  <span className="text-caption mt-2 block text-muted-ink">{item.from.caveat}</span>
                )}
              </Finding>
            </Reveal>
          ))}
        </div>
      </div>

      <Rule className="mt-24 mb-12" />
      <WhatThisMeans>
        the expensive problem is not hiring. It is what happens in the eighteen months after
        someone arrives.
      </WhatThisMeans>
    </Band>
  )
}
