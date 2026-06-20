import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { pastesService } from '../services/pastes'
import PasteEditor from '../components/paste/PasteEditor'
import { PasteViewSkeleton } from '../components/ui/Skeleton'
import { NotFound } from '../components/ui/EmptyState'

export default function EditPastePage() {
  const { shortId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [paste, setPaste] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    pastesService.get(shortId)
      .then(res => {
        const p = res.data
        if (!user || String(p.user_id) !== String(user.id)) {
          setError("You don't have permission to edit this paste.")
        } else {
          setPaste(p)
        }
      })
      .catch(err => setError(err.response?.data?.detail ?? 'Not found'))
      .finally(() => setLoading(false))
  }, [shortId, user])

  const handleSubmit = async (form) => {
    setSaving(true)
    try {
      await pastesService.update(shortId, form)
      toast.success('Paste updated!')
      navigate(`/paste/${shortId}`)
    } catch (err) {
      toast.error(err.response?.data?.detail ?? 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><PasteViewSkeleton /></div>
  if (error || !paste) return <div className="max-w-4xl mx-auto px-4 py-8"><NotFound message={error} /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary mb-1">Edit Paste</h1>
        <p className="text-text-secondary text-sm font-mono">/{paste.short_id}</p>
      </div>
      <PasteEditor
        initial={paste}
        onSubmit={handleSubmit}
        loading={saving}
        submitLabel="Save Changes"
      />
    </div>
  )
}
