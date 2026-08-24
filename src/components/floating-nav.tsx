import { useMemo } from 'react'
import { FloatingDock } from '@/components/ui/floating-dock'
import { portfolio } from '@/data/portfolio'
import { useActiveSection } from '@/hooks/use-active-section'
import { cn } from '@/lib/utils'

export function FloatingNav() {
  const { nav } = portfolio
  const sectionIds = useMemo(
    () =>
      nav.items
        .filter((item) => item.href.startsWith('#'))
        .map((item) => item.href.slice(1)),
    []
  )
  const { activeId, navigateTo } = useActiveSection(sectionIds)

  const items = nav.items.map((item) => {
    const isImage = 'isImage' in item && item.isImage
    const isActive = item.href === `#${activeId}`
    const sectionId = item.href.startsWith('#') ? item.href.slice(1) : null

    return {
      active: isActive,
      className: cn(
        item.id === 'projetos' && 'max-[375px]:hidden',
        item.id === 'curriculo' && 'max-md:hidden'
      ),
      download: 'download' in item ? item.download : undefined,
      external: 'external' in item ? item.external : undefined,
      fill: Boolean(isImage),
      href: item.href,
      icon: (
        <img
          alt=""
          className={cn(
            'size-full',
            isImage ? 'rounded-full object-cover' : 'object-contain'
          )}
          height={36}
          src={item.icon}
          width={36}
        />
      ),
      onNavigate: sectionId
        ? () => {
            navigateTo(sectionId)
          }
        : undefined,
      title: item.label,
    }
  })

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-8"
    >
      <div className="pointer-events-auto max-w-full">
        <FloatingDock items={items} />
      </div>
    </nav>
  )
}
