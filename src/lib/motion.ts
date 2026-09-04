export const bubbleSpring = {
  damping: 14,
  mass: 0.65,
  stiffness: 420,
  type: 'spring' as const,
}

export const cardSpring = {
  damping: 20,
  mass: 0.8,
  stiffness: 300,
  type: 'spring' as const,
}

export const hoverSpring = {
  damping: 28,
  stiffness: 320,
  type: 'spring' as const,
}

export const revealSpring = {
  damping: 26,
  mass: 0.75,
  stiffness: 340,
  type: 'spring' as const,
}

export const CARD_STAGGER = 0.05
export const ITEM_STAGGER = 0.06
export const FOOTER_NAV_STAGGER = 0.1
export const BUBBLE_AFTER_CARD = 0.45
export const CHAR_MS = 56

export const REVEAL_Y = 12
export const REVEAL_X = 12
export const REVEAL_DURATION = 0.45

/** Observação por card — evita animar fora da tela em grids altos (mobile) */
export const CARD_IN_VIEW = { amount: 0.15, once: true } as const

export const revealFadeUp = {
  hidden: { opacity: 0, y: REVEAL_Y },
  visible: { opacity: 1, y: 0 },
}

export const revealFadeLeft = {
  hidden: { opacity: 0, x: -REVEAL_X },
  visible: { opacity: 1, x: 0 },
}

/** Descrição entra um pouco antes do typing terminar, para não parecer travada */
export function typingDelay(
  titleLength: number,
  buffer = 0.05,
  fraction = 0.55
) {
  return (titleLength * CHAR_MS * fraction) / 1000 + buffer
}
