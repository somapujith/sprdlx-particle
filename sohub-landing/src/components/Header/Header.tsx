import { BrandLogo } from '../BrandLogo/BrandLogo'
import { PillButton } from '../PillButton/PillButton'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <a href="/" className={styles.logoLink} data-logo-sohub>
        <BrandLogo variant="sohub" />
      </a>
      <div className={styles.actions}>
        <PillButton variant="chat" label="Chat with sohub" data-pill />
        <PillButton variant="menu" label="Menu" data-pill />
      </div>
    </header>
  )
}
