import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import iconGithub from '@/assets/icons/GitHub.png'
import { SectionTitle } from '@/components/section-title'
import SpecularButton from '@/components/ui/specular-button'
import { portfolio } from '@/data/portfolio'

export function ImpressiveWorks() {
  const { works } = portfolio
  const reduceMotion = useReducedMotion()

  return (
    <section
      className="container-portfolio pt-28 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32"
      id="projetos"
    >
      <div className="flex flex-col items-center gap-8 md:gap-12 lg:gap-16">
        <div className="flex w-full flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionTitle>{works.title}</SectionTitle>
          <p className="max-w-md font-heading font-light text-foreground text-sm uppercase tracking-wide md:text-xl">
            {works.description}
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          {works.items.map((project) => (
            <motion.a
              className="group relative isolate aspect-[16/10] overflow-hidden rounded-3xl bg-[#111] md:aspect-[16/11]"
              href={project.href}
              initial={false}
              key={project.title}
              rel="noopener noreferrer"
              target="_blank"
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { damping: 28, stiffness: 260, type: 'spring' }
              }
              whileHover={reduceMotion ? undefined : { y: -6 }}
            >
              <img
                alt={project.title}
                className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                height={640}
                src={project.image}
                width={512}
              />

              <div className="absolute inset-0 bg-linear-to-t from-black via-black/45 to-black/10 transition-opacity duration-500 group-hover:from-black group-hover:via-black/55" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(69,92,233,0.35),transparent_45%)] opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100" />

              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-4 md:p-8">
                <h3 className="font-heading font-medium text-2xl text-white leading-tight md:text-4xl">
                  {project.title}
                </h3>

                <div className="h-px w-12 bg-white/30 transition-all duration-500 group-hover:w-24 group-hover:bg-white/70" />

                <p className="max-h-32 overflow-hidden font-heading font-light text-sm text-white/75 leading-relaxed opacity-100 transition-all duration-500 md:max-h-0 md:text-base md:opacity-0 md:group-hover:max-h-40 md:group-hover:opacity-100">
                  {project.description}
                </p>

                <span className="inline-flex items-center gap-2 font-mono text-white text-xs uppercase tracking-wider opacity-80 transition-opacity duration-300 group-hover:opacity-100 md:text-sm">
                  Abrir no GitHub
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        <SpecularButton
          href={works.exploreHref}
          rel="noopener noreferrer"
          size="md"
          target="_blank"
          theme="outline"
        >
          <img
            alt=""
            className="size-5 object-contain"
            height={20}
            src={iconGithub}
            width={20}
          />
          {works.exploreLabel}
        </SpecularButton>
      </div>
    </section>
  )
}
