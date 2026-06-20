export const LANGUAGES = [
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
]

export const VISIBILITIES = [
  { value: 'public', label: 'Public', desc: 'Anyone can view' },
  { value: 'unlisted', label: 'Unlisted', desc: 'Only people with the link' },
  { value: 'private', label: 'Private', desc: 'Only you' },
]

export const EXPIRATIONS = [
  { value: 'never', label: 'Never' },
  { value: '10min', label: '10 Minutes' },
  { value: '1hour', label: '1 Hour' },
  { value: '1day', label: '1 Day' },
  { value: '1week', label: '1 Week' },
]

export const LANGUAGE_COLORS = {
  python: 'badge-blue',
  javascript: 'badge-orange',
  java: 'badge-orange',
  cpp: 'badge-purple',
  ruby: 'badge-red',
  sql: 'badge-green',
  json: 'badge-orange',
  html: 'badge-red',
  css: 'badge-blue',
  plaintext: '',
}

export const VISIBILITY_COLORS = {
  public: 'badge-green',
  unlisted: 'badge-orange',
  private: 'badge-red',
}

export function getLanguageLabel(value) {
  return LANGUAGES.find(l => l.value === value)?.label ?? value
}

export function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatRelative(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return formatDate(dateString)
}

export function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

export function countLines(text) {
  return text.split('\n').length
}
