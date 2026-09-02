import { cn } from '@/lib/utils'

interface BrandSurfaceProps {
  className?: string
}

/** Fundo navy de marca — Services, Contact e superfícies similares */
export function BrandSurface({ className }: BrandSurfaceProps) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
    >
      <div className="absolute inset-0 bg-portfolio-brand-surface" />
      <div
        className="absolute inset-0"
        style={{ background: 'var(--portfolio-brand-radial-accent)' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'var(--portfolio-brand-radial-depth)' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'var(--portfolio-brand-linear-sheen)' }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, var(--portfolio-brand-dot-alpha)) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          maskImage:
            'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5))',
          opacity: 'var(--portfolio-brand-dots-opacity)',
        }}
      />
    </div>
  )
}
