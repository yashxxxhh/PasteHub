import { useState } from 'react'
import { LANGUAGES, VISIBILITIES, EXPIRATIONS, countWords, countLines } from '../../services/constants'
import { AlignLeft, Hash, Type } from 'lucide-react'

export default function PasteEditor({ initial = {}, onSubmit, loading, submitLabel = 'Create Paste' }) {
  const [form, setForm] = useState({
    title: initial.title ?? '',
    content: initial.content ?? '',
    language: initial.language ?? 'plaintext',
    visibility: initial.visibility ?? 'public',
    expiration: 'never',
  })

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.content.trim()) return
    onSubmit(form)
  }

  const lines = countLines(form.content)
  const words = countWords(form.content)
  const chars = form.content.length

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <input
          type="text"
          placeholder="Untitled paste..."
          value={form.title}
          onChange={set('title')}
          className="input-field text-base font-medium"
          maxLength={255}
        />
      </div>

      {/* Code editor */}
      <div className="relative">
        <textarea
          value={form.content}
          onChange={set('content')}
          placeholder="// Paste your code or text here..."
          rows={20}
          className="code-editor p-4 leading-relaxed"
          required
          spellCheck={false}
        />
        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-bg-tertiary/80 backdrop-blur-sm px-4 py-1.5 rounded-b-lg flex gap-4 text-xs text-text-muted font-mono">
          <span className="flex items-center gap-1">
            <Hash size={10} />
            {lines} {lines === 1 ? 'line' : 'lines'}
          </span>
          <span className="flex items-center gap-1">
            <Type size={10} />
            {words} words
          </span>
          <span className="flex items-center gap-1">
            <AlignLeft size={10} />
            {chars} chars
          </span>
        </div>
      </div>

      {/* Options row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-text-secondary mb-1.5 font-medium">Language</label>
          <select value={form.language} onChange={set('language')} className="select-field w-full">
            {LANGUAGES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1.5 font-medium">Visibility</label>
          <select value={form.visibility} onChange={set('visibility')} className="select-field w-full">
            {VISIBILITIES.map(v => (
              <option key={v.value} value={v.value}>{v.label} — {v.desc}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-text-secondary mb-1.5 font-medium">Expires</label>
          <select value={form.expiration} onChange={set('expiration')} className="select-field w-full">
            {EXPIRATIONS.map(e => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button type="submit" disabled={loading || !form.content.trim()} className="btn-primary px-6">
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
