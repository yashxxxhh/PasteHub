import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Code2, Zap, Shield, Globe, ArrowRight } from 'lucide-react'

const DEMO_CODE = `def fibonacci(n):
    """Generate fibonacci sequence up to n."""
    a, b = 0, 1
    while a < n:
        yield a
        a, b = b, a + b

# Print first 10 fibonacci numbers
for num in fibonacci(100):
    print(num)`

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16">
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-blue/30 bg-accent-blue/10 text-accent-blue text-xs font-medium mb-6">
            <Zap size={12} />
            Share code in seconds
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4 leading-tight">
            The developer's<br />
            <span className="text-accent-blue font-mono">paste</span>board
          </h1>
          <p className="text-text-secondary text-lg max-w-md mx-auto mb-8">
            Create, share, and discover code snippets with syntax highlighting, expiration controls, and shareable URLs.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/new" className="btn-primary px-6 py-2.5 text-base flex items-center gap-2">
              Create a Paste
              <ArrowRight size={16} />
            </Link>
            <Link to="/explore" className="btn-secondary px-6 py-2.5 text-base">
              Explore Pastes
            </Link>
          </div>
        </div>

        {/* Demo code block */}
        <div className="max-w-2xl mx-auto animate-slide-up">
          <div className="card overflow-hidden shadow-2xl shadow-black/40">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-bg-tertiary/60">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 text-center">
                <span className="font-mono text-xs text-text-muted">pastehub.dev/paste/aB3x9kQm</span>
              </div>
              <span className="badge-blue">Python</span>
            </div>
            <pre className="p-5 overflow-x-auto">
              <code className="font-mono text-sm text-text-primary leading-relaxed">
                {DEMO_CODE}
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <Code2 size={20} className="text-accent-blue" />,
              title: 'Syntax Highlighting',
              desc: 'Support for Python, JavaScript, Java, C++, SQL, and more.',
            },
            {
              icon: <Shield size={20} className="text-accent-green" />,
              title: 'Privacy Controls',
              desc: 'Public, unlisted, or private. Set expiration from 10 minutes to 1 week.',
            },
            {
              icon: <Globe size={20} className="text-accent-purple" />,
              title: 'Instant Sharing',
              desc: 'Every paste gets a unique short URL. One click to copy and share.',
            },
          ].map((f) => (
            <div key={f.title} className="card p-5">
              <div className="w-9 h-9 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center mb-3">
                {f.icon}
              </div>
              <h3 className="font-semibold text-text-primary mb-1.5 text-sm">{f.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
