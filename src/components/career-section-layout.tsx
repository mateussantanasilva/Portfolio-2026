import type { ReactNode } from 'react'
import { SectionDescription } from '@/components/reveal'
import { SectionTitle } from '@/components/section-title'

interface CareerSectionLayoutProps {
  children: ReactNode
  description: string
  title: string
}

/** Título sticky à esquerda + conteúdo (timeline) à direita no desktop */
export function CareerSectionLayout({
  children,
  description,
  title,
}: CareerSectionLayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-8 py-16 md:gap-12 md:py-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)] lg:items-start lg:gap-16 lg:py-32">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex flex-col gap-4 md:gap-6">
          <SectionTitle>{title}</SectionTitle>
          <SectionDescription
            className="max-w-sm md:text-xl"
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
