import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Code2, Plus, LayoutDashboard, LogOut, User, ChevronDown, Search } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/60">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-text-primary hover:text-accent-blue transition-colors shrink-0">
          <div className="w-7 h-7 bg-accent-blue rounded-lg flex items-center justify-center">
            <Code2 size={15} className="text-bg-primary" />
          </div>
          <span className="font-mono text-sm">PasteHub</span>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-1 flex-1 max-w-xs">
          <Link
            to="/explore"
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              location.pathname === '/explore'
                ? 'text-text-primary bg-bg-tertiary'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
            }`}
          >
            Explore
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                location.pathname === '/dashboard'
                  ? 'text-text-primary bg-bg-tertiary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
              }`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link to="/new" className="btn-primary flex items-center gap-1.5">
            <Plus size={14} />
            <span className="hidden sm:inline">New Paste</span>
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-tertiary border border-border text-sm text-text-primary hover:border-accent-blue transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-accent-blue/20 border border-accent-blue/40 flex items-center justify-center">
                  <span className="text-accent-blue text-[10px] font-bold">
                    {user.username[0].toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:inline text-text-secondary">{user.username}</span>
                <ChevronDown size={13} className="text-text-muted" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-48 card shadow-xl z-20 animate-fade-in overflow-hidden">
                    <div className="p-2">
                      <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                      >
                        <LayoutDashboard size={14} />
                        Dashboard
                      </Link>
                      <Link
                        to="/my-pastes"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                      >
                        <User size={14} />
                        My Pastes
                      </Link>
                    </div>
                    <div className="border-t border-border p-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-accent-red hover:bg-red-500/10 transition-colors w-full text-left"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary hidden sm:inline-flex">Sign In</Link>
              <Link to="/register" className="text-sm text-text-secondary hover:text-text-primary transition-colors sm:hidden">Sign In</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
