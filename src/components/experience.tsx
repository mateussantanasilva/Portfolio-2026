import { CareerEntry } from '@/components/career-entry'
import { CareerSectionLayout } from '@/components/career-section-layout'
import { Timeline, TimelineItem } from '@/components/timeline'
import { portfolio } from '@/data/portfolio'

export function Experience() {
  const { experience } = portfolio

  return (
    <section className="container-portfolio" id="experiencia">
      <CareerSectionLayout
        className="section-pt-tight section-pb-tight"
        description="Experiência prática no desenvolvimento e na evolução de produtos web, mobile e sistemas de negócio."
        title={experience.title}
      >
        <Timeline accent>
          {experience.items.map((item) => {
            const isCurrent = item.period.toLowerCase().includes('atual')

            return (
              <TimelineItem highlight={isCurrent} key={item.company}>
                <CareerEntry
                  description={item.description}
                  period={item.period}
                  subtitle={item.role}
                  title={item.company}
                />
              </TimelineItem>
            )
          })}
        </Timeline>
      </CareerSectionLayout>
    </section>
  )
}
