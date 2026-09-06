import { motion, useReducedMotion } from 'motion/react'
import { useShinyProgress } from '@/hooks/use-shiny-progress'
import { cn } from '@/lib/utils'

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
  // Intensidade baixa = faixa larga e suave; alta = faixa estreita e marcada
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
