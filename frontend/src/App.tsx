import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import { RequireAuth } from './components/app/RequireAuth'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Closet } from './pages/Closet'
import { Upload } from './pages/Upload'
import { ItemDetail } from './pages/ItemDetail'
import { OutfitGenerator } from './pages/OutfitGenerator'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/app"
            element={
              <RequireAuth>
                <Closet />
              </RequireAuth>
            }
          />
          <Route
            path="/app/upload"
            element={
              <RequireAuth>
                <Upload />
              </RequireAuth>
            }
          />
          <Route
            path="/app/item/:id"
            element={
              <RequireAuth>
                <ItemDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/app/outfit"
            element={
              <RequireAuth>
                <OutfitGenerator />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
