import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { dashboardService } from '../services/pastes'
import { StatsSkeleton, PasteCardSkeleton } from '../components/ui/Skeleton'
import { EmptyPastes } from '../components/ui/EmptyState'
import PasteCard from '../components/paste/PasteCard'
import { FileCode, Eye, Lock, Link2, Plus } from 'lucide-react'

function StatCard({ icon, label, value, color }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-text-secondary text-sm">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-text-primary font-mono">{value}</p>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardService.stats()
      .then(res => setStats(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary text-sm mt-0.5">Welcome back, {user?.username}</p>
        </div>
        <Link to="/new" className="btn-primary flex items-center gap-1.5">
          <Plus size={14} />
          New Paste
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatsSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              icon={<FileCode size={16} className="text-accent-blue" />}
              label="Total Pastes"
              value={stats?.total_pastes ?? 0}
              color="bg-accent-blue/10"
            />
            <StatCard
              icon={<Eye size={16} className="text-accent-green" />}
              label="Public"
              value={stats?.public_pastes ?? 0}
              color="bg-accent-green/10"
            />
            <StatCard
              icon={<Lock size={16} className="text-accent-red" />}
              label="Private"
              value={stats?.private_pastes ?? 0}
              color="bg-accent-red/10"
            />
            <StatCard
              icon={<Link2 size={16} className="text-accent-purple" />}
              label="Unlisted"
              value={stats?.unlisted_pastes ?? 0}
              color="bg-accent-purple/10"
            />
          </>
        )}
      </div>

      {/* Recent sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-text-primary text-sm">Recently Created</h2>
            <Link to="/my-pastes" className="text-xs text-accent-blue hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <PasteCardSkeleton key={i} />)}
            </div>
          ) : stats?.recently_created?.length === 0 ? (
            <EmptyPastes message="No pastes yet" />
          ) : (
            <div className="space-y-3">
              {stats?.recently_created?.map(p => <PasteCard key={p.id} paste={p} />)}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-text-primary text-sm">Recently Updated</h2>
            <Link to="/my-pastes" className="text-xs text-accent-blue hover:underline">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <PasteCardSkeleton key={i} />)}
            </div>
          ) : stats?.recently_updated?.length === 0 ? (
            <EmptyPastes message="No pastes yet" />
          ) : (
            <div className="space-y-3">
              {stats?.recently_updated?.map(p => <PasteCard key={p.id} paste={p} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
