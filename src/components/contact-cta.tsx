import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, ArrowUpRight, Mouse } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import {
  type FocusEvent,
  type InputHTMLAttributes,
  useCallback,
  useState,
} from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import ScrollExpand from '@/components/scroll-expand'
import { Separator } from '@/components/ui/separator'
import SpecularButton from '@/components/ui/specular-button'
import { portfolio } from '@/data/portfolio'
import { cn } from '@/lib/utils'

const contactFormSchema = z.object({
  contact: z
    .string()
    .trim()
    .min(5, 'Informe um e-mail ou WhatsApp para retorno'),
  intent: z.string().trim().min(3, 'Conte o que você está buscando'),
  name: z.string().trim().min(2, 'Informe seu nome'),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

function ContactSurface() {
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute inset-0 bg-portfolio-navy" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_10%_25%,rgba(69,92,233,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_90%_75%,rgba(15,26,46,0.65),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(165deg,rgba(255,255,255,0.04)_0%,transparent_45%,rgba(0,0,0,0.35)_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          maskImage:
            'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.5))',
        }}
      />
    </div>
  )
}

function InlineField({
  className,
  invalid,
  onBlur,
  onFocus,
  wrapperClassName,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
  wrapperClassName?: string
}) {
  const [focused, setFocused] = useState(false)
  const reduceMotion = useReducedMotion()

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      setFocused(false)
      onBlur?.(event)
    },
    [onBlur]
  )

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      setFocused(true)
      onFocus?.(event)
    },
    [onFocus]
  )

  const focusTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: 'easeOut' as const }

  return (
    <span
      className={cn(
        'relative mx-1 inline-flex max-w-full items-center py-1',
        wrapperClassName
      )}
    >
      <motion.span
        animate={{
          opacity: focused ? 1 : 0,
          scale: focused ? 1 : 0.94,
        }}
        aria-hidden
        className="pointer-events-none absolute inset-0 origin-center rounded-md bg-white/10"
        initial={false}
        transition={focusTransition}
      />
      <input
        {...props}
        className={cn(
          'relative inline-block w-full min-w-32 border-0 border-b bg-transparent px-2 py-0 font-heading text-lg text-white leading-snug outline-none transition-colors duration-300 ease-out placeholder:text-white/40 placeholder:uppercase md:min-w-40 md:text-xl lg:min-w-48 lg:text-2xl',
          focused ? 'border-b-transparent' : 'border-white/25',
          invalid && !focused && 'border-red-400',
          className
        )}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
    </span>
  )
}

function buildWhatsAppMessage(values: ContactFormValues): string {
  return [
    'Olá, Mateus! Conheci seu trabalho pelo portfólio e gostaria de conversar.',
    '',
    `*Nome:* ${values.name}`,
    `*Assunto:* ${values.intent}`,
    `*Contato para retorno:* ${values.contact}`,
  ].join('\n')
}

export function ContactCta() {
  const { contact } = portfolio
  const reduceMotion = useReducedMotion()
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ContactFormValues>({
    defaultValues: {
      contact: '',
      intent: '',
      name: '',
    },
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = handleSubmit((values) => {
    const text = buildWhatsAppMessage(values)
    const url = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(text)}`

    window.open(url, '_blank', 'noopener,noreferrer')
    reset()
  })

  const nameField = register('name')
  const intentField = register('intent')
  const contactField = register('contact')

  const hasErrors = Boolean(errors.name || errors.intent || errors.contact)
  const expandEnabled = !reduceMotion

  return (
    <section className="container-portfolio" id="contato">
      <ScrollExpand
        enabled={expandEnabled}
        endHeight={84}
        endRadius={40}
        endWidth={100}
        holdDistance={0.35}
        media={<ContactSurface />}
        mediaZoom={1.06}
        overlayClassName="items-stretch justify-start overflow-hidden p-0 text-left"
        overlayScrim={0.15}
        scrollDistance={1}
        smoothing={0}
        startHeight={48}
        startRadius={40}
        startWidth={72}
        teaser={
          <div className="flex max-w-xl flex-col items-center gap-5 px-4 md:gap-6">
            <h2 className="font-heading font-medium text-3xl text-white leading-[1.1] tracking-tight md:text-4xl lg:text-6xl">
              {contact.teaserTitle}
            </h2>
            <div className="flex flex-col items-center gap-2 text-white/45">
              <Mouse
                aria-hidden
                className={cn(
                  'size-5 md:size-6',
                  !reduceMotion && 'animate-bounce'
                )}
                strokeWidth={1.5}
              />
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] md:text-xs">
                Continue rolando
              </span>
            </div>
          </div>
        }
        useWindowScroll
      >
        <div className="flex min-h-full w-full flex-col justify-center gap-6 px-6 py-6 sm:px-8 md:gap-8 md:px-10 md:py-8 lg:gap-10 lg:px-12 lg:py-10">
          <div className="flex w-full flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="font-heading font-medium text-3xl text-white leading-none tracking-tight md:text-4xl lg:text-5xl">
              {contact.headline}
            </h2>
            <p className="max-w-md font-heading font-light text-sm text-white/60 uppercase tracking-wide md:text-xl">
              {contact.subtitle}
            </p>
          </div>

          <form
            className="flex w-full min-w-0 flex-col gap-6 md:gap-8"
            noValidate
            onSubmit={onSubmit}
          >
            <div
              aria-label="Mensagem de contato"
              className="flex w-full flex-col gap-2 font-heading text-white text-xl leading-snug md:gap-3 md:text-2xl lg:text-3xl"
              role="group"
            >
              <p className="flex flex-wrap items-baseline gap-x-1">
                <span>Oi! Meu nome é </span>
                <InlineField
                  aria-invalid={Boolean(errors.name)}
                  aria-label="Seu nome"
                  invalid={Boolean(errors.name)}
                  placeholder={contact.form.namePlaceholder}
                  type="text"
                  wrapperClassName="min-w-32 flex-1 md:min-w-40 lg:min-w-48"
                  {...nameField}
                />
              </p>

              <p className="flex flex-wrap items-baseline gap-x-1">
                <span>e gostaria de conversar sobre </span>
                <InlineField
                  aria-invalid={Boolean(errors.intent)}
                  aria-label="O que você está buscando"
                  invalid={Boolean(errors.intent)}
                  placeholder={contact.form.intentPlaceholder}
                  type="text"
                  wrapperClassName="min-w-32 flex-1 md:min-w-40 lg:min-w-48"
                  {...intentField}
                />
                <span>.</span>
              </p>

              <p className="flex flex-wrap items-baseline gap-x-1">
                <span>Você pode me responder por </span>
                <InlineField
                  aria-invalid={Boolean(errors.contact)}
                  aria-label="E-mail ou WhatsApp para retorno"
                  invalid={Boolean(errors.contact)}
                  placeholder={contact.form.contactPlaceholder}
                  type="text"
                  wrapperClassName="min-w-32 flex-1 md:min-w-40 lg:min-w-48"
                  {...contactField}
                />
                <span>.</span>
              </p>
            </div>

            {hasErrors ? (
              <ul className="space-y-1 font-mono text-red-400 text-sm">
                {errors.name ? <li>{errors.name.message}</li> : null}
                {errors.intent ? <li>{errors.intent.message}</li> : null}
                {errors.contact ? <li>{errors.contact.message}</li> : null}
              </ul>
            ) : null}

            <SpecularButton
              className="group self-end"
              disabled={isSubmitting}
              size="md"
              theme="light"
              type="submit"
            >
              {contact.cta}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:-rotate-45" />
            </SpecularButton>
          </form>

          <Separator className="bg-white/10" />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            <div>
              <p className="font-mono text-white/45 text-xs uppercase tracking-wider md:text-sm">
                {contact.emailLabel}
              </p>
              <a
                className="mt-2 block break-all font-heading text-base text-white transition-opacity hover:opacity-70 md:text-lg"
                href={`mailto:${contact.email}`}
              >
                {contact.email}
              </a>
            </div>
            <div>
              <p className="font-mono text-white/45 text-xs uppercase tracking-wider md:text-sm">
                {contact.phoneLabel}
              </p>
              <a
                className="mt-2 block font-heading text-base text-white transition-opacity hover:opacity-70 md:text-lg"
                href={contact.whatsappUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {contact.phone}
              </a>
            </div>
            <div>
              <p className="font-mono text-white/45 text-xs uppercase tracking-wider md:text-sm">
                {contact.locationLabel}
              </p>
              <p className="mt-2 font-heading text-base text-white md:text-lg">
                {contact.location}
              </p>
            </div>
          </div>

          <ul className="flex flex-wrap items-center gap-2">
            {contact.socials.map((social) => (
              <li key={social.label}>
                <SpecularButton
                  className="group"
                  href={social.href}
                  rel="noopener noreferrer"
                  size="sm"
                  target="_blank"
                  theme="ghost"
                >
                  <img
                    alt=""
                    className="size-5 object-contain brightness-0 invert"
                    height={20}
                    src={social.icon}
                    width={20}
                  />
                  {social.label}
                  <ArrowUpRight className="size-4 opacity-70 transition-transform duration-300 group-hover:-rotate-45 group-hover:opacity-100" />
                </SpecularButton>
              </li>
            ))}
          </ul>
        </div>
      </ScrollExpand>
    </section>
  )
}
