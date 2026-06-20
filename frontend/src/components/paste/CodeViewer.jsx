import { useEffect, useRef } from 'react'

// We load highlight.js from CDN via index.html
// This component applies syntax highlighting after mount

export default function CodeViewer({ content, language }) {
  const codeRef = useRef(null)

  useEffect(() => {
    if (!codeRef.current) return

    // Use highlight.js if available
    if (window.hljs) {
      codeRef.current.removeAttribute('data-highlighted')
      window.hljs.highlightElement(codeRef.current)
    }
  }, [content, language])

  const lines = content.split('\n')

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-bg-tertiary">
      <div className="overflow-x-auto">
        <div className="flex min-w-full">
          {/* Line numbers */}
          <div className="select-none px-4 py-4 text-right border-r border-border bg-bg-primary/40 shrink-0">
            {lines.map((_, i) => (
              <div key={i} className="font-mono text-xs text-text-muted leading-relaxed">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code */}
          <div className="flex-1 overflow-x-auto">
            <pre className="p-4 m-0">
              <code
                ref={codeRef}
                className={`language-${language} font-mono text-sm leading-relaxed text-text-primary`}
              >
                {content}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
