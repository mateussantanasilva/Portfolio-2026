import { BubbleEntrance } from '@/components/reveal'
import SpecularButton from '@/components/ui/specular-button'
import { portfolio } from '@/data/portfolio'
import { ITEM_STAGGER } from '@/lib/motion'

export function HeroSocials() {
  const { socials } = portfolio.contact

  return (
    <div className="absolute inset-x-0 bottom-24 z-20 hidden sm:bottom-28 md:block">
      <div className="container-portfolio">
        <ul className="flex w-fit flex-col gap-3">
          {socials.map((social, index) => (
            <li key={social.label}>
              <BubbleEntrance delay={0.25 + index * ITEM_STAGGER}>
                <SpecularButton
                  aria-label={social.label}
                  className="cursor-pointer rounded-full"
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
      </div>
    </div>
  )
}
