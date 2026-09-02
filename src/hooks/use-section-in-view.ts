import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { type RefObject, useEffect, useState } from 'react'

/** Dispara quando a seção entra de fato na área visível (não só encosta no rodapé da viewport) */
const SECTION_REVEAL_OFFSET: NonNullable<
  Parameters<typeof useScroll>[0]
>['offset'] = ['start 0.88', 'start 0.52']

const SECTION_REVEAL_THRESHOLD = 0.22

export function useSectionInView(ref: RefObject<HTMLElement | null>) {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(Boolean(reduceMotion))

  const { scrollYProgress } = useScroll({
    offset: SECTION_REVEAL_OFFSET,
    target: ref,
  })

  useEffect(() => {
    if (reduceMotion) return
    if (scrollYProgress.get() >= SECTION_REVEAL_THRESHOLD) {
      setVisible(true)
    }
  }, [reduceMotion, scrollYProgress])

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (!visible && progress >= SECTION_REVEAL_THRESHOLD) {
      setVisible(true)
    }
  })

  return visible
}
