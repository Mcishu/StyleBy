import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Closet } from './pages/Closet'
import { Upload } from './pages/Upload'
import { ItemDetail } from './pages/ItemDetail'
import { OutfitGenerator } from './pages/OutfitGenerator'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Closet />} />
        <Route path="/app/upload" element={<Upload />} />
        <Route path="/app/item/:id" element={<ItemDetail />} />
        <Route path="/app/outfit" element={<OutfitGenerator />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
