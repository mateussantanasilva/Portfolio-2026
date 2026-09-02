import { ArrowDown } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { HeroSocials } from '@/components/hero-socials'
import { BubbleEntrance } from '@/components/reveal'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import SpecularButton from '@/components/ui/specular-button'
import { StrokeText } from '@/components/ui/stroke-text'
import { heroTitleMark } from '@/data/hero-title-mark'
import { portfolio } from '@/data/portfolio'
import { useTheme } from '@/providers/theme-provider'

export function Hero() {
  const { brand, hero } = portfolio
  const reduceMotion = useReducedMotion()
  const { setTheme, theme } = useTheme()
  const title = hero.title.toUpperCase()

  return (
    <section
      className="relative flex h-dvh w-full flex-col overflow-hidden bg-portfolio-hero-bg"
      id="inicio"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] flex items-end justify-center overflow-hidden"
      >
        <img
          alt=""
          className="size-full origin-bottom translate-y-[16%] scale-[1.14] object-contain object-bottom sm:translate-y-[17%] sm:scale-[1.16]"
          height={1080}
          src={hero.portrait}
          width={973}
        />
      </div>

      <div className="container-portfolio relative z-10 flex flex-1 flex-col py-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="font-medium text-base text-foreground sm:text-lg md:text-xl"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            {brand.handle}
          </motion.p>
          <BubbleEntrance className="flex sm:justify-end" delay={0.08}>
            <AnimatedThemeToggler
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-transparent text-foreground transition-opacity hover:opacity-70 md:size-12"
              onThemeChange={setTheme}
              theme={theme}
            />
          </BubbleEntrance>
        </div>
      </div>

      <HeroSocials />

      <div className="pointer-events-none absolute inset-x-0 top-[26%] z-[1] flex justify-center text-foreground sm:top-[28%]">
        <h1 className="sr-only">{title}</h1>
        <div className="container-portfolio">
          <StrokeText
            drawDuration={1.5}
            fillColor="currentColor"
            fillDelay={0.15}
            fillMode="wipe"
            height={heroTitleMark.height}
            label={title}
            letters={heroTitleMark.letters}
            stagger={0.045}
            strokeColor="currentColor"
            strokeWidth={2.4}
            viewBox={heroTitleMark.viewBox}
            width={heroTitleMark.width}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-24 z-20 sm:bottom-28">
        <div className="container-portfolio flex justify-end">
          <BubbleEntrance className="pointer-events-auto" delay={0.45}>
            <SpecularButton
              aria-label="Ir para a seção sobre"
              className="size-14 rounded-full md:size-[4.5rem]"
              href="#sobre"
              size="icon"
              theme="outline"
            >
              <motion.span
                animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
                className="inline-flex"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        delay: 1,
                        duration: 1.8,
                        ease: 'easeInOut',
                        repeat: Number.POSITIVE_INFINITY,
                      }
                }
              >
                <ArrowDown className="size-6 md:size-7" strokeWidth={1.75} />
              </motion.span>
            </SpecularButton>
          </BubbleEntrance>
        </div>
      </div>
    </section>
  )
}
