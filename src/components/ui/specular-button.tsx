import { useReducedMotion } from 'motion/react'
import { Color, Mesh, Program, Renderer, Triangle } from 'ogl'
import {
  type CSSProperties,
  type MouseEventHandler,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
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

interface ShaderProps {
  autoAnimate: boolean
  baseColor: string
  followMouse: boolean
  intensity: number
  lineColor: string
  proximity: number
  radius: number
  shineFade: number
  shineSize: number
  speed: number
  thickness: number
}

const PAD = 20

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
    baseColor: '#8a8a8a',
    lineColor: '#171717',
    textColor: '#141414',
    tint: '#ffffff',
    tintOpacity: 0,
  },
}

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float shapeSDF(vec2 p) { return sdRoundedRect(p, uHalfSize, uRadius); }

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = shapeSDF(p);
  vec2 L = vec2(cos(uAngle), sin(uAngle));

  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;

  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float line = gaussianLine(d, uThickness);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float hi = line * rim * edgeClamp * uIntensity;

  vec3 col = uBaseColor * base + uLineColor * hi;
  float a = clamp(base + hi, 0.0, 1.0);
  fragColor = vec4(col, a);
}
`

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
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
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
  const themeTokens = THEMES[theme]
  const resolvedTint = tint ?? themeTokens.tint
  const resolvedTintOpacity = tintOpacity ?? themeTokens.tintOpacity
  const resolvedTextColor = textColor ?? themeTokens.textColor
  const resolvedLineColor = lineColor ?? themeTokens.lineColor
  const resolvedBaseColor = baseColor ?? themeTokens.baseColor

  const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const fxRef = useRef<HTMLSpanElement>(null)
  const propsRef = useRef<ShaderProps>({} as ShaderProps)

  propsRef.current = {
    autoAnimate,
    baseColor: resolvedBaseColor,
    followMouse: Boolean(followMouse && !reduceMotion),
    intensity,
    lineColor: resolvedLineColor,
    proximity,
    radius,
    shineFade,
    shineSize,
    speed,
    thickness,
  }

  useEffect(() => {
    if (reduceMotion) return

    const btn = btnRef.current
    const fx = fxRef.current
    // biome-ignore lint/suspicious/noUnnecessaryConditions: refs null until mount
    if (!(btn && fx)) return

    let disposed = false
    let raf = 0
    let cleanupGl: (() => void) | undefined

    try {
      const dpr = window.devicePixelRatio || 1
      const renderer = new Renderer({
        alpha: true,
        antialias: true,
        dpr,
        premultipliedAlpha: true,
      })
      const { gl } = renderer
      const canvas = gl.canvas as HTMLCanvasElement
      gl.clearColor(0, 0, 0, 0)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

      const geometry = new Triangle(gl)
      if (geometry.attributes.uv) {
        // biome-ignore lint/performance/noDelete: ogl Triangle UV cleanup
        delete geometry.attributes.uv
      }

      const program = new Program(gl, {
        fragment: FRAG,
        uniforms: {
          uAngle: { value: 2.4 },
          uBaseColor: { value: [0.32, 0.32, 0.32] },
          uBaseWidth: { value: dpr },
          uCenter: { value: [0, 0] },
          uHalfSize: { value: [1, 1] },
          uIntensity: { value: 1 },
          uLineColor: { value: [1, 1, 1] },
          uPx: { value: dpr },
          uRadius: { value: 0 },
          uShineFade: { value: 0.7 },
          uShineSize: { value: 0.17 },
          uThickness: { value: 1 },
        },
        vertex: VERT,
      })

      const mesh = new Mesh(gl, { geometry, program })
      fx.appendChild(canvas)

      const sizeRef = { h: 1, w: 1 }
      const resize = () => {
        const rect = btn.getBoundingClientRect()
        const w = rect.width
        const h = rect.height
        sizeRef.w = w
        sizeRef.h = h
        renderer.setSize(w + PAD * 2, h + PAD * 2)
        program.uniforms.uCenter.value = [
          (PAD + w / 2) * dpr,
          (PAD + h / 2) * dpr,
        ]
        program.uniforms.uHalfSize.value = [(w / 2) * dpr, (h / 2) * dpr]
      }
      const ro = new ResizeObserver(resize)
      ro.observe(btn)
      resize()

      let pointerAngle: number | null = null
      let proximityT = 0
      const onPointerMove = (e: PointerEvent) => {
        const rect = btn.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right)
        const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom)
        const dist = Math.hypot(dx, dy)
        if (dist === 0) {
          const nx = (e.clientX - cx) / (rect.width / 2)
          const ny = (cy - e.clientY) / (rect.height / 2)
          pointerAngle =
            Math.atan2(2 / rect.height, -2 / rect.width) + nx * 0.3 + ny * 0.15
        } else {
          pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx)
        }
        const t = Math.max(
          0,
          1 - dist / Math.max(propsRef.current.proximity, 1)
        )
        proximityT = t * t * (3 - 2 * t)
      }
      window.addEventListener('pointermove', onPointerMove)

      let angle = 2.4
      let idleAngle = 2.4
      let bright = 0
      let last = performance.now()

      const lineC = new Color()
      const baseC = new Color()

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

        const brightTarget = p.autoAnimate ? 1 : proximityT
        bright += (brightTarget - bright) * (1 - Math.exp(-dt * 8))

        lineC.set(p.lineColor)
        baseC.set(p.baseColor)
        program.uniforms.uAngle.value = angle
        program.uniforms.uRadius.value =
          Math.min(p.radius, Math.min(sizeRef.w, sizeRef.h) / 2) * dpr
        program.uniforms.uLineColor.value = [lineC.r, lineC.g, lineC.b]
        program.uniforms.uBaseColor.value = [baseC.r, baseC.g, baseC.b]
        program.uniforms.uIntensity.value = p.intensity * bright
        program.uniforms.uShineSize.value = (p.shineSize * Math.PI) / 180
        program.uniforms.uShineFade.value = (p.shineFade * Math.PI) / 180
        program.uniforms.uThickness.value = p.thickness * dpr
        renderer.render({ scene: mesh })
      }
      raf = requestAnimationFrame(update)

      cleanupGl = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        window.removeEventListener('pointermove', onPointerMove)
        if (canvas.parentNode === fx) {
          fx.removeChild(canvas)
        }
        gl.getExtension('WEBGL_lose_context')?.loseContext()
      }
    } catch {
      // WebGL indisponível — botão permanece estático
    }

    return () => {
      disposed = true
      cleanupGl?.()
    }
  }, [reduceMotion])

  const sharedClassName = cn(
    'relative m-0 inline-flex cursor-pointer items-center justify-center border-none font-heading font-medium leading-none tracking-[0.01em] outline-none transition-transform duration-150 [backdrop-filter:blur(var(--sb-blur))] [background:color-mix(in_srgb,var(--sb-tint)_calc(var(--sb-tint-opacity)_*_100%),transparent)] [border-radius:var(--sb-radius)] [color:var(--sb-text-color)] focus-visible:outline-2 focus-visible:outline-offset-[3px] active:scale-[0.97] disabled:cursor-default disabled:opacity-55 disabled:active:scale-100',
    theme === 'outline' && 'shadow-none ring-1 ring-[#aeaeae]',
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
  } as CSSProperties

  const content = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-5 z-[1] [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
        ref={fxRef}
      />
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
