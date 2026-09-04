import { useReducedMotion } from 'motion/react'
import {
  type CSSProperties,
  type MouseEventHandler,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react'
import { cn } from '@/lib/utils'

type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'
type SpecularTheme = 'accent' | 'dark' | 'light' | 'ghost' | 'outline'

export interface SpecularButtonProps {
  'aria-label'?: string
  autoAnimate?: boolean
  baseColor?: string
  blur?: number
  children?: ReactNode
  className?: string
  disabled?: boolean
  followMouse?: boolean
  href?: string
  intensity?: number
  lineColor?: string
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  proximity?: number
  radius?: number
  rel?: string
  shineFade?: number
  shineSize?: number
  size?: ButtonSize
  speed?: number
  target?: string
  textColor?: string
  theme?: SpecularTheme
  thickness?: number
  tint?: string
  tintOpacity?: number
  type?: 'button' | 'submit' | 'reset'
}

const SIZES: Record<ButtonSize, string> = {
  icon: 'size-8 p-0 md:size-12',
  lg: 'gap-2 px-10 py-[18px] text-[1.15rem]',
  md: 'gap-2 px-8 py-3.5 text-base',
  sm: 'gap-2 px-4 py-2 text-sm',
}

const THEMES: Record<
  SpecularTheme,
  {
    baseColor: string
    lineColor: string
    textColor: string
    tint: string
    tintOpacity: number
  }
> = {
  accent: {
    baseColor: '#2f45c0',
    lineColor: '#ffffff',
    textColor: '#ffffff',
    tint: '#455ce9',
    tintOpacity: 1,
  },
  dark: {
    baseColor: '#3d4658',
    lineColor: '#ffffff',
    textColor: '#ffffff',
    tint: '#0f1a2e',
    tintOpacity: 1,
  },
  ghost: {
    baseColor: '#6b7280',
    lineColor: '#ffffff',
    textColor: '#ffffff',
    tint: '#ffffff',
    tintOpacity: 0.08,
  },
  light: {
    baseColor: '#9ca3af',
    lineColor: '#ffffff',
    textColor: '#0a0a0a',
    tint: '#f8fafc',
    tintOpacity: 1,
  },
  outline: {
    baseColor: 'var(--specular-outline-base)',
    lineColor: 'var(--specular-outline-line)',
    textColor: 'var(--specular-outline-text)',
    tint: '#ffffff',
    tintOpacity: 0,
  },
}

function readCssColor(variable: string, fallback: string) {
  if (typeof document === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim()
  return value || fallback
}

function subscribeToTheme(callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(document.documentElement, {
    attributeFilter: ['class'],
    attributes: true,
  })
  return () => observer.disconnect()
}

function useThemeSnapshot() {
  return useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.classList.contains('dark'),
    () => false
  )
}

function resolveThemeTokens(theme: SpecularTheme, isDark: boolean) {
  const tokens = THEMES[theme]
  if (theme !== 'outline') return tokens

  return {
    ...tokens,
    baseColor: readCssColor(
      '--specular-outline-base',
      isDark ? '#9ca3af' : '#8a8a8a'
    ),
    lineColor: readCssColor(
      '--specular-outline-line',
      isDark ? '#e5e5e5' : '#171717'
    ),
    textColor: readCssColor(
      '--specular-outline-text',
      isDark ? '#f5f5f5' : '#141414'
    ),
  }
}

/**
 * Botão specular 100% interno (CSS + JS leve).
 * Antes dependia de OGL/WebGL e falhava em silêncio — o anel agora
 * sempre renderiza; o brilho segue o ponteiro quando disponível.
 */
export default function SpecularButton({
  'aria-label': ariaLabel,
  children = 'Get Started',
  size = 'md',
  radius = 999,
  theme = 'accent',
  tint,
  tintOpacity,
  blur = 0,
  textColor,
  lineColor,
  baseColor,
  intensity = 1,
  shineSize: _shineSize = 10,
  shineFade: _shineFade = 40,
  thickness: _thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  href,
  rel,
  target,
}: SpecularButtonProps) {
  const reduceMotion = useReducedMotion()
  const isDark = useThemeSnapshot()
  const themeTokens = useMemo(
    () => resolveThemeTokens(theme, isDark),
    [isDark, theme]
  )
  const resolvedTint = tint ?? themeTokens.tint
  const resolvedTintOpacity = tintOpacity ?? themeTokens.tintOpacity
  const resolvedTextColor = textColor ?? themeTokens.textColor
  const resolvedLineColor = lineColor ?? themeTokens.lineColor
  const resolvedBaseColor = baseColor ?? themeTokens.baseColor

  const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const propsRef = useRef({
    autoAnimate,
    followMouse: Boolean(followMouse && !reduceMotion),
    intensity,
    proximity,
    speed,
  })

  propsRef.current = {
    autoAnimate,
    followMouse: Boolean(followMouse && !reduceMotion),
    intensity,
    proximity,
    speed,
  }

  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return

    // Estado estático legível — anel base sempre visível
    btn.style.setProperty('--sb-shine-angle', '140deg')
    btn.style.setProperty('--sb-shine-bright', reduceMotion ? '0.55' : '0.4')

    if (reduceMotion) return

    let disposed = false
    let raf = 0
    let angle = 2.4
    let idleAngle = 2.4
    let bright = 0.4
    let pointerAngle: number | null = null
    let proximityT = 0
    let last = performance.now()

    const onPointerMove = (e: PointerEvent) => {
      const rect = btn.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right)
      const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom)
      const dist = Math.hypot(dx, dy)

      if (dist === 0) {
        const nx = (e.clientX - cx) / Math.max(rect.width / 2, 1)
        const ny = (cy - e.clientY) / Math.max(rect.height / 2, 1)
        pointerAngle = Math.atan2(ny, nx)
      } else {
        pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx)
      }

      const t = Math.max(
        0,
        1 - dist / Math.max(propsRef.current.proximity, 1)
      )
      proximityT = t * t * (3 - 2 * t)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })

    const update = (now: number) => {
      if (disposed) return
      raf = requestAnimationFrame(update)

      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const p = propsRef.current

      idleAngle += p.speed * dt
      const steer =
        p.followMouse &&
        pointerAngle !== null &&
        (!p.autoAnimate || proximityT > 0)
      const targetAngle = steer ? (pointerAngle ?? idleAngle) : idleAngle
      const diff =
        ((targetAngle - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI
      angle += diff * (1 - Math.exp(-dt * 7))

      const brightTarget = p.autoAnimate ? 1 : 0.4 + proximityT * 0.6
      bright += (brightTarget - bright) * (1 - Math.exp(-dt * 8))

      btn.style.setProperty('--sb-shine-angle', `${(angle * 180) / Math.PI}deg`)
      btn.style.setProperty(
        '--sb-shine-bright',
        String(Math.min(1, bright * p.intensity))
      )
    }

    raf = requestAnimationFrame(update)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [reduceMotion, intensity, autoAnimate, followMouse, proximity, speed])

  const sharedClassName = cn(
    'specular-button relative m-0 inline-flex cursor-pointer items-center justify-center border-none font-heading font-medium leading-none tracking-[0.01em] outline-none transition-transform duration-150 [backdrop-filter:blur(var(--sb-blur))] [background:color-mix(in_srgb,var(--sb-tint)_calc(var(--sb-tint-opacity)_*_100%),transparent)] [border-radius:var(--sb-radius)] [color:var(--sb-text-color)] focus-visible:outline-2 focus-visible:outline-offset-[3px] active:scale-[0.97] disabled:cursor-default disabled:opacity-55 disabled:active:scale-100',
    theme === 'outline' && 'shadow-none ring-1 ring-border',
    theme !== 'outline' &&
      'shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.18)]',
    SIZES[size],
    className
  )

  const sharedStyle = {
    '--sb-blur': `${blur}px`,
    '--sb-radius': `${radius}px`,
    '--sb-text-color': resolvedTextColor,
    '--sb-tint': resolvedTint,
    '--sb-tint-opacity': resolvedTintOpacity,
    '--sb-line': resolvedLineColor,
    '--sb-base': resolvedBaseColor,
    '--sb-shine-angle': '140deg',
    '--sb-shine-bright': '0.4',
  } as CSSProperties

  const content = (
    <>
      <span aria-hidden className="specular-button__rim" />
      <span className="relative z-[2] inline-flex items-center gap-[inherit]">
        {children}
      </span>
    </>
  )

  if (href) {
    return (
      <a
        aria-disabled={disabled || undefined}
        aria-label={ariaLabel}
        className={sharedClassName}
        href={disabled ? undefined : href}
        onClick={onClick}
        ref={btnRef as RefObject<HTMLAnchorElement>}
        rel={rel}
        style={sharedStyle}
        target={target}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      aria-label={ariaLabel}
      className={sharedClassName}
      disabled={disabled}
      onClick={onClick}
      ref={btnRef as RefObject<HTMLButtonElement>}
      style={sharedStyle}
      type={type}
    >
      {content}
    </button>
  )
}
