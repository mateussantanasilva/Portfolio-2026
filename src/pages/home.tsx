import { FloatingNav } from '@/components/floating-nav'
import { ContactCta } from '@/components/sections/contact-cta'
import { Education } from '@/components/sections/education'
import { Experience } from '@/components/sections/experience'
import { FavouriteStack } from '@/components/sections/favourite-stack'
import { FooterBrand } from '@/components/sections/footer-brand'
import { Hero } from '@/components/sections/hero'
import { ImpressiveWorks } from '@/components/sections/impressive-works'
import { Intro } from '@/components/sections/intro'
import { Services } from '@/components/sections/services'

export function HomePage() {
  return (
    <div className="min-h-svh bg-background">
      <Hero />
      <main className="pb-10 md:pb-12">
        <Intro />
        <FavouriteStack />
        <Services />
        <ImpressiveWorks />
        <Experience />
        <Education />
        <ContactCta />
      </main>
      <FooterBrand />
      <FloatingNav />
    </div>
  )
}
