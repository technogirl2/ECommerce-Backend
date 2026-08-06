import { useState } from 'react'
import type { ReactNode } from 'react'
import './CollapsibleSection.css'

interface CollapsibleSectionProps {
  title: string
  summary?: string
  defaultOpen?: boolean
  hasError?: boolean
  children: ReactNode
}

function CollapsibleSection({
  title,
  summary,
  defaultOpen = false,
  hasError = false,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const effectiveOpen = isOpen || hasError

  return (
    <div className={`collapsible-section${hasError ? ' has-error' : ''}`}>
      <button
        type="button"
        className="collapsible-section-header"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={effectiveOpen}
      >
        <div className="collapsible-section-heading">
          <span className="collapsible-section-title">{title}</span>
          {summary && (
            <span className="collapsible-section-summary">{summary}</span>
          )}
          {hasError && <span className="collapsible-section-error-dot" aria-hidden="true" />}
        </div>
        <svg
          className={`collapsible-section-chevron${effectiveOpen ? ' is-open' : ''}`}
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {effectiveOpen && <div className="collapsible-section-body">{children}</div>}
    </div>
  )
}

export default CollapsibleSection
