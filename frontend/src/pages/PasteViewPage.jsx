import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Copy, Check, Trash2, Edit2, Copy as Duplicate, ExternalLink,
  Clock, Globe, Lock, Link2, User, Calendar
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { pastesService } from '../services/pastes'
import CodeViewer from '../components/paste/CodeViewer'
import { PasteViewSkeleton } from '../components/ui/Skeleton'
import { NotFound } from '../components/ui/EmptyState'
import {
  LANGUAGE_COLORS, VISIBILITY_COLORS, getLanguageLabel,
  formatDate, formatRelative
} from '../services/constants'

export default function PasteViewPage() {
  const { shortId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [paste, setPaste] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    pastesService.get(shortId)
      .then(res => setPaste(res.data))
      .catch(err => setError(err.response?.data?.detail ?? 'Not found'))
      .finally(() => setLoading(false))
  }, [shortId])

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    toast.success('Link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const copyContent = async () => {
    await navigator.clipboard.writeText(paste.content)
    toast.success('Code copied!')
  }

  const handleDelete = async () => {
    if (!confirm('Delete this paste? This cannot be undone.')) return
    setDeleting(true)
    try {
      await pastesService.delete(shortId)
      toast.success('Paste deleted')
      navigate('/')
    } catch {
      toast.error('Failed to delete')
      setDeleting(false)
    }
  }

  const handleDuplicate = async () => {
    try {
      const res = await pastesService.duplicate(shortId)
      toast.success('Paste duplicated!')
      navigate(`/paste/${res.data.short_id}`)
    } catch {
      toast.error('Failed to duplicate')
    }
  }

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><PasteViewSkeleton /></div>
  if (error || !paste) return <div className="max-w-4xl mx-auto px-4 py-8"><NotFound message={error} /></div>

  const isOwner = user && paste.user_id && String(paste.user_id) === String(user.id)
  const langColor = LANGUAGE_COLORS[paste.language] || 'badge-blue'
  const visColor = VISIBILITY_COLORS[paste.visibility] || ''

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-5">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-text-primary mb-2 truncate">
            {paste.title || 'Untitled'}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={langColor}>{getLanguageLabel(paste.language)}</span>
            <span className={`${visColor} flex items-center gap-1`}>
              {paste.visibility === 'public' && <Globe size={10} />}
              {paste.visibility === 'private' && <Lock size={10} />}
              {paste.visibility === 'unlisted' && <Link2 size={10} />}
              {paste.visibility}
            </span>
            {paste.owner && (
              <span className="text-text-muted flex items-center gap-1">
                <User size={10} />
                {paste.owner.username}
              </span>
            )}
            <span className="text-text-muted flex items-center gap-1">
              <Calendar size={10} />
              {formatDate(paste.created_at)}
            </span>
            {paste.expires_at && (
              <span className="text-accent-orange flex items-center gap-1">
                <Clock size={10} />
                Expires {formatRelative(paste.expires_at)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={copyLink} className="btn-secondary flex items-center gap-1.5">
            {copied ? <Check size={13} className="text-accent-green" /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button onClick={copyContent} className="btn-secondary flex items-center gap-1.5">
            <Copy size={13} />
            Copy Code
          </button>
          <button onClick={handleDuplicate} className="btn-secondary flex items-center gap-1.5">
            <Duplicate size={13} />
            <span className="hidden sm:inline">Fork</span>
          </button>
          {isOwner && (
            <>
              <Link to={`/paste/${shortId}/edit`} className="btn-secondary flex items-center gap-1.5">
                <Edit2 size={13} />
                <span className="hidden sm:inline">Edit</span>
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn-danger flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span className="hidden sm:inline">{deleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Code */}
      <CodeViewer content={paste.content} language={paste.language} />

      {/* Short URL */}
      <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
        <ExternalLink size={12} />
        <span className="font-mono">{window.location.origin}/paste/{paste.short_id}</span>
      </div>
    </div>
  )
}
