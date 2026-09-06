import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { BrandSurface } from '@/components/brand-surface'
import { SectionDescription } from '@/components/reveal'
import { SectionTitle } from '@/components/section-title'
import { ShinySurface } from '@/components/ui/shiny-text'
import { portfolio } from '@/data/portfolio'
import { CARD_IN_VIEW, CARD_STAGGER, cardSpring, REVEAL_Y } from '@/lib/motion'
import { cn } from '@/lib/utils'

const serviceHoverTransition = {
  damping: 24,
  mass: 0.85,
  stiffness: 220,
  type: 'spring' as const,
}

interface ServiceItem {
  description: string
  icon: string
  name: string
}

interface ServiceCardProps {
  index: number
  isDimmed: boolean
  isHovered: boolean
  item: ServiceItem
  onHoverStart: () => void
}

function ServiceCard({
  index,
  isDimmed,
  isHovered,
  item,
  onHoverStart,
}: ServiceCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, CARD_IN_VIEW)
  const reduceMotion = useReducedMotion()
  const revealed = Boolean(reduceMotion) || inView

  return (
    <motion.div
      animate={
        revealed
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.96, y: REVEAL_Y }
      }
      className="h-full"
      initial={false}
      ref={ref}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              ...cardSpring,
              delay: index * CARD_STAGGER,
            }
      }
    >
      <motion.article
        animate={
          reduceMotion
            ? undefined
            : {
                borderColor: isHovered
                  ? 'rgba(255,255,255,0.22)'
                  : 'rgba(255,255,255,0.1)',
                filter: isDimmed ? 'blur(2px)' : 'blur(0px)',
                opacity: isDimmed ? 0.4 : 1,
                scale: isHovered ? 1.02 : isDimmed ? 0.97 : 1,
                y: isHovered ? -6 : 0,
              }
        }
        className="relative isolate flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 p-4 backdrop-blur-sm will-change-transform sm:gap-8 sm:p-8"
        initial={false}
        onHoverStart={onHoverStart}
        style={{ zIndex: isHovered ? 2 : 1 }}
        transition={reduceMotion ? { duration: 0 } : serviceHoverTransition}
      >
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-500',
            isHovered ? 'bg-white/8' : 'bg-white/4'
          )}
        />

        <ShinySurface
          active={isHovered}
          color="rgba(255,255,255,0.02)"
          intensity={0.35}
          shineColor="rgba(255,255,255,0.1)"
          speed={2.4}
          spread={120}
        />

        <div className="relative z-10 flex flex-col gap-4 sm:gap-8">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 sm:size-16">
            <img
              alt=""
              className="size-6 object-contain brightness-0 invert sm:size-8"
              height={32}
              src={item.icon}
              width={32}
            />
          </div>

          <div className="flex flex-col gap-2 sm:gap-4">
            <h3 className="font-heading font-medium text-white text-xl leading-tight md:text-2xl">
              {item.name}
            </h3>
            <p className="font-heading font-light text-sm text-white/55 leading-relaxed md:text-base">
              {item.description}
            </p>
          </div>
        </div>
      </motion.article>
    </motion.div>
  )
}

export function Services() {
  const { services } = portfolio
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="relative z-10" id="atuacao">
      <BrandSurface />

      <div className="container-portfolio section-spacing relative z-10">
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SectionTitle className="text-white">{services.title}</SectionTitle>
            <SectionDescription
              className="text-white/60"
              titleLength={services.title.length}
            >
              {services.description}
            </SectionDescription>
          </div>

          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-8 xl:grid-cols-4"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {services.items.map((item, index) => {
              const isHovered = hoveredIndex === index
              const hasFocus = hoveredIndex !== null
              const isDimmed = hasFocus && !isHovered

              return (
                <ServiceCard
                  index={index}
                  isDimmed={isDimmed}
                  isHovered={isHovered}
                  item={item}
                  key={item.name}
                  onHoverStart={() => setHoveredIndex(index)}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
