import { motion, useReducedMotion } from 'motion/react'
import { portfolio } from '@/data/portfolio'

export function Hero() {
  const { brand, hero } = portfolio
  const reduceMotion = useReducedMotion()

  return (
    <section
      className="relative flex h-dvh w-full flex-col overflow-hidden bg-portfolio-navy"
      id="inicio"
    >
      <img
        alt=""
        className="absolute inset-0 size-full max-w-none object-cover object-[center_20%]"
        height={1080}
        src={hero.background}
        width={1920}
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/35" />

      <div className="container-portfolio relative z-10 flex flex-1 flex-col py-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="font-medium text-base text-white sm:text-lg md:text-xl"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {brand.handle}
          </motion.p>
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl font-light text-sm text-white/95 sm:max-w-md sm:text-right sm:text-base md:text-xl"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            transition={{ delay: 0.12, duration: 0.6, ease: 'easeOut' }}
          >
            {hero.bio}
          </motion.p>
        </div>
      </div>

      <div className="relative z-10 mt-auto w-full pb-24 sm:pb-28 md:pb-32">
        <h1 className="sr-only">{hero.title}</h1>

        <div className="overflow-hidden">
          <motion.div
            animate={
              reduceMotion
                ? undefined
                : {
                    x: ['0%', '-50%'],
                  }
            }
            aria-hidden
            className="flex w-max will-change-transform"
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 32,
                    ease: 'linear',
                    repeat: Number.POSITIVE_INFINITY,
                  }
            }
          >
            {(['marquee-a', 'marquee-b'] as const).map((key) => (
              <p
                className="flex shrink-0 items-baseline whitespace-nowrap font-medium text-5xl text-white leading-none tracking-tight md:text-7xl lg:text-9xl"
                key={key}
              >
                <span className="px-4">{hero.title}</span>
              </p>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
