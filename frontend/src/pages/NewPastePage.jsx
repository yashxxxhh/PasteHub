import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import PasteEditor from '../components/paste/PasteEditor'
import { pastesService } from '../services/pastes'

export default function NewPastePage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (form) => {
    setLoading(true)
    try {
      const res = await pastesService.create(form)
      toast.success('Paste created!')
      navigate(`/paste/${res.data.short_id}`)
    } catch (err) {
      toast.error(err.response?.data?.detail ?? 'Failed to create paste')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text-primary mb-1">New Paste</h1>
        <p className="text-text-secondary text-sm">Create a shareable code or text snippet.</p>
      </div>
      <PasteEditor onSubmit={handleSubmit} loading={loading} submitLabel="Create Paste" />
    </div>
  )
}
