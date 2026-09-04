import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, ArrowUpRight, Mouse } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import {
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  useId,
  useState,
} from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { BrandSurface } from '@/components/brand-surface'
import { Reveal } from '@/components/reveal'
import ScrollExpand from '@/components/scroll-expand'
import SpecularButton from '@/components/ui/specular-button'
import { portfolio } from '@/data/portfolio'
import { useContactExpandEligible } from '@/hooks/use-contact-expand-eligible'
import { cn } from '@/lib/utils'

const CONTACT_MIN_CARD_HEIGHT = 520
const CONTACT_MAX_CARD_HEIGHT = 880
const CONTACT_END_RADIUS = 40

const contactFormSchema = z.object({
  contact: z
    .string()
    .trim()
    .min(5, 'Informe um e-mail ou WhatsApp para retorno'),
  message: z
    .string()
    .trim()
    .min(10, 'Escreva uma mensagem com pelo menos 10 caracteres'),
  name: z.string().trim().min(2, 'Informe seu nome'),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

const fieldControlClassName = cn(
  'w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 font-heading text-base text-white outline-none transition-colors duration-300 placeholder:text-white/35 md:px-5 md:py-3.5 md:text-lg',
  'focus-visible:border-white/30 focus-visible:bg-white/8'
)

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  error?: string
  label: string
}

interface FormTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  error?: string
  label: string
}

function FormField({ className, error, id, label, ...props }: FormFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const errorId = `${fieldId}-error`

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label
        className="font-mono text-white text-xs uppercase tracking-wider md:text-sm"
        htmlFor={fieldId}
      >
        {label}
      </label>
      <input
        {...props}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={cn(
          fieldControlClassName,
          error && 'border-red-400/80 focus-visible:border-red-400/80'
        )}
        id={fieldId}
      />
      {error ? (
        <p className="font-mono text-red-400 text-sm" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function FormTextarea({
  className,
  error,
  id,
  label,
  ...props
}: FormTextareaProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const errorId = `${fieldId}-error`

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label
        className="font-mono text-white text-xs uppercase tracking-wider md:text-sm"
        htmlFor={fieldId}
      >
        {label}
      </label>
      <textarea
        {...props}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={cn(
          fieldControlClassName,
          'min-h-36 touch-auto resize-none leading-relaxed md:min-h-40',
          error && 'border-red-400/80 focus-visible:border-red-400/80'
        )}
        id={fieldId}
      />
      {error ? (
        <p className="font-mono text-red-400 text-sm" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function buildWhatsAppMessage(values: ContactFormValues): string {
  return [
    'Olá, Mateus! Conheci seu trabalho pelo portfólio e gostaria de conversar.',
    '',
    `*Nome:* ${values.name}`,
    `*Mensagem:* ${values.message}`,
    `*Contato para retorno:* ${values.contact}`,
  ].join('\n')
}

export function ContactCta() {
  const { contact } = portfolio
  const reduceMotion = useReducedMotion()
  const [contentHeight, setContentHeight] = useState(0)
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ContactFormValues>({
    defaultValues: {
      contact: '',
      message: '',
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
  const messageField = register('message')
  const contactField = register('contact')
  const expandEnabled = useContactExpandEligible({
    contentHeight,
    enabled: !reduceMotion,
    // Em viewports muito altas o card sticky deixa um vão até o Footer.
    maxViewportHeight: CONTACT_MAX_CARD_HEIGHT + 80,
    minContentHeight: CONTACT_MIN_CARD_HEIGHT,
  })

  const contactPanel = (
    <div className="flex w-full flex-col px-6 py-8 sm:px-8 md:px-10 md:py-10 lg:px-12 lg:py-12">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
        <div className="flex flex-col gap-8 md:gap-10">
          <Reveal amount={0.15}>
            <div className="flex flex-col gap-4">
              <h2 className="font-heading font-medium text-3xl text-white leading-none tracking-tight md:text-4xl lg:text-5xl">
                {contact.headline}
              </h2>
              <p className="max-w-lg text-balance font-heading font-light text-sm text-white/60 uppercase tracking-wide md:text-lg lg:text-xl">
                {contact.subtitle}
              </p>
            </div>
          </Reveal>

          <Reveal amount={0.12} delay={0.06}>
            <div className="flex flex-col gap-6 md:gap-8">
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
          </Reveal>

          <ul className="flex flex-wrap items-center gap-2">
            {contact.socials.map((social, index) => (
              <Reveal
                amount={0.15}
                as="li"
                delay={0.12 + index * 0.04}
                key={social.label}
              >
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
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal amount={0.12} delay={0.1}>
          <form
            className="flex w-full min-w-0 flex-col gap-6 md:gap-8 lg:pt-2"
            noValidate
            onSubmit={onSubmit}
          >
            <div className="flex flex-col gap-5 md:gap-6">
              <FormField
                autoComplete="name"
                error={errors.name?.message}
                label={contact.form.nameLabel}
                placeholder={contact.form.namePlaceholder}
                type="text"
                {...nameField}
              />

              <FormField
                autoComplete="tel email"
                error={errors.contact?.message}
                label={contact.form.contactLabel}
                placeholder={contact.form.contactPlaceholder}
                type="text"
                {...contactField}
              />

              <FormTextarea
                error={errors.message?.message}
                label={contact.form.messageLabel}
                placeholder={contact.form.messagePlaceholder}
                rows={5}
                {...messageField}
              />
            </div>

            <SpecularButton
              className="group self-center sm:self-end"
              disabled={isSubmitting}
              size="md"
              theme="light"
              type="submit"
            >
              {contact.cta}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:-rotate-45" />
            </SpecularButton>
          </form>
        </Reveal>
      </div>
    </div>
  )

  return (
    <section
      className="container-portfolio section-pt-tight section-pb-tight"
      id="contato"
    >
      <ScrollExpand
        enabled={expandEnabled}
        endRadius={CONTACT_END_RADIUS}
        endWidth={100}
        holdDistance={1}
        key={expandEnabled ? 'contact-expand' : 'contact-static'}
        maxCardHeight={CONTACT_MAX_CARD_HEIGHT}
        media={<BrandSurface />}
        mediaZoom={1.06}
        minCardHeight={CONTACT_MIN_CARD_HEIGHT}
        onContentHeight={setContentHeight}
        overlayClassName="items-stretch justify-center p-0 text-left"
        overlayScrim={0.15}
        scrollDistance={1.2}
        smoothing={0}
        startHeight={48}
        startRadius={CONTACT_END_RADIUS}
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
        {contactPanel}
      </ScrollExpand>
    </section>
  )
}
