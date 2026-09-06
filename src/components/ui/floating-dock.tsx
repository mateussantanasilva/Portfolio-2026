import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'
import {
  cloneElement,
  isValidElement,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { cn } from '@/lib/utils'

export interface FloatingDockItem {
  active?: boolean
  className?: string
  download?: boolean | string
  external?: boolean
  /** Ícone preenche o círculo (ex.: avatar) */
  fill?: boolean
  href: string
  icon: ReactNode
  onNavigate?: () => void
  title: string
}

interface FloatingDockProps {
  className?: string
  items: FloatingDockItem[]
}

const SPRING = { damping: 12, mass: 0.1, stiffness: 150 } as const
const EXIT_MS = 140
const EXIT_TRANSITION = { duration: 0.14, ease: [0.4, 0, 1, 1] as const }
const ENTER_TRANSITION = {
  damping: 22,
  stiffness: 520,
  type: 'spring' as const,
}
const MD_MIN_WIDTH = 768

function subscribeMdUp(onChange: () => void) {
  const mediaQuery = window.matchMedia(`(min-width: ${MD_MIN_WIDTH}px)`)
  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

function useMdUp() {
  return useSyncExternalStore(
    subscribeMdUp,
    () => window.matchMedia(`(min-width: ${MD_MIN_WIDTH}px)`).matches,
    () => false
  )
}

function resolveDownload(download?: boolean | string) {
  if (typeof download === 'string') return download
  if (download) return 'CV_MateusSantana.pdf'
}

function cloneIcon(icon: ReactNode) {
  if (isValidElement(icon)) {
    return cloneElement(icon as ReactElement)
  }
  return icon
}

export function FloatingDock({ items, className }: FloatingDockProps) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY)
  const reduceMotion = useReducedMotion()
  const mdUp = useMdUp()
  const magnify = Boolean(mdUp && !reduceMotion)
  const activeTitle = items.find((item) => item.active)?.title ?? ''
  const pendingTitle = useRef(activeTitle)
  const timeoutRef = useRef<number | null>(null)
  const isExiting = useRef(false as boolean)
  const [shownTitle, setShownTitle] = useState(activeTitle)
  const [exitingTitle, setExitingTitle] = useState<string | null>(null)
  pendingTitle.current = activeTitle

  useEffect(() => {
    if (!magnify) mouseX.set(Number.POSITIVE_INFINITY)
  }, [magnify, mouseX])

  useEffect(() => {
    if (reduceMotion) {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      isExiting.current = false
      setShownTitle(activeTitle)
      setExitingTitle(null)
      return
    }

    if (activeTitle === shownTitle) return
    if (isExiting.current) return

    if (!shownTitle) {
      setShownTitle(activeTitle)
      return
    }

    isExiting.current = true
    setExitingTitle(shownTitle)

    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null
      isExiting.current = false
      setExitingTitle(null)
      setShownTitle(pendingTitle.current)
    }, EXIT_MS)
  }, [activeTitle, reduceMotion, shownTitle])

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    mouseX.set(Number.POSITIVE_INFINITY)
  }, [mouseX])

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (magnify) mouseX.set(e.pageX)
    },
    [magnify, mouseX]
  )

  return (
    <motion.div
      className={cn(
        'mx-auto flex h-16 items-end gap-3 rounded-3xl border border-white/10 bg-[#171717] px-3 pb-3 shadow-lg sm:gap-4 sm:px-4',
        className
      )}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {items.map((item) => (
        <IconContainer
          exiting={item.title === exitingTitle}
          key={item.title}
          magnify={magnify}
          mouseX={mouseX}
          reduceMotion={Boolean(reduceMotion)}
          shown={item.title === shownTitle}
          {...item}
        />
      ))}
    </motion.div>
  )
}

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  download,
  external,
  active,
  fill,
  className,
  reduceMotion,
  magnify,
  shown,
  exiting,
  onNavigate,
}: FloatingDockItem & {
  exiting: boolean
  magnify: boolean
  mouseX: MotionValue<number>
  reduceMotion: boolean
  shown: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const highlight = shown && !exiting

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { width: 0, x: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 72, 40])
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 72, 40])
  const iconSizes = fill ? [36, 68, 36] : [18, 36, 18]
  const widthTransformIcon = useTransform(distance, [-150, 0, 150], iconSizes)
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], iconSizes)

  const width = useSpring(widthTransform, SPRING)
  const height = useSpring(heightTransform, SPRING)
  const widthIcon = useSpring(widthTransformIcon, SPRING)
  const heightIcon = useSpring(heightTransformIcon, SPRING)

  const onEnter = useCallback(() => {
    if (magnify) setHovered(true)
  }, [magnify])
  const onLeave = useCallback(() => setHovered(false), [])
  const handleClick = useCallback(() => {
    setHovered(false)
    onNavigate?.()
  }, [onNavigate])

  let highlightTransition:
    | typeof ENTER_TRANSITION
    | typeof EXIT_TRANSITION
    | {
        duration: number
      } = EXIT_TRANSITION
  if (reduceMotion) highlightTransition = { duration: 0 }
  else if (highlight) highlightTransition = ENTER_TRANSITION

  const fixedIcon = fill ? 36 : 18

  return (
    <a
      aria-current={active ? 'page' : undefined}
      aria-label={title}
      className={cn('relative', className)}
      download={resolveDownload(download)}
      href={href}
      {...(external ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
      onClick={handleClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <AnimatePresence>
        {magnify && hovered ? (
          <motion.div
            animate={{ opacity: 1, x: '-50%', y: 0 }}
            className="absolute -top-8 left-1/2 z-10 w-fit whitespace-nowrap rounded-md border border-white/10 bg-[#262626] px-2 py-0.5 font-medium text-white text-xs"
            exit={{ opacity: 0, x: '-50%', y: 2 }}
            initial={{ opacity: 0, x: '-50%', y: 10 }}
          >
            {title}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-full bg-[#262626]"
        ref={ref}
        style={magnify ? { height, width } : { height: 40, width: 40 }}
      >
        <motion.div
          className={cn(
            'relative z-0 flex items-center justify-center overflow-hidden',
            fill && 'rounded-full'
          )}
          style={
            magnify
              ? { height: heightIcon, width: widthIcon }
              : { height: fixedIcon, width: fixedIcon }
          }
        >
          {cloneIcon(icon)}
        </motion.div>

        <motion.div
          animate={{
            opacity: highlight ? 1 : 0,
            scale: highlight ? 1 : 0,
          }}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-[#d4d4d4]"
          initial={false}
          transition={highlightTransition}
        >
          <motion.div
            className={cn(
              'flex items-center justify-center overflow-hidden brightness-0',
              fill && 'rounded-full'
            )}
            style={
              magnify
                ? { height: heightIcon, width: widthIcon }
                : { height: fixedIcon, width: fixedIcon }
            }
          >
            {cloneIcon(icon)}
          </motion.div>
        </motion.div>
      </motion.div>
    </a>
  )
}
