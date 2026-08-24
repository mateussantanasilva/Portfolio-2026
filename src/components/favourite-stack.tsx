import { motion, useInView, useReducedMotion } from 'motion/react'
import { useCallback, useRef, useState } from 'react'
import { SectionTitle } from '@/components/section-title'
import { ShinySurface } from '@/components/ui/shiny-text'
import { portfolio } from '@/data/portfolio'
import { type StackCategory, stackCategories, stackColumns } from '@/data/stack'
import { cn } from '@/lib/utils'

const bubbleSpring = {
  damping: 14,
  mass: 0.65,
  stiffness: 420,
  type: 'spring' as const,
}

const cardSpring = {
  damping: 22,
  mass: 0.85,
  stiffness: 260,
  type: 'spring' as const,
}

const hoverSpring = {
  damping: 28,
  stiffness: 320,
  type: 'spring' as const,
}

const CARD_STAGGER = 0.07
const BUBBLE_AFTER_CARD = 0.45

interface StackBentoCardProps {
  category: StackCategory
  index?: number
}

interface StackBubbleContentProps {
  category: StackCategory
  contentDelay: number
  inView: boolean
}

function TechIcons({
  category,
  contentDelay,
  inView,
}: StackBubbleContentProps) {
  const reduceMotion = useReducedMotion()
  const { id, techs } = category
  if (!techs?.length) return null

  return (
    <div className="flex flex-wrap items-center gap-y-2">
      {techs.map((tech, index) => (
        <motion.div
          animate={
            reduceMotion || inView
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0 }
          }
          className={cn(
            'relative flex size-12 items-center justify-center rounded-full border border-portfolio-subtle bg-white p-2 shadow-sm transition-[margin,box-shadow] duration-300 ease-out',
            index > 0 && '-ml-4 max-md:mr-2 max-md:ml-0',
            'group-hover:mr-2 group-hover:ml-0 group-hover:shadow-md',
            index === 0 && 'group-hover:mr-2 max-md:mr-2'
          )}
          initial={false}
          key={`${id}-${tech.name}`}
          style={{ zIndex: techs.length - index }}
          title={tech.name}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  ...bubbleSpring,
                  delay: contentDelay + index * 0.09,
                }
          }
        >
          <img
            alt=""
            className="size-8 object-contain"
            height={32}
            src={tech.icon}
            width={32}
          />
        </motion.div>
      ))}
    </div>
  )
}

function TechBadges({
  category,
  contentDelay,
  inView,
}: StackBubbleContentProps) {
  const reduceMotion = useReducedMotion()
  const { badges, id } = category
  if (!badges?.length) return null

  return (
    <ul className="flex flex-wrap gap-2">
      {badges.map((badge, index) => (
        <motion.li
          animate={
            reduceMotion || inView
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0 }
          }
          className="inline-flex items-center rounded-full border border-portfolio-subtle bg-white/80 px-4 py-2 font-heading text-foreground text-xs md:text-sm"
          initial={false}
          key={`${id}-${badge}`}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  ...bubbleSpring,
                  delay: contentDelay + index * 0.08,
                }
          }
        >
          {badge}
        </motion.li>
      ))}
    </ul>
  )
}

function StackBentoCard({ category, index = 0 }: StackBentoCardProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { amount: 0.2, once: true })
  const reduceMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const hasIcons = Boolean(category.techs?.length)
  const hasBadges = Boolean(category.badges?.length) && !hasIcons
  const contentDelay = index * CARD_STAGGER + BUBBLE_AFTER_CARD
  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => setIsHovered(false), [])

  return (
    <motion.article
      animate={
        reduceMotion || inView
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.96, y: 20 }
      }
      className={cn(
        'group relative isolate flex flex-col gap-4 overflow-hidden rounded-3xl border border-portfolio-subtle p-4 transition-colors duration-500 md:p-8',
        isHovered && 'border-foreground/10'
      )}
      initial={false}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={ref}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              ...cardSpring,
              delay: index * CARD_STAGGER,
              y: hoverSpring,
            }
      }
      whileHover={reduceMotion ? undefined : { y: -6 }}
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 rounded-[inherit] transition-colors duration-500',
          isHovered ? 'bg-white' : 'bg-portfolio-surface'
        )}
      />

      <ShinySurface
        active={isHovered}
        color="#f3f3f3"
        shineColor="#ffffff"
        speed={1.8}
        spread={120}
      />

      <div className="relative z-10 flex flex-col gap-4">
        {hasIcons ? (
          <TechIcons
            category={category}
            contentDelay={contentDelay}
            inView={inView}
          />
        ) : null}
        {hasBadges ? (
          <TechBadges
            category={category}
            contentDelay={contentDelay}
            inView={inView}
          />
        ) : null}

        <div className="flex flex-col gap-2">
          <h3 className="font-heading font-medium text-foreground text-xl leading-tight md:text-2xl">
            {category.name}
          </h3>

          <p className="font-heading font-light text-portfolio-muted text-sm leading-relaxed md:text-base">
            {category.description}
          </p>
        </div>
      </div>
    </motion.article>
  )
}

export function FavouriteStack() {
  const { stack } = portfolio
  let cardIndex = 0

  return (
    <section
      className="container-portfolio pb-28 md:pb-32 lg:pb-40"
      id="habilidades"
    >
      <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SectionTitle>{stack.title}</SectionTitle>
          <p className="max-w-md font-heading font-light text-foreground text-sm uppercase tracking-wide md:text-xl">
            {stack.description}
          </p>
        </div>

        <div className="flex flex-col gap-4 md:hidden">
          {stackCategories.map((category, index) => (
            <StackBentoCard
              category={category}
              index={index}
              key={category.id}
            />
          ))}
        </div>

        <div className="hidden grid-cols-[1fr_0.75fr_1fr] items-start gap-4 md:grid">
          {stackColumns.map((column) => (
            <div className="flex flex-col gap-4" key={column.id}>
              {column.items.map((category) => {
                const index = cardIndex
                cardIndex += 1
                return (
                  <StackBentoCard
                    category={category}
                    index={index}
                    key={category.id}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
