import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { cn } from '@/lib/utils'

function clamp(v: number, a: number, b: number): number {
  if (v < a) return a
  if (v > b) return b
  return v
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1)
  return t * t * (3 - 2 * t)
}

export interface ScrollExpandProps {
  alt?: string
  children?: ReactNode
  className?: string
  enabled?: boolean
  endHeight?: number
  endRadius?: number
  endWidth?: number
  holdDistance?: number
  /**
   * Altura máxima do card expandido (px). O stage não usa 100vh: fica o
   * card + a margem `section-tight`, centralizado na viewport.
   */
  maxCardHeight?: number
  media?: ReactNode
  mediaType?: 'image' | 'video'
  mediaZoom?: number
  /** Altura mínima do card expandido (px). */
  minCardHeight?: number
  /** Notifica a altura medida do conteúdo (para decidir se o reveal cabe na viewport). */
  onContentHeight?: (height: number) => void
  overlayClassName?: string
  overlayScrim?: number
  poster?: string
  scrollDistance?: number
  scrollHint?: ReactNode
  smoothing?: number
  src?: string
  startHeight?: number
  startRadius?: number
  startWidth?: number
  style?: CSSProperties
  teaser?: ReactNode
  title?: string
  useWindowScroll?: boolean
}

function renderDefaultMedia({
  alt,
  mediaType,
  poster,
  src,
}: {
  alt: string
  mediaType: 'image' | 'video'
  poster: string
  src: string
}) {
  if (mediaType === 'video') {
    return (
      <video
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        loop
        muted
        playsInline
        poster={poster}
        src={src}
      />
    )
  }

  return (
    <img
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover"
      draggable={false}
      src={src}
    />
  )
}

/** Espelha `section-pt-tight` / `section-pb-tight` em `src/index.css`. */
function sectionTightPaddingPx(viewportWidth: number): number {
  if (viewportWidth >= 1024) return 64
  if (viewportWidth >= 768) return 48
  return 32
}

/** Card cresce com o conteúdo, com piso/teto; nunca passa da viewport. */
function resolveCardHeight({
  contentHeight,
  maxCardHeight,
  minCardHeight,
  viewportHeight,
}: {
  contentHeight: number
  maxCardHeight?: number
  minCardHeight?: number
  viewportHeight: number
}) {
  const floor = minCardHeight ?? 0
  const ceiling = Math.min(viewportHeight, maxCardHeight ?? viewportHeight)
  const natural = Math.max(contentHeight, floor)
  return clamp(natural, Math.min(floor, ceiling), ceiling)
}

/**
 * Stage = card (ou viewport menos a margem tight, o que for maior).
 * Assim o vazio ao redor do painel segue o ritmo das outras seções,
 * em vez de engolir o resto da viewport.
 */
function resolveStageHeight({
  contentHeight,
  maxCardHeight,
  minCardHeight,
  viewportHeight,
  viewportWidth,
}: {
  contentHeight: number
  maxCardHeight?: number
  minCardHeight?: number
  viewportHeight: number
  viewportWidth: number
}) {
  const contentCard = resolveCardHeight({
    contentHeight,
    maxCardHeight,
    minCardHeight,
    viewportHeight,
  })
  const inset = sectionTightPaddingPx(viewportWidth)
  const spaced = Math.max(0, viewportHeight - 2 * inset)
  return Math.min(viewportHeight, Math.max(contentCard, spaced))
}

export default function ScrollExpand({
  src = '',
  media,
  mediaType = 'image',
  poster = '',
  alt = '',
  title = '',
  teaser,
  scrollHint = '',
  startWidth = 42,
  startHeight = 58,
  endWidth = 100,
  endHeight = 100,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0.45,
  useWindowScroll = false,
  enabled = true,
  minCardHeight,
  maxCardHeight,
  onContentHeight,
  children,
  className = '',
  overlayClassName = '',
  style,
}: ScrollExpandProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)

  const propsRef = useRef({
    enabled,
    endHeight,
    endRadius,
    endWidth,
    holdDistance,
    maxCardHeight,
    mediaZoom,
    minCardHeight,
    onContentHeight,
    overlayScrim,
    scrollDistance,
    smoothing,
    startHeight,
    startRadius,
    startWidth,
    useWindowScroll,
  })
  propsRef.current = {
    enabled,
    endHeight,
    endRadius,
    endWidth,
    holdDistance,
    maxCardHeight,
    mediaZoom,
    minCardHeight,
    onContentHeight,
    overlayScrim,
    scrollDistance,
    smoothing,
    startHeight,
    startRadius,
    startWidth,
    useWindowScroll,
  }

  /** start/end height efetivos (%) — recalculados no measure quando o stage ≠ 100vh */
  const startHeightRef = useRef(startHeight)
  const endHeightRef = useRef(endHeight)

  const applyProgress = useCallback((p: number) => {
    const frame = frameRef.current
    const mediaEl = mediaRef.current
    // Refs are null until mount; Biome's React types treat `.current` as permanently null.
    // biome-ignore lint/suspicious/noUnnecessaryConditions: ref null until mounted
    if (!(frame && mediaEl)) return
    const c = propsRef.current

    const e = smoothstep(0, 1, p)
    const resolvedStartHeight = startHeightRef.current
    const resolvedEndHeight = endHeightRef.current

    const w = c.startWidth + (c.endWidth - c.startWidth) * e
    const h =
      resolvedStartHeight + (resolvedEndHeight - resolvedStartHeight) * e
    const ix = Math.max(0, (100 - w) / 2)
    const iy = Math.max(0, (100 - h) / 2)
    const r = c.startRadius + (c.endRadius - c.startRadius) * e
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`

    mediaEl.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`

    const scrim = scrimRef.current
    // biome-ignore lint/suspicious/noUnnecessaryConditions: ref null until mounted
    if (scrim) {
      scrim.style.opacity = `${c.overlayScrim * e}`
    }

    const titleEl = titleRef.current
    // biome-ignore lint/suspicious/noUnnecessaryConditions: ref null until mounted
    if (titleEl) {
      const out = smoothstep(0.4, 0.88, p)
      titleEl.style.opacity = `${1 - out}`
      titleEl.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`
    }

    const hintEl = hintRef.current
    // biome-ignore lint/suspicious/noUnnecessaryConditions: ref null until mounted
    if (hintEl) {
      const gone = smoothstep(0, 0.12, p)
      hintEl.style.opacity = `${1 - gone}`
      hintEl.style.transform = `translate3d(0, ${8 * gone}px, 0)`
    }

    const overlayEl = overlayRef.current
    // biome-ignore lint/suspicious/noUnnecessaryConditions: ref null until mounted
    if (overlayEl) {
      const inn = smoothstep(0.68, 1, p)
      overlayEl.style.opacity = `${inn}`
      overlayEl.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`
      overlayEl.style.pointerEvents = inn > 0.85 ? 'auto' : 'none'
    }
  }, [])

  useEffect(() => {
    const root = rootRef.current
    const track = trackRef.current
    const stage = stageRef.current
    // biome-ignore lint/suspicious/noUnnecessaryConditions: ref null until mounted
    if (!(root && track && stage)) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    let raf = 0
    let current = 0
    let target = 0
    let stageH = 0
    let running = false

    const measure = () => {
      const c = propsRef.current
      const viewportH = c.useWindowScroll
        ? window.innerHeight
        : root.clientHeight
      if (viewportH <= 0) return

      const contentH = contentRef.current?.offsetHeight ?? 0
      c.onContentHeight?.(contentH)

      // Sem efeito de revelar: card no fluxo — altura automática, sem stage fixo.
      if (!c.enabled) {
        stageH = Math.max(contentH, c.minCardHeight ?? 0)
        stage.style.height = ''
        stage.style.top = ''
        stage.style.clipPath = ''
        track.style.height = ''
        if (mediaRef.current) {
          mediaRef.current.style.transform = ''
        }
        startHeightRef.current = c.startHeight
        endHeightRef.current = 100
        return
      }

      const hasCardBounds =
        c.minCardHeight !== undefined || c.maxCardHeight !== undefined

      if (hasCardBounds) {
        const viewportW = window.innerWidth
        stageH = resolveStageHeight({
          contentHeight: contentH,
          maxCardHeight: c.maxCardHeight,
          minCardHeight: c.minCardHeight,
          viewportHeight: viewportH,
          viewportWidth: viewportW,
        })
        endHeightRef.current = 100
        // Teaser mantém o tamanho em px de startHeight% da viewport (não encolhe com o stage).
        startHeightRef.current = clamp(
          ((c.startHeight / 100) * viewportH * 100) / stageH,
          0,
          99
        )
        stage.style.top = `${Math.max(0, (viewportH - stageH) / 2)}px`
      } else {
        stageH = viewportH
        startHeightRef.current = c.startHeight
        endHeightRef.current = c.endHeight
        stage.style.top = '0px'
      }

      stage.style.height = `${stageH}px`
      track.style.height = `${stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))}px`

      const w = root.clientWidth || stageH
      stage.style.setProperty(
        '--se-title-size',
        `${clamp(w * 0.075, 20, 84)}px`
      )
    }

    const readProgress = () => {
      const c = propsRef.current
      if (!c.enabled) return 1
      const span = stageH * Math.max(0.01, c.scrollDistance)
      if (c.useWindowScroll) {
        const { top } = track.getBoundingClientRect()
        return clamp(-top / span, 0, 1)
      }
      return clamp(root.scrollTop / span, 0, 1)
    }

    const tick = () => {
      const c = propsRef.current
      const k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing))
      current += (target - current) * k
      if (Math.abs(target - current) < 0.0004) {
        current = target
        running = false
      }
      applyProgress(current)
      raf = running ? requestAnimationFrame(tick) : 0
    }

    const kick = () => {
      if (running) return
      running = true
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      target = readProgress()
      if (propsRef.current.smoothing <= 0 || reduceMotion) {
        current = target
        applyProgress(current)
        return
      }
      kick()
    }

    const onResize = () => {
      measure()
      target = readProgress()
      current = target
      applyProgress(current)
    }

    measure()
    target = readProgress()
    current = target
    applyProgress(current)

    const scroller: Window | HTMLDivElement = useWindowScroll ? window : root
    scroller.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    const ro = new ResizeObserver(onResize)
    ro.observe(root)
    const contentEl = contentRef.current
    if (contentEl) ro.observe(contentEl)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      scroller.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      ro.disconnect()
    }
  }, [applyProgress, enabled, useWindowScroll])

  const renderedMedia =
    media ?? renderDefaultMedia({ alt, mediaType, poster, src })

  // Modo estático (mobile / telas grandes / reduced-motion): card no fluxo
  // do documento. `key` evita reusar o nó do modo expand (clip-path inline).
  if (!enabled) {
    return (
      <div
        className={cn('relative w-full touch-pan-y', className)}
        ref={rootRef}
        style={style}
      >
        <div className="relative w-full" ref={trackRef}>
          <div
            className="relative isolate w-full overflow-hidden rounded-[40px] bg-portfolio-brand-surface [--se-title-size:4rem]"
            ref={stageRef}
          >
            {/* Mesmo padrão da seção Atuação: fundo absolute preenchendo o card */}
            <div
              className="pointer-events-none absolute inset-0 z-0 size-full"
              ref={mediaRef}
              style={{ clipPath: 'none', transform: 'none' }}
            >
              {renderedMedia}
            </div>
            <div
              className={cn(
                'relative z-10 w-full min-w-0 touch-pan-y',
                overlayClassName
              )}
              ref={overlayRef}
            >
              <div className="w-full min-w-0" ref={contentRef}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative h-full w-full touch-pan-y',
        !useWindowScroll &&
          'overflow-y-auto overflow-x-hidden overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
      ref={rootRef}
      style={style}
    >
      <div className="relative w-full" ref={trackRef}>
        <div
          className="sticky top-0 w-full touch-pan-y overflow-hidden [--se-title-size:4rem]"
          ref={stageRef}
        >
          <div
            className="absolute inset-0 [clip-path:inset(21%_29%_21%_29%_round_24px)] [will-change:clip-path]"
            ref={frameRef}
          >
            <div
              className="absolute inset-0 origin-center select-none [will-change:transform]"
              ref={mediaRef}
            >
              {renderedMedia}
            </div>
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.75),rgba(0,0,0,0.1)_45%,rgba(0,0,0,0.35))] opacity-0"
              ref={scrimRef}
            />
            {children ? (
              <div
                className={cn(
                  'absolute inset-0 flex touch-pan-y flex-col items-center justify-center overflow-visible p-[6%] text-center opacity-0 [will-change:opacity,transform]',
                  overlayClassName
                )}
                ref={overlayRef}
              >
                <div className="w-full min-w-0 shrink-0" ref={contentRef}>
                  {children}
                </div>
              </div>
            ) : null}
          </div>
          {teaser || title ? (
            <div
              className="pointer-events-none absolute inset-0 m-0 flex items-center justify-center px-[6%] text-center [will-change:opacity,transform]"
              ref={titleRef}
            >
              {teaser ?? (
                <span className="font-heading font-medium text-white leading-none tracking-tight [font-size:var(--se-title-size)] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]">
                  {title}
                </span>
              )}
            </div>
          ) : null}
          {scrollHint ? (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center text-center text-[0.8125rem] text-white/55 tracking-[0.02em] [will-change:opacity,transform]"
              ref={hintRef}
            >
              {scrollHint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
