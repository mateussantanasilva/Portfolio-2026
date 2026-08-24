import {
  type MotionValue,
  motion,
  motionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import {
  createContext,
  type ReactNode,
  type RefObject,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

const TimelineProgressContext = createContext<MotionValue<number>>(
  motionValue(0)
)
const TimelineContainerContext =
  createContext<RefObject<HTMLDivElement | null> | null>(null)

interface TimelineProps {
  /** Gradiente amarelo → preto na linha (ex.: experiência com cargo atual) */
  accent?: boolean
  children: ReactNode
}

interface TimelineItemProps {
  children: ReactNode
  /** Destaque amarelo na bolinha (ex.: cargo atual) */
  highlight?: boolean
}

export function Timeline({ accent = false, children }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    offset: ['start 0.85', 'end 0.3'],
    target: ref,
  })

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 32,
    restDelta: 0.001,
    stiffness: 90,
  })

  const scaleY = useTransform(smoothProgress, [0, 1], [0, 1])

  return (
    <TimelineContainerContext.Provider value={ref}>
      <TimelineProgressContext.Provider value={smoothProgress}>
        <div className="relative ml-3 md:ml-4" ref={ref}>
          <div
            aria-hidden
            className="absolute top-2 bottom-2 left-0 w-px -translate-x-1/2 bg-portfolio-subtle"
          />

          <motion.div
            aria-hidden
            className={
              accent
                ? 'absolute top-2 bottom-2 left-0 w-0.5 origin-top -translate-x-1/2 bg-linear-to-b from-[#ffe600] via-35% via-[#ffe600] to-foreground'
                : 'absolute top-2 bottom-2 left-0 w-px origin-top -translate-x-1/2 bg-foreground'
            }
            style={{ scaleY: reduceMotion ? 1 : scaleY }}
          />

          <div className="flex flex-col">{children}</div>
        </div>
      </TimelineProgressContext.Provider>
    </TimelineContainerContext.Provider>
  )
}

export function TimelineItem({
  children,
  highlight = false,
}: TimelineItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)
  const containerRef = useContext(TimelineContainerContext)
  const progress = useContext(TimelineProgressContext)
  const reduceMotion = useReducedMotion()

  // 2 = ainda não medido → permanece desmarcado
  const [threshold, setThreshold] = useState(2)
  const [filled, setFilled] = useState(false)

  useLayoutEffect(() => {
    const measure = () => {
      const container = containerRef?.current
      const item = itemRef.current
      if (!(container && item)) return

      const containerHeight = container.offsetHeight
      const lineStart = 8
      const lineLength = Math.max(containerHeight - 16, 1)
      const dotCenter = item.offsetTop + 8 + 6
      const nextThreshold = (dotCenter - lineStart) / lineLength
      setThreshold(Math.min(Math.max(nextThreshold, 0), 1))
    }

    measure()

    const observer = new ResizeObserver(measure)
    if (containerRef?.current) observer.observe(containerRef.current)
    if (itemRef.current) observer.observe(itemRef.current)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [containerRef])

  useEffect(() => {
    setFilled(Boolean(reduceMotion) || progress.get() >= threshold)
  }, [progress, threshold, reduceMotion])

  useMotionValueEvent(progress, 'change', (value) => {
    setFilled(Boolean(reduceMotion) || value >= threshold)
  })

  return (
    <div
      className="relative pb-12 pl-8 last:pb-0 md:pb-16 md:pl-12"
      ref={itemRef}
    >
      <motion.span
        animate={{
          scale: reduceMotion || filled ? 1 : 0.85,
        }}
        aria-hidden
        className={
          highlight
            ? 'absolute top-2 left-0 flex size-3 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#ffe600] bg-background md:size-4'
            : 'absolute top-2 left-0 flex size-3 -translate-x-1/2 items-center justify-center rounded-full border-2 border-foreground bg-background md:size-4'
        }
        initial={false}
        transition={{ damping: 24, stiffness: 320, type: 'spring' }}
      >
        {highlight && !reduceMotion ? (
          <motion.span
            animate={{ opacity: [0.45, 0.12, 0.45], scale: [1, 2.2, 1] }}
            className="absolute inset-0 rounded-full bg-[#ffe600]"
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        ) : null}
        <motion.span
          animate={{ opacity: reduceMotion || filled ? 1 : 0 }}
          className={
            highlight
              ? 'relative size-2 rounded-full bg-[#ffe600]'
              : 'relative size-2 rounded-full bg-foreground'
          }
          initial={false}
          transition={{ duration: 0.15 }}
        />
      </motion.span>
      {children}
    </div>
  )
}
