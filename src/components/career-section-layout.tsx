import type { ReactNode } from 'react'
import { SectionDescription } from '@/components/reveal'
import { SectionTitle } from '@/components/section-title'
import { cn } from '@/lib/utils'

interface CareerSectionLayoutProps {
  children: ReactNode
  className?: string
  description: string
  title: string
}

/** Título sticky à esquerda + conteúdo (timeline) à direita no desktop */
export function CareerSectionLayout({
  children,
  className,
  description,
  title,
}: CareerSectionLayoutProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)] lg:items-start lg:gap-16',
        className
      )}
    >
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex flex-col gap-4 md:gap-6">
          <SectionTitle>{title}</SectionTitle>
          <SectionDescription
            className="max-w-sm text-pretty md:text-xl"
            titleLength={title.length}
          >
            {description}
          </SectionDescription>
        </div>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  )
}
