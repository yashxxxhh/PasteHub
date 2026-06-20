import { Link } from 'react-router-dom'
import { Clock, Globe, Lock, Link2 } from 'lucide-react'
import { LANGUAGE_COLORS, VISIBILITY_COLORS, getLanguageLabel, formatRelative } from '../../services/constants'

const VisibilityIcon = ({ visibility }) => {
  if (visibility === 'public') return <Globe size={11} />
  if (visibility === 'private') return <Lock size={11} />
  return <Link2 size={11} />
}

export default function PasteCard({ paste }) {
  const langColor = LANGUAGE_COLORS[paste.language] || 'badge-blue'
  const visColor = VISIBILITY_COLORS[paste.visibility] || ''

  // Show a short preview of the content
  const preview = paste.content?.split('\n').slice(0, 3).join('\n') ?? ''

  return (
    <Link
      to={`/paste/${paste.short_id}`}
      className="card p-4 block hover:border-accent-blue/40 hover:shadow-lg hover:shadow-accent-blue/5 transition-all duration-150 group animate-fade-in"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-medium text-text-primary text-sm truncate group-hover:text-accent-blue transition-colors">
          {paste.title || 'Untitled'}
        </h3>
        <span className={`${langColor} shrink-0`}>
          {getLanguageLabel(paste.language)}
        </span>
      </div>

      {/* Code preview */}
      <pre className="font-mono text-xs text-text-muted mb-3 line-clamp-3 overflow-hidden leading-relaxed">
        {preview || '(empty)'}
      </pre>

      <div className="flex items-center gap-3 text-xs text-text-muted">
        <span className={`${visColor} flex items-center gap-1`}>
          <VisibilityIcon visibility={paste.visibility} />
          {paste.visibility}
        </span>
        {paste.owner && (
          <span className="text-text-muted">by {paste.owner.username}</span>
        )}
        <span className="flex items-center gap-1 ml-auto">
          <Clock size={11} />
          {formatRelative(paste.created_at)}
        </span>
      </div>
    </Link>
  )
}
