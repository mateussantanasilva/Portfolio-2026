import { ArrowRight } from 'lucide-react'
import SpecularButton from '@/components/ui/specular-button'
import { portfolio } from '@/data/portfolio'

export function Intro() {
  const { intro } = portfolio

  return (
    <section className="container-portfolio" id="sobre">
      <div className="flex flex-col gap-8 py-16 md:flex-row md:justify-between md:gap-12 md:py-24 lg:py-32">
        <p className="max-w-2xl font-heading font-medium text-2xl text-foreground leading-snug md:text-3xl">
          {intro.lead}
        </p>

        <div className="flex w-full max-w-md shrink-0 flex-col gap-8 md:items-end">
          <p className="font-heading font-light text-base text-portfolio-muted md:text-right md:text-lg">
            {intro.body}
          </p>

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
        </div>
      </div>
    </section>
  )
}
