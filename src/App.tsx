import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SmoothScroll from '@/components/ui/smooth-scroll'
import { ReadingProgress } from '@/components/site/reading-progress'
import { PageBackground } from '@/components/site/page-background'
import { Loader } from '@/components/site/loader'
import { SiteNav } from '@/components/site/nav'
import { DotNav } from '@/components/site/dot-nav'
import { CardCounter, CardCounterProvider } from '@/components/site/card-counter'
import { SiteFooter } from '@/components/site/footer'
import Home from '@/pages/Home'
import SourcesPage from '@/pages/Sources'
import CultureExtras from '@/pages/CultureExtras'
import TheNumbers from '@/pages/TheNumbers'
import Methodology from '@/pages/Methodology'

export default function App() {
  return (
    // BASE_URL keeps routing correct under the /connected-firm/ Pages path.
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <SmoothScroll>
        <CardCounterProvider>
          <PageBackground />
          <Loader />
          <ReadingProgress />
          <SiteNav />
          <DotNav />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/the-numbers" element={<TheNumbers />} />
              <Route path="/culture-extras" element={<CultureExtras />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/sources" element={<SourcesPage />} />
            </Routes>
          </main>
          <CardCounter />
          <SiteFooter />
        </CardCounterProvider>
      </SmoothScroll>
    </BrowserRouter>
  )
}
