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

/**
 * No desktop a linha da timeline fica no centro horizontal:
 * título/descrição à esquerda, entradas à direita — colunas iguais.
 */
export function CareerSectionLayout({
  children,
  className,
  description,
  title,
}: CareerSectionLayoutProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2 lg:items-start lg:gap-0',
        className
      )}
    >
      <aside className="lg:sticky lg:top-28 lg:self-start lg:pr-8 xl:pr-12">
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
