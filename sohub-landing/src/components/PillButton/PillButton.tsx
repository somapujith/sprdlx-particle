import type { ButtonHTMLAttributes } from 'react'
import styles from './PillButton.module.css'

type PillVariant = 'chat' | 'menu'

type PillButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: PillVariant
  label: string
}

function ChatGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-4.5L9 19v-3H6a2 2 0 01-2-2V6z"
        stroke="#0D1117"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MenuGlyph() {
  return (
    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden>
      <circle cx="3.5" cy="4" r="1.75" fill="#FFFFFF" />
      <circle cx="10.5" cy="4" r="1.75" fill="#FFFFFF" />
    </svg>
  )
}

export function PillButton({ variant, label, className, type = 'button', ...rest }: PillButtonProps) {
  return (
    <button
      type={type}
      className={`${styles.pill} ${variant === 'chat' ? styles.chat : styles.menu} ${className ?? ''}`.trim()}
      {...rest}
    >
      <span>{label}</span>
      <span
        className={`${styles.iconWrap} ${variant === 'chat' ? styles.iconWrapChat : styles.iconWrapMenu}`.trim()}
      >
        {variant === 'chat' ? <ChatGlyph /> : <MenuGlyph />}
      </span>
    </button>
  )
}
