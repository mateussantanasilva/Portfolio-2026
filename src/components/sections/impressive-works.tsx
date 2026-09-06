import { ArrowUpRight } from 'lucide-react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import iconGithub from '@/assets/stack/GitHub.png'
import { BubbleEntrance, SectionDescription } from '@/components/reveal'
import { SectionTitle } from '@/components/section-title'
import SpecularButton from '@/components/ui/specular-button'
import { portfolio } from '@/data/portfolio'
import { CARD_IN_VIEW, CARD_STAGGER, cardSpring, REVEAL_Y } from '@/lib/motion'

const workHoverTransition = {
  damping: 28,
  stiffness: 260,
  type: 'spring' as const,
}

interface WorkProject {
  description: string
  href: string
  image: string
  title: string
}

interface WorkCardProps {
  index: number
  project: WorkProject
}

function WorkCard({ index, project }: WorkCardProps) {
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
      <motion.a
        className="group backface-hidden relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-portfolio-subtle bg-portfolio-surface will-change-transform md:block md:aspect-[16/11] md:border-white/10 md:bg-[#111]"
        href={project.href}
        initial={false}
        rel="noopener noreferrer"
        target="_blank"
        transition={reduceMotion ? { duration: 0 } : workHoverTransition}
        whileHover={reduceMotion ? undefined : { y: -6 }}
      >
        <div className="relative aspect-[16/10] overflow-hidden md:absolute md:inset-0 md:aspect-auto">
          <img
            alt={project.title}
            className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            height={640}
            src={project.image}
            width={512}
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent transition-opacity duration-500 md:from-black md:via-black/45 md:to-black/10 md:group-hover:from-black md:group-hover:via-black/55" />
          <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_top_right,rgba(69,92,233,0.35),transparent_45%)] opacity-0 mix-blend-overlay transition-opacity duration-500 md:block md:group-hover:opacity-100" />
        </div>

        <div className="relative flex flex-col gap-3 p-4 md:absolute md:inset-x-0 md:bottom-0 md:gap-4 md:p-8">
          <h3 className="text-pretty font-heading font-medium text-foreground text-xl leading-tight md:text-4xl md:text-white">
            {project.title}
          </h3>

          <div className="h-px w-12 bg-foreground/20 transition-all duration-500 group-hover:w-24 group-hover:bg-foreground/50 md:bg-white/30 md:group-hover:bg-white/70" />

          <p className="text-balance font-heading font-light text-portfolio-muted text-sm leading-relaxed md:max-h-0 md:overflow-hidden md:text-base md:text-white/75 md:opacity-0 md:transition-all md:duration-500 md:group-hover:max-h-40 md:group-hover:opacity-100">
            {project.description}
          </p>

          <span className="inline-flex items-center gap-2 font-mono text-foreground text-xs uppercase tracking-wider opacity-80 transition-opacity duration-300 group-hover:opacity-100 md:text-sm md:text-white">
            Abrir no GitHub
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </motion.a>
    </motion.div>
  )
}

export function ImpressiveWorks() {
  const { works } = portfolio
  const reduceMotion = useReducedMotion()
  const ctaRef = useRef<HTMLDivElement>(null)
  const ctaInView = useInView(ctaRef, CARD_IN_VIEW)
  const showCta = Boolean(reduceMotion) || ctaInView

  return (
    <section
      className="container-portfolio section-pt section-pb-tight"
      id="projetos"
    >
      <div className="flex flex-col items-center gap-8 md:gap-12 lg:gap-16">
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle>{works.title}</SectionTitle>
          <SectionDescription titleLength={works.title.length}>
            {works.description}
          </SectionDescription>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          {works.items.map((project, index) => (
            <WorkCard index={index} key={project.title} project={project} />
          ))}
        </div>

        <div ref={ctaRef}>
          {showCta ? (
            <BubbleEntrance delay={CARD_STAGGER + 0.08}>
              <SpecularButton
                href={works.exploreHref}
                rel="noopener noreferrer"
                size="md"
                target="_blank"
                theme="outline"
              >
                <img
                  alt=""
                  className="size-5 object-contain dark:brightness-0 dark:invert"
                  height={20}
                  src={iconGithub}
                  width={20}
                />
                {works.exploreLabel}
              </SpecularButton>
            </BubbleEntrance>
          ) : null}
        </div>
      </div>
    </section>
  )
}
