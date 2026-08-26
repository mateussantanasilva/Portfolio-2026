import { motion, useReducedMotion } from 'motion/react'
import { StrokeText } from '@/components/ui/stroke-text'
import { heroTitleMark } from '@/data/hero-title-mark'
import { portfolio } from '@/data/portfolio'

export function Hero() {
  const { brand, hero } = portfolio
  const reduceMotion = useReducedMotion()
  const title = hero.title.toUpperCase()

  return (
    <section
      className="relative flex h-dvh w-full flex-col overflow-hidden bg-[#D9DDE0]"
      id="inicio"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] flex items-end justify-center"
      >
        <img
          alt=""
          className="size-full object-contain object-bottom"
          height={1080}
          src={hero.portrait}
          width={973}
        />
      </div>

      <div className="container-portfolio relative z-10 flex flex-1 flex-col py-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="font-medium text-base text-foreground sm:text-lg md:text-xl"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {brand.handle}
          </motion.p>
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl font-light text-foreground text-sm sm:max-w-md sm:text-right sm:text-base md:text-xl"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            transition={{ delay: 0.12, duration: 0.6, ease: 'easeOut' }}
          >
            {hero.bio}
          </motion.p>
        </div>
      </div>

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
    </section>
  )
}
