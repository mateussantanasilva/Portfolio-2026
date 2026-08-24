import { motion, useReducedMotion } from 'motion/react'
import { useShinyProgress } from '@/hooks/use-shiny-progress'
import { cn } from '@/lib/utils'

interface ShinyTextProps {
  className?: string
  color?: string
  delay?: number
  direction?: 'left' | 'right'
  disabled?: boolean
  shineColor?: string
  speed?: number
  spread?: number
  text: string
  yoyo?: boolean
}

export function ShinyText({
  className,
  color = '#b5b5b5',
  delay = 0,
  direction = 'left',
  disabled = false,
  shineColor = '#ffffff',
  speed = 2,
  spread = 120,
  text,
  yoyo = false,
}: ShinyTextProps) {
  const reduceMotion = useReducedMotion()
  const isDisabled = Boolean(disabled || reduceMotion)

  const { backgroundPosition } = useShinyProgress({
    delay,
    direction,
    disabled: isDisabled,
    speed,
    yoyo,
  })

  if (isDisabled) {
    return <span className={className}>{text}</span>
  }

  return (
    <motion.span
      className={cn('inline-block', className)}
      style={{
        backgroundClip: 'text',
        backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
        backgroundPosition,
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {text}
    </motion.span>
  )
}

interface ShinySurfaceProps {
  active?: boolean
  className?: string
  color?: string
  disabled?: boolean
  /** 0 = bem suave, 1 = contraste máximo. Controla largura e opacidade do brilho. */
  intensity?: number
  shineColor?: string
  speed?: number
  spread?: number
}

export function ShinySurface({
  active = false,
  className,
  color = '#f9f9f9',
  intensity = 1,
  disabled = false,
  shineColor = '#ffffff',
  speed = 1.8,
  spread = 120,
}: ShinySurfaceProps) {
  const reduceMotion = useReducedMotion()
  const isDisabled = Boolean(disabled || reduceMotion || !active)
  const clamped = Math.min(1, Math.max(0, intensity))
  const band = 8 + (1 - clamped) * 22
  const start = Math.max(0, 50 - band)
  const end = Math.min(100, 50 + band)

  const { backgroundPosition } = useShinyProgress({
    disabled: isDisabled,
    speed,
  })

  if (reduceMotion || disabled || !active) {
    return null
  }

  return (
    <motion.div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit]',
        className
      )}
      initial={false}
      style={{
        backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} ${start}%, ${shineColor} 50%, ${color} ${end}%, ${color} 100%)`,
        backgroundPosition,
        backgroundSize: '200% 100%',
        opacity: 0.35 + clamped * 0.65,
      }}
    />
  )
}
