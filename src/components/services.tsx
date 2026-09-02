import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { SectionDescription } from '@/components/reveal'
import { SectionTitle } from '@/components/section-title'
import { ShinySurface } from '@/components/ui/shiny-text'
import { portfolio } from '@/data/portfolio'
import { cardSpring, REVEAL_Y } from '@/lib/motion'
import { cn } from '@/lib/utils'

/** 4 cards — intervalo maior que o stack para surgir um de cada vez */
const SERVICE_CARD_STAGGER = 0.12

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
  reduceMotion: boolean
  visible: boolean
}

function ServiceCard({
  index,
  isDimmed,
  isHovered,
  item,
  onHoverStart,
  reduceMotion,
  visible,
}: ServiceCardProps) {
  const revealed = reduceMotion || visible

  return (
    <motion.div
      animate={
        revealed
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.96, y: REVEAL_Y }
      }
      className="h-full"
      initial={false}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              ...cardSpring,
              delay: index * SERVICE_CARD_STAGGER,
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
        className="relative isolate flex h-full flex-col gap-8 overflow-hidden rounded-3xl border border-white/10 p-8 backdrop-blur-sm will-change-transform"
        initial={false}
        onHoverStart={onHoverStart}
        style={{ zIndex: isHovered ? 2 : 1 }}
        transition={
          reduceMotion ? { duration: 0 } : serviceHoverTransition
        }
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

      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <img
            alt=""
            className="size-8 object-contain brightness-0 invert"
            height={32}
            src={item.icon}
            width={32}
          />
        </div>

        <div className="flex flex-col gap-4">
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
  const reduceMotion = useReducedMotion()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const gridInView = useInView(gridRef, { amount: 0.2, once: true })
  const cardsVisible = Boolean(reduceMotion) || gridInView

  return (
    <section className="relative z-10" id="atuacao">
      {/* Faixa de fundo reta */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-portfolio-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_10%_25%,rgba(69,92,233,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_90%_75%,rgba(15,26,46,0.65),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.04)_0%,transparent_45%,rgba(0,0,0,0.35)_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            maskImage:
              'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5))',
          }}
        />
      </div>

      <div className="container-portfolio relative z-10 py-16 md:py-16 lg:py-20">
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <SectionTitle className="text-white">{services.title}</SectionTitle>
            <SectionDescription
              className="text-white/60"
              titleLength={services.title.length}
            >
              {services.description}
            </SectionDescription>
          </div>

          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
            onMouseLeave={() => setHoveredIndex(null)}
            ref={gridRef}
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
                  reduceMotion={Boolean(reduceMotion)}
                  visible={cardsVisible}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
