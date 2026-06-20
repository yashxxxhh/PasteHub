import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardService } from '../services/pastes'
import PasteCard from '../components/paste/PasteCard'
import { PasteCardSkeleton } from '../components/ui/Skeleton'
import { EmptyPastes } from '../components/ui/EmptyState'
import { Plus } from 'lucide-react'

export default function MyPastesPage() {
  const [pastes, setPastes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.myPastes()
      .then(res => setPastes(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">My Pastes</h1>
          {!loading && (
            <p className="text-text-secondary text-sm mt-0.5">{pastes.length} pastes</p>
          )}
        </div>
        <Link to="/new" className="btn-primary flex items-center gap-1.5">
          <Plus size={14} />
          New Paste
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <PasteCardSkeleton key={i} />)}
        </div>
      ) : pastes.length === 0 ? (
        <EmptyPastes />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastes.map(p => <PasteCard key={p.id} paste={p} />)}
        </div>
      )}
    </div>
  )
}
