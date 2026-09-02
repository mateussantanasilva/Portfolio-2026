import { ContactCta } from '@/components/contact-cta'
import { Education } from '@/components/education'
import { Experience } from '@/components/experience'
import { FavouriteStack } from '@/components/favourite-stack'
import { FloatingNav } from '@/components/floating-nav'
import { FooterBrand } from '@/components/footer-brand'
import { Hero } from '@/components/hero'
import { ImpressiveWorks } from '@/components/impressive-works'
import { Intro } from '@/components/intro'
import { Services } from '@/components/services'

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
