import { ArrowUp } from 'lucide-react'
import { useInView } from 'motion/react'
import { useRef } from 'react'
import { BubbleEntrance, Reveal } from '@/components/reveal'
import { Button } from '@/components/ui/button'
import SpecularButton from '@/components/ui/specular-button'
import { portfolio } from '@/data/portfolio'
import { FOOTER_NAV_STAGGER } from '@/lib/motion'

const sectionLinks = [
  { href: '#inicio', label: 'Início' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#habilidades', label: 'Habilidades' },
  { href: '#atuacao', label: 'Atuação' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#experiencia', label: 'Experiência' },
  { href: '#formacao', label: 'Formação' },
  { href: '#contato', label: 'Contato' },
] as const

export function FooterBrand() {
  const { brand, contact } = portfolio
  const scrollTopRef = useRef<HTMLDivElement>(null)
  const scrollTopInView = useInView(scrollTopRef, { amount: 0.4, once: true })

  return (
    <footer className="relative pb-24 text-white md:pb-32">
      {/* Base + dots */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[#0a0a0b]" />
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            maskImage:
              'linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.65))',
          }}
        />
      </div>

      <div className="container-portfolio section-pt-tight relative z-10 flex flex-col gap-8 pb-8 md:pb-12">
        <div className="flex items-start justify-between gap-8">
          <Reveal>
            <div className="min-w-0">
              <p className="font-heading font-light text-sm text-white/70 uppercase tracking-wider md:text-base">
                {brand.tagline}
              </p>
              <p className="mt-2 font-heading font-medium text-4xl leading-none tracking-tight md:text-5xl lg:text-6xl">
                {brand.displayName}
              </p>
              <a
                className="mt-3 block break-all font-heading text-base text-white/55 transition-colors hover:text-white md:text-lg"
                href={`mailto:${contact.email}`}
              >
                {contact.email}
              </a>
            </div>
          </Reveal>

          <div className="size-8 shrink-0 md:size-12" ref={scrollTopRef}>
            {scrollTopInView ? (
              <BubbleEntrance delay={0.06}>
                <SpecularButton
                  aria-label="Voltar ao topo"
                  className="group"
                  href="#inicio"
                  size="icon"
                  theme="ghost"
                >
                  <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 md:size-5" />
                </SpecularButton>
              </BubbleEntrance>
            ) : null}
          </div>
        </div>

        <nav aria-label="Rodapé" className="border-white/10 border-t pt-8">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {sectionLinks.map((link, index) => (
              <Reveal
                as="li"
                delay={index * FOOTER_NAV_STAGGER}
                key={link.href}
              >
                <Button
                  className="h-auto px-4 py-2 font-heading font-normal text-sm text-white/75 hover:bg-white/10 hover:text-white"
                  nativeButton={false}
                  render={<a href={link.href} />}
                  size="sm"
                  variant="ghost"
                >
                  {link.label}
                </Button>
              </Reveal>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
