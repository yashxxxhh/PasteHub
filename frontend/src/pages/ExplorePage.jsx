import { useState, useEffect, useCallback } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { pastesService } from '../services/pastes'
import PasteCard from '../components/paste/PasteCard'
import { PasteCardSkeleton } from '../components/ui/Skeleton'
import { EmptyPastes, EmptySearch } from '../components/ui/EmptyState'
import { LANGUAGES } from '../services/constants'

export default function ExplorePage() {
  const [pastes, setPastes] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState('')
  const [sort, setSort] = useState('latest')

  const fetchPastes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await pastesService.list({ page, per_page: 20, search, language, sort })
      setPastes(res.data.pastes)
      setTotal(res.data.total)
      setTotalPages(res.data.total_pages)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [page, search, language, sort])

  useEffect(() => {
    const timer = setTimeout(fetchPastes, 300)
    return () => clearTimeout(timer)
  }, [fetchPastes])

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1) }, [search, language, sort])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search pastes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2">
          <select value={language} onChange={e => setLanguage(e.target.value)} className="select-field">
            <option value="">All Languages</option>
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="select-field">
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-text-muted text-xs mb-4">
          {total} {total === 1 ? 'paste' : 'pastes'} found
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <PasteCardSkeleton key={i} />)}
        </div>
      ) : pastes.length === 0 ? (
        search ? <EmptySearch query={search} /> : <EmptyPastes />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastes.map(p => <PasteCard key={p.id} paste={p} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary"
          >
            Previous
          </button>
          <span className="text-text-secondary text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
