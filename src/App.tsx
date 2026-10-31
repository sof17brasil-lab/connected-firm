import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SmoothScroll from '@/components/ui/smooth-scroll'
import { ReadingProgress } from '@/components/site/reading-progress'
import DesignSystem from '@/pages/DesignSystem'

export default function App() {
  return (
    // BASE_URL keeps routing correct under the /connected-firm/ Pages path.
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <SmoothScroll>
        <ReadingProgress />
        <Routes>
          <Route path="/" element={<DesignSystem />} />
        </Routes>
      </SmoothScroll>
    </BrowserRouter>
  )
}
