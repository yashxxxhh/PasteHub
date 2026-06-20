import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/layout/ProtectedRoute'

// Pages
import HomePage from './pages/HomePage'
import NewPastePage from './pages/NewPastePage'
import PasteViewPage from './pages/PasteViewPage'
import EditPastePage from './pages/EditPastePage'
import ExplorePage from './pages/ExplorePage'
import DashboardPage from './pages/DashboardPage'
import MyPastesPage from './pages/MyPastesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/new" element={<NewPastePage />} />
            <Route path="/paste/:shortId" element={<PasteViewPage />} />
            <Route path="/paste/:shortId/edit" element={
              <ProtectedRoute><EditPastePage /></ProtectedRoute>
            } />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/my-pastes" element={
              <ProtectedRoute><MyPastesPage /></ProtectedRoute>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={
              <div className="max-w-4xl mx-auto px-4 py-24 text-center">
                <p className="font-mono text-6xl font-bold text-text-muted mb-4">404</p>
                <p className="text-text-secondary">Page not found.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}
