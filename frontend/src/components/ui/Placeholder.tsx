interface PlaceholderProps {
  label: string
  className?: string
  rounded?: boolean
  compact?: boolean
}

/** Dashed placeholder box, matching the "browse files" image slots in the Figma template. */
export function Placeholder({
  label,
  className = '',
  rounded = false,
  compact = false,
}: PlaceholderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 border border-dashed border-border bg-placeholder text-center ${
        rounded ? 'rounded-full' : 'rounded-2xl'
      } ${className}`}
    >
      <svg
        width={compact ? 20 : 28}
        height={compact ? 20 : 28}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-muted"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      {!compact && (
        <p className="max-w-[220px] text-sm font-medium text-ink-soft">{label}</p>
      )}
      <span className={`text-xs text-muted underline underline-offset-2 ${compact ? 'text-[10px]' : ''}`}>
        {compact ? 'photo or browse' : (
          <>
            or <span className="cursor-pointer">browse files</span>
          </>
        )}
      </span>
    </div>
  )
}
