import {
  type HTMLMotionProps,
  motion,
  type UseInViewOptions,
  useInView,
  useReducedMotion,
} from 'motion/react'
import { Children, type ReactNode, useRef, useState } from 'react'
import {
  bubbleSpring,
  CARD_STAGGER,
  cardSpring,
  REVEAL_DURATION,
  REVEAL_Y,
  revealSpring,
  typingDelay,
} from '@/lib/motion'
import { cn } from '@/lib/utils'

type MotionTag = keyof typeof motion

interface RevealProps
  extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate'> {
  amount?: number
  as?: MotionTag
  delay?: number
  duration?: number
  inView?: boolean
  margin?: UseInViewOptions['margin']
  once?: boolean
  x?: number
  y?: number
}

export function Reveal({
  amount = 0.15,
  as = 'div',
  children,
  className,
  delay = 0,
  duration = REVEAL_DURATION,
  inView: inViewProp,
  margin,
  once = true,
  x = 0,
  y = REVEAL_Y,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const observedInView = useInView(ref, { amount, margin, once })
  const reduceMotion = useReducedMotion()
  const Component = motion[as] as typeof motion.div
  const inView = inViewProp ?? observedInView
  const visible = reduceMotion || inView

  return (
    <Component
      animate={visible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
      className={className}
      initial={false}
      ref={ref}
      transition={
        reduceMotion
          ? { duration: 0 }
          : x === 0
            ? { delay, duration, ease: 'easeOut' }
            : { ...revealSpring, delay }
      }
      {...props}
    >
      {children}
    </Component>
  )
}

interface BubbleEntranceProps {
  children: ReactNode
  className?: string
  delay?: number
}

/** Pop de bolha na entrada (SpecularButton não depende mais de remount WebGL) */
export function BubbleEntrance({
  children,
  className,
  delay = 0,
}: BubbleEntranceProps) {
  const reduceMotion = useReducedMotion()
  const [shaderKey, setShaderKey] = useState(reduceMotion ? 1 : 0)
  const hasRemounted = useRef(reduceMotion)

  if (reduceMotion) {
    return <div className={cn('inline-flex', className)}>{children}</div>
  }

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className={cn('inline-flex origin-center', className)}
      initial={{ opacity: 0, scale: 0 }}
      onAnimationComplete={() => {
        if (hasRemounted.current) return
        hasRemounted.current = true
        setShaderKey(1)
      }}
      style={{ transformOrigin: 'center center' }}
      transition={{ ...bubbleSpring, delay }}
    >
      <div className="inline-flex" key={shaderKey}>
        {children}
      </div>
    </motion.div>
  )
}

interface RevealStaggerProps {
  amount?: number
  children: ReactNode
  className?: string
  once?: boolean
  stagger?: number
  y?: number
}

export function RevealStagger({
  amount = 0.15,
  children,
  className,
  once = true,
  stagger = CARD_STAGGER,
  y = REVEAL_Y,
}: RevealStaggerProps) {
  const items = Children.toArray(children)

  return (
    <div className={className}>
      {items.map((child, index) => (
        <Reveal
          amount={amount}
          className="contents"
          delay={index * stagger}
          key={`reveal-stagger-${index}`}
          once={once}
          y={y}
        >
          {child}
        </Reveal>
      ))}
    </div>
  )
}

interface SectionDescriptionProps {
  children: string
  className?: string
  titleLength: number
}

export function SectionDescription({
  children,
  className,
  titleLength,
}: SectionDescriptionProps) {
  return (
    <Reveal
      amount={0.3}
      className={cn(
        'max-w-md text-balance font-heading font-light text-foreground text-sm uppercase tracking-wide sm:text-base md:text-lg lg:text-xl',
        className
      )}
      delay={typingDelay(titleLength)}
      y={10}
    >
      {children}
    </Reveal>
  )
}

interface RevealCardProps
  extends Omit<HTMLMotionProps<'article'>, 'initial' | 'animate'> {
  amount?: number
  delay?: number
  index?: number
}

export function RevealCard({
  amount = 0.15,
  children,
  className,
  delay,
  index = 0,
  ...props
}: RevealCardProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount, once: true })
  const reduceMotion = useReducedMotion()
  const visible = reduceMotion || inView
  const resolvedDelay = delay ?? index * CARD_STAGGER

  return (
    <motion.article
      animate={
        visible
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.97, y: REVEAL_Y }
      }
      className={className}
      initial={false}
      ref={ref}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              ...cardSpring,
              delay: resolvedDelay,
            }
      }
      {...props}
    >
      {children}
    </motion.article>
  )
}
