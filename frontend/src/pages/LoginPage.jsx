import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/pastes'
import { Code2 } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authService.login(form)
      login(res.data.access_token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.username}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-accent-blue rounded-xl flex items-center justify-center">
            <Code2 size={18} className="text-bg-primary" />
          </div>
          <span className="font-mono font-semibold text-text-primary">PasteHub</span>
        </div>

        <div className="card p-6">
          <h1 className="text-lg font-semibold text-text-primary mb-1 text-center">Sign in</h1>
          <p className="text-text-secondary text-sm text-center mb-6">
            Welcome back. Enter your credentials.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                className="input-field"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5 font-medium">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="••••••••"
                className="input-field"
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-text-secondary text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent-blue hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
