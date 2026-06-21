import { Link } from 'react-router-dom'
import { Code2, Search, FileX } from 'lucide-react'

export function EmptyPastes({ message = "No pastes yet", action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-bg-secondary border border-border flex items-center justify-center mb-4">
        <Code2 size={28} className="text-text-muted" />
      </div>
      <h3 className="text-text-primary font-medium mb-1">{message}</h3>
      <p className="text-text-secondary text-sm mb-4">Create your first paste to get started.</p>
      {action ?? (
        <Link to="/new" className="btn-primary">Create Paste</Link>
      )}
    </div>
  )
}

export function EmptySearch({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-bg-secondary border border-border flex items-center justify-center mb-4">
        <Search size={28} className="text-text-muted" />
      </div>
      <h3 className="text-text-primary font-medium mb-1">No results found</h3>
      <p className="text-text-secondary text-sm">
        No pastes match <span className="text-text-primary font-mono">"{query}"</span>. Try a different search.
      </p>
    </div>
  )
}

export function NotFound({ message = "Paste not found" }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-bg-secondary border border-border flex items-center justify-center mb-4">
        <FileX size={28} className="text-text-muted" />
      </div>
      <h3 className="text-text-primary font-semibold text-lg mb-2">{message}</h3>
      <p className="text-text-secondary text-sm mb-6">This paste may have expired, been deleted, or never existed.</p>
      <Link to="/" className="btn-secondary">Go Home</Link>
    </div>
  )
}
