import { useAnimationFrame, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'

interface UseShinyProgressOptions {
  delay?: number
  direction?: 'left' | 'right'
  disabled?: boolean
  speed?: number
  yoyo?: boolean
}

export function useShinyProgress({
  delay = 0,
  direction = 'left',
  disabled = false,
  speed = 2,
  yoyo = false,
}: UseShinyProgressOptions) {
  const progress = useMotionValue(0)
  const elapsedRef = useRef(0)
  const lastTimeRef = useRef<number | null>(null)
  const directionRef = useRef(direction === 'left' ? 1 : -1)

  const animationDuration = speed * 1000
  const delayDuration = delay * 1000

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

    if (yoyo) {
      const cycleDuration = animationDuration + delayDuration
      const fullCycle = cycleDuration * 2
      const cycleTime = elapsedRef.current % fullCycle

      if (cycleTime < animationDuration) {
        const p = (cycleTime / animationDuration) * 100
        progress.set(directionRef.current === 1 ? p : 100 - p)
      } else if (cycleTime < cycleDuration) {
        progress.set(directionRef.current === 1 ? 100 : 0)
      } else if (cycleTime < cycleDuration + animationDuration) {
        const reverseTime = cycleTime - cycleDuration
        const p = 100 - (reverseTime / animationDuration) * 100
        progress.set(directionRef.current === 1 ? p : 100 - p)
      } else {
        progress.set(directionRef.current === 1 ? 0 : 100)
      }
    } else {
      const cycleDuration = animationDuration + delayDuration
      const cycleTime = elapsedRef.current % cycleDuration

      if (cycleTime < animationDuration) {
        const p = (cycleTime / animationDuration) * 100
        progress.set(directionRef.current === 1 ? p : 100 - p)
      } else {
        progress.set(directionRef.current === 1 ? 100 : 0)
      }
    }
  })

  useEffect(() => {
    directionRef.current = direction === 'left' ? 1 : -1
    elapsedRef.current = 0
    progress.set(0)
    lastTimeRef.current = null
  }, [direction, progress])

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
