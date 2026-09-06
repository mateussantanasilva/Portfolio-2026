import { useAnimationFrame, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'

interface UseShinyProgressOptions {
  disabled?: boolean
  speed?: number
}

export function useShinyProgress({
  disabled = false,
  speed = 2,
}: UseShinyProgressOptions) {
  const progress = useMotionValue(0)
  const elapsedRef = useRef(0)
  const lastTimeRef = useRef<number | null>(null)

  const animationDuration = speed * 1000

  useAnimationFrame((time) => {
    if (disabled) {
      lastTimeRef.current = null
      return
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time
      return
    }

    const deltaTime = time - lastTimeRef.current
    lastTimeRef.current = time
    elapsedRef.current += deltaTime

    const cycleTime = elapsedRef.current % animationDuration
    progress.set((cycleTime / animationDuration) * 100)
  })

  useEffect(() => {
    if (disabled) {
      elapsedRef.current = 0
      progress.set(0)
      lastTimeRef.current = null
    }
  }, [disabled, progress])

  const backgroundPosition = useTransform(
    progress,
    (value) => `${150 - value * 2}% center`
  )

  return { backgroundPosition, progress }
}
