import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SmoothScroll from '@/components/ui/smooth-scroll'
import { ReadingProgress } from '@/components/site/reading-progress'
import { PageBackground } from '@/components/site/page-background'
import { InvertProvider } from '@/components/site/invert-zone'
import { Loader } from '@/components/site/loader'
import { SiteNav } from '@/components/site/nav'
import { DotNav } from '@/components/site/dot-nav'
import { CardCounter, CardCounterProvider } from '@/components/site/card-counter'
import { SiteFooter } from '@/components/site/footer'
import Home from '@/pages/Home'

/**
 * Only the home page is in the first download. The reference pages behind
 * it — and the charting library three of them lean on — arrive when they
 * are asked for, which is what keeps the opening screen quick on a phone.
 */
const SourcesPage = lazy(() => import('@/pages/Sources'))
const CultureExtras = lazy(() => import('@/pages/CultureExtras'))
const TheNumbers = lazy(() => import('@/pages/TheNumbers'))
const Methodology = lazy(() => import('@/pages/Methodology'))

export default function App() {
  return (
    // BASE_URL keeps routing correct under the /connected-firm/ Pages path.
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <SmoothScroll>
        <CardCounterProvider>
          <InvertProvider>
          <PageBackground />
          <Loader />
          <ReadingProgress />
          <SiteNav />
          <DotNav />
          <main>
            {/* A blank screen rather than a spinner: the pages arrive in a
                few hundred milliseconds and a flashing spinner reads worse
                than nothing at that length. */}
            <Suspense fallback={<div className="min-h-screen" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/the-numbers" element={<TheNumbers />} />
                <Route path="/culture-extras" element={<CultureExtras />} />
                <Route path="/methodology" element={<Methodology />} />
                <Route path="/sources" element={<SourcesPage />} />
              </Routes>
            </Suspense>
          </main>
          <CardCounter />
          <SiteFooter />
          </InvertProvider>
        </CardCounterProvider>
      </SmoothScroll>
    </BrowserRouter>
  )
}
