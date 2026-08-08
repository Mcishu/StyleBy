import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-ink text-cream hover:bg-ink-soft border border-ink',
  outline:
    'bg-transparent text-ink border border-ink/70 hover:bg-ink hover:text-cream',
  ghost: 'bg-transparent text-ink hover:text-accent border border-transparent',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[15px] font-medium leading-tight transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
