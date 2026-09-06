import { motion, type Transition, useReducedMotion } from 'motion/react'
import { type CSSProperties, useId, useMemo } from 'react'
import { cn } from '@/lib/utils'

export type StrokeTextFillMode = 'wipe' | 'fade' | 'none'

export interface StrokeTextLetter {
  char: string
  /** Path completo (com counters) para o preenchimento */
  d: string
  /** Contorno externo fechado (legado; preferimos todos os subpaths de `d`) */
  stroke?: string
}

function getStrokePaths(letter: StrokeTextLetter): string[] {
  const source = letter.d
  const parts = source.match(/M[^M]*/g)
  if (!parts?.length) {
    return [letter.stroke ?? source]
  }
  return parts.map((part) => {
    const trimmed = part.trim()
    return /[zZ]\s*$/.test(trimmed) ? trimmed : `${trimmed}Z`
  })
}

export interface StrokeTextProps {
  className?: string
  drawDuration?: number
  fillColor?: string
  fillDelay?: number
  fillMode?: StrokeTextFillMode
  height: number
  label: string
  letters: readonly StrokeTextLetter[]
  reverse?: boolean
  stagger?: number
  strokeColor?: string
  strokeWidth?: number
  style?: CSSProperties
  viewBox: string
  width: number
}

export function StrokeText({
  letters,
  viewBox,
  width,
  height,
  label,
  strokeColor = 'currentColor',
  fillColor = 'currentColor',
  strokeWidth = 2.2,
  drawDuration = 1.6,
  fillDelay = 0.2,
  stagger = 0.05,
  fillMode = 'wipe',
  reverse = false,
  className,
  style,
}: StrokeTextProps) {
  const reduceMotion = useReducedMotion()
  const rawId = useId()
  const wipeId = `stroke-text-wipe-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  const order = useMemo(() => {
    const indexes = letters.map((_, index) => index)
    return reverse ? [...indexes].reverse() : indexes
  }, [letters, reverse])

  const drawEase: Transition['ease'] = [0.22, 1, 0.36, 1]
  const fillDuration = Math.max(0.4, drawDuration * 0.5)
  const fillEnabled = fillMode !== 'none'
  const useWipe = fillEnabled && fillMode === 'wipe'
  const strokeFadeDelay = drawDuration + fillDelay + fillDuration * 0.35

  if (reduceMotion) {
    return (
      <span
        aria-label={label}
        className={cn('block w-full leading-0', className)}
        role="img"
        style={style}
      >
        <svg
          aria-hidden
          className="block h-auto w-full"
          fill={fillColor}
          preserveAspectRatio="xMidYMid meet"
          viewBox={viewBox}
        >
          {letters.map((letter) => (
            <path d={letter.d} key={letter.d} />
          ))}
        </svg>
      </span>
    )
  }

  return (
    <span
      aria-label={label}
      className={cn('block w-full leading-0', className)}
      role="img"
      style={style}
    >
      <svg
        aria-hidden
        className="block h-auto w-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        viewBox={viewBox}
      >
        {useWipe ? (
          <defs>
            <clipPath clipPathUnits="userSpaceOnUse" id={wipeId}>
              <motion.rect
                animate={{ width }}
                height={height}
                initial={{ width: 0 }}
                transition={{
                  delay: drawDuration + fillDelay,
                  duration: fillDuration,
                  ease: [0.4, 0, 0.2, 1],
                }}
                width={0}
                x={0}
                y={0}
              />
            </clipPath>
          </defs>
        ) : null}

        {order.map((index, orderIndex) => {
          const letter = letters[index]
          const strokePaths = getStrokePaths(letter)
          const delay = orderIndex * stagger

          return strokePaths.map((strokePath) => (
            <motion.path
              animate={{ opacity: 0, pathLength: 1 }}
              d={strokePath}
              fill="none"
              initial={{ opacity: 1, pathLength: 0 }}
              key={`stroke-${strokePath}`}
              stroke={strokeColor}
              strokeLinecap="butt"
              strokeLinejoin="round"
              strokeWidth={strokeWidth}
              transition={{
                opacity: {
                  delay: strokeFadeDelay,
                  duration: 0.35,
                  ease: 'easeOut',
                },
                pathLength: {
                  delay,
                  duration: drawDuration,
                  ease: drawEase,
                },
              }}
            />
          ))
        })}

        <g clipPath={useWipe ? `url(#${wipeId})` : undefined}>
          {order.map((index, orderIndex) => {
            const letter = letters[index]
            const delay = orderIndex * stagger

            if (useWipe) {
              return (
                <path
                  d={letter.d}
                  fill={fillColor}
                  fillRule="evenodd"
                  key={`fill-${letter.d}`}
                  stroke="none"
                />
              )
            }

            if (!fillEnabled) {
              return null
            }

            return (
              <motion.path
                animate={{ opacity: 1 }}
                d={letter.d}
                fill={fillColor}
                fillRule="evenodd"
                initial={{ opacity: 0 }}
                key={`fill-${letter.d}`}
                stroke="none"
                transition={{
                  delay: drawDuration + fillDelay + delay,
                  duration: fillDuration,
                  ease: 'easeOut',
                }}
              />
            )
          })}
        </g>
      </svg>
    </span>
  )
}
