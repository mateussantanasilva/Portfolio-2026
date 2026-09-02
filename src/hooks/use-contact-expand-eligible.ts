import { useEffect, useState } from 'react'

const LG_MIN_WIDTH = 1024

/**
 * Habilita o efeito ScrollExpand só quando:
 * - viewport ≥ lg (1024px)
 * - altura comporta o conteúdo expandido (sem cortar o form)
 * - altura não é exagerada (evita stage 100vh com vazio enorme)
 */
export function useContactExpandEligible({
  contentHeight,
  enabled = true,
  maxViewportHeight = 960,
  minContentHeight = 520,
}: {
  contentHeight: number
  enabled?: boolean
  /** Acima disso, seção estática — evita whitespace em monitores altos. */
  maxViewportHeight?: number
  minContentHeight?: number
}) {
  const [eligible, setEligible] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setEligible(false)
      return
    }

    const mediaQuery = window.matchMedia(`(min-width: ${LG_MIN_WIDTH}px)`)

    const evaluate = () => {
      const viewportH = window.innerHeight
      const isLg = mediaQuery.matches
      const neededHeight = Math.max(contentHeight, minContentHeight)
      const tallEnough = viewportH >= neededHeight
      const notExaggerated = viewportH <= maxViewportHeight

      setEligible(isLg && tallEnough && notExaggerated)
    }

    evaluate()
    mediaQuery.addEventListener('change', evaluate)
    window.addEventListener('resize', evaluate)

    return () => {
      mediaQuery.removeEventListener('change', evaluate)
      window.removeEventListener('resize', evaluate)
    }
  }, [contentHeight, enabled, maxViewportHeight, minContentHeight])

  return eligible
}
