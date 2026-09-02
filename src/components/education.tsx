import { CareerEntry } from '@/components/career-entry'
import { CareerSectionLayout } from '@/components/career-section-layout'
import { Timeline, TimelineItem } from '@/components/timeline'
import { portfolio } from '@/data/portfolio'

export function Education() {
  const { education } = portfolio

  return (
    <section className="container-portfolio" id="educacao">
      <CareerSectionLayout
        className="section-pt-tight section-pb-tight"
        description="Formação técnica e acadêmica que sustenta minha prática em desenvolvimento e Engenharia de Software."
        title={education.title}
      >
        <Timeline>
          {education.items.map((item) => (
            <TimelineItem key={item.school}>
              <CareerEntry
                description={item.description}
                period={item.period}
                subtitle={item.degree}
                title={item.school}
              />
            </TimelineItem>
          ))}
        </Timeline>
      </CareerSectionLayout>
    </section>
  )
}
