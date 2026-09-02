import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { Reveal } from '@/components/reveal'
import SpecularButton from '@/components/ui/specular-button'
import { portfolio } from '@/data/portfolio'
import { useSectionInView } from '@/hooks/use-section-in-view'

const INTRO_SLIDE = 20

export function Intro() {
  const { intro } = portfolio
  const sectionRef = useRef<HTMLElement>(null)
  const visible = useSectionInView(sectionRef)

  return (
    <section className="container-portfolio" id="sobre" ref={sectionRef}>
      <div className="flex flex-col gap-8 py-16 md:flex-row md:justify-between md:gap-12 md:py-24 lg:py-32">
        <Reveal
          as="p"
          className="max-w-2xl font-heading font-medium text-2xl text-foreground leading-snug md:text-3xl"
          inView={visible}
          x={-INTRO_SLIDE}
          y={0}
        >
          {intro.lead}
        </Reveal>

        <div className="flex w-full max-w-md shrink-0 flex-col gap-8 md:items-end">
          <Reveal
            as="p"
            className="font-heading font-light text-base text-portfolio-muted md:text-right md:text-lg"
            delay={0.08}
            inView={visible}
            x={INTRO_SLIDE}
            y={0}
          >
            {intro.body}
          </Reveal>

          <Reveal delay={0.2} inView={visible}>
            <SpecularButton
              className="group"
              href={intro.cvUrl}
              rel="noopener noreferrer"
              size="md"
              target="_blank"
              theme="outline"
            >
              {intro.link}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:-rotate-45" />
            </SpecularButton>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
