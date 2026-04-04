import type { ReactNode } from 'react'
import styles from './BrandLogo.module.css'

type BrandLogoBase = {
  className?: string
}

type BrandLogoDefaultProps = BrandLogoBase & {
  variant?: 'default'
  children: ReactNode
}

type BrandLogoSohubProps = BrandLogoBase & {
  variant: 'sohub'
  children?: undefined
}

export type BrandLogoProps = BrandLogoDefaultProps | BrandLogoSohubProps

/**
 * Reusable wordmark. Default variant matches the "Publica Play" reference
 * (Inter 600, ~24px, black on white). Use variant="sohub" for the landing logo.
 */
export function BrandLogo(props: BrandLogoProps) {
  if (props.variant === 'sohub') {
    return <span className={`${styles.sohub} ${props.className ?? ''}`.trim()}>sohub</span>
  }
  return <span className={`${styles.root} ${props.className ?? ''}`.trim()}>{props.children}</span>
}
