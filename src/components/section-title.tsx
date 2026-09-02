import { useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { CHAR_MS } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface SectionTitleProps {
  children: string
  className?: string
}

export function SectionTitle({ children, className }: SectionTitleProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { amount: 0.4, once: true })
  const reduceMotion = useReducedMotion()
  const [displayed, setDisplayed] = useState(reduceMotion ? children : '')
  const isTyping = !reduceMotion && displayed.length < children.length

  useEffect(() => {
    if (reduceMotion) {
      setDisplayed(children)
      return
    }

    if (!inView) return

    setDisplayed('')
    let index = 0

    const id = window.setInterval(() => {
      index += 1
      setDisplayed(children.slice(0, index))
      if (index >= children.length) {
        window.clearInterval(id)
      }
    }, CHAR_MS)

    return () => window.clearInterval(id)
  }, [children, inView, reduceMotion])

  return (
    <h2
      aria-label={children}
      className={cn(
        'font-heading font-medium text-4xl text-foreground leading-none tracking-tight md:text-5xl lg:text-7xl',
        className
      )}
      ref={ref}
    >
      <span className="relative inline-block">
        {/* Reserva o espaço final para evitar pulo de layout */}
        <span aria-hidden className="invisible whitespace-pre">
          {children}
        </span>
        <span aria-hidden className="absolute inset-0 whitespace-pre">
          {displayed}
          {isTyping ? (
            <span className="ml-1 inline-block h-[0.85em] w-1 translate-y-1 animate-pulse bg-current align-baseline" />
          ) : null}
        </span>
      </span>
    </h2>
  )
}
