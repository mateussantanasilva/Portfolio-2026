import { motion, useInView, useReducedMotion } from 'motion/react'
import { useCallback, useRef, useState } from 'react'
import { SectionDescription } from '@/components/reveal'
import { SectionTitle } from '@/components/section-title'
import { ShinySurface } from '@/components/ui/shiny-text'
import { portfolio } from '@/data/portfolio'
import { type StackCategory, stackCategories, stackRows } from '@/data/stack'
import {
  BUBBLE_AFTER_CARD,
  bubbleSpring,
  CARD_IN_VIEW,
  CARD_STAGGER,
  cardSpring,
  hoverSpring,
  REVEAL_Y,
} from '@/lib/motion'
import { cn } from '@/lib/utils'

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
            'relative flex size-12 items-center justify-center rounded-full border border-portfolio-subtle bg-card p-2 shadow-sm transition-[margin,box-shadow] duration-300 ease-out',
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
            className={cn(
              'size-8 object-contain',
              tech.invertInDark && 'dark:brightness-0 dark:invert'
            )}
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
          className="inline-flex items-center rounded-full border border-portfolio-subtle bg-card/80 px-4 py-2 font-heading text-foreground text-xs md:text-sm"
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
  const inView = useInView(ref, CARD_IN_VIEW)
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
          : { opacity: 0, scale: 0.96, y: REVEAL_Y }
      }
      className={cn(
        'group relative isolate flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-portfolio-subtle p-4 transition-colors duration-500 md:p-8',
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
          isHovered ? 'bg-card' : 'bg-portfolio-surface'
        )}
      />

      <ShinySurface
        active={isHovered}
        color="var(--portfolio-shine)"
        shineColor="var(--portfolio-shine-highlight)"
        speed={1.8}
        spread={120}
      />

      <div className="relative z-10 flex h-full flex-col gap-4">
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

        <div className="mt-auto flex flex-col gap-2">
          <h3 className="font-heading font-medium text-foreground text-xl leading-tight md:text-2xl">
            {category.name}
          </h3>

          <p className="text-pretty font-heading font-light text-portfolio-muted text-sm leading-relaxed md:text-base">
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
      className="container-portfolio section-pt-tight section-pb"
      id="habilidades"
    >
      <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SectionTitle>{stack.title}</SectionTitle>
          <SectionDescription titleLength={stack.title.length}>
            {stack.description}
          </SectionDescription>
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

        <div className="hidden grid-cols-2 items-stretch gap-4 md:grid lg:hidden">
          {stackCategories.map((category, index) => (
            <StackBentoCard
              category={category}
              index={index}
              key={category.id}
            />
          ))}
        </div>

        <div className="hidden flex-col gap-4 lg:flex">
          {stackRows.map((row) => (
            <div
              className="grid grid-cols-[1fr_0.75fr_1fr] items-stretch gap-4"
              key={row.map((category) => category.id).join('-')}
            >
              {row.map((category) => {
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
