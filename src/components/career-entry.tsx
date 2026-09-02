interface CareerEntryProps {
  description: string
  period: string
  subtitle: string
  title: string
}

export function CareerEntry({
  description,
  period,
  subtitle,
  title,
}: CareerEntryProps) {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <div className="flex min-w-0 flex-col gap-4">
            <span className="font-mono text-portfolio-muted text-xs uppercase tracking-wider md:text-sm">
              {period}
            </span>

            <h3 className="font-heading font-medium text-2xl text-foreground leading-tight md:text-4xl">
              {title}
            </h3>

            <p className="font-heading text-base text-foreground md:text-lg">
              {subtitle}
            </p>
          </div>
        </div>

        <p className="max-w-3xl font-heading font-light text-base text-portfolio-muted leading-relaxed md:text-lg">
          {description}
        </p>
    </div>
  )
}
