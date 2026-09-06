import { useCallback, useEffect, useRef, useState } from 'react'

export function useActiveSection(sectionIds: string[]) {
  const [fallback] = sectionIds
  const [activeId, setActiveId] = useState(fallback ?? '')
  const lockedTarget = useRef(null as string | null)

  const getSectionFromScroll = useCallback(() => {
    const offset = window.innerHeight * 0.32
    let current = fallback

    for (const id of sectionIds) {
      const section = document.getElementById(id)
      if (!section) continue
      if (section.getBoundingClientRect().top <= offset) current = id
    }

    return current
  }, [fallback, sectionIds])

  const navigateTo = useCallback(
    (id: string) => {
      if (!sectionIds.includes(id)) return
      lockedTarget.current = id
      setActiveId(id)
    },
    [sectionIds]
  )

  useEffect(() => {
    if (!sectionIds.length) return

    const update = () => {
      const current = getSectionFromScroll()
      if (!current) return

      if (lockedTarget.current) {
        if (current === lockedTarget.current) {
          lockedTarget.current = null
          setActiveId(current)
        }
        return
      }

      setActiveId(current)
    }

    const handleScrollEnd = () => {
      if (!lockedTarget.current) return
      const current = getSectionFromScroll()
      lockedTarget.current = null
      if (current) setActiveId(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    window.addEventListener('scrollend', handleScrollEnd)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('scrollend', handleScrollEnd)
    }
  }, [getSectionFromScroll, sectionIds])

  return { activeId, navigateTo }
}
