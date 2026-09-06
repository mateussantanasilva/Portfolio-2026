import { BubbleEntrance } from '@/components/reveal'
import SpecularButton from '@/components/ui/specular-button'
import { portfolio } from '@/data/portfolio'
import { ITEM_STAGGER } from '@/lib/motion'
import { cn } from '@/lib/utils'

type HeroSocialsVariant = 'header' | 'dock'

export function HeroSocials({
  className,
  variant = 'dock',
}: {
  className?: string
  variant?: HeroSocialsVariant
}) {
  const { socials } = portfolio.contact
  const isHeader = variant === 'header'

  const list = (
    <ul
      className={cn(
        'flex w-fit',
        isHeader ? 'flex-row gap-3' : 'flex-col gap-3',
        className
      )}
    >
      {socials.map((social, index) => (
        <li key={`${variant}-${social.label}`}>
          <BubbleEntrance delay={0.25 + index * ITEM_STAGGER}>
            <SpecularButton
              aria-label={social.label}
              className={cn(
                'cursor-pointer rounded-full',
                isHeader && 'size-10'
              )}
              href={social.href}
              rel="noopener noreferrer"
              size="icon"
              target="_blank"
              theme="outline"
            >
              <img
                alt=""
                className="size-5 object-contain md:size-[1.35rem] dark:brightness-0 dark:invert"
                height={22}
                src={social.icon}
                width={22}
              />
            </SpecularButton>
          </BubbleEntrance>
        </li>
      ))}
    </ul>
  )

  if (isHeader) {
    return <div className="md:hidden">{list}</div>
  }

  return (
    <div className="absolute inset-x-0 bottom-24 z-20 hidden sm:bottom-28 md:block">
      <div className="container-portfolio">{list}</div>
    </div>
  )
}
