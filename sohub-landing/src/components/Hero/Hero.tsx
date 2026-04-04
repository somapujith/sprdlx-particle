import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Header } from '../Header/Header'
import { RobotVisual } from '../RobotVisual/RobotVisual'
import styles from './Hero.module.css'

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null)
  const bgWordRef = useRef<HTMLDivElement>(null)
  const robotParallaxRef = useRef<HTMLDivElement>(null)
  const robotFloatRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const bg = bgWordRef.current
      const robotOuter = robotParallaxRef.current
      const robotInner = robotFloatRef.current
      const foot = footerRef.current
      const pills = rootRef.current?.querySelectorAll<HTMLButtonElement>('[data-pill]')
      const logo = rootRef.current?.querySelector('[data-logo-sohub]')

      if (!bg || !robotOuter || !robotInner || !foot) return

      gsap.set(bg, { xPercent: -50, yPercent: -50, x: 0, y: 0 })

      const headlineEls = foot.querySelectorAll(`.${styles.headlineLine}`)
      const scrollEl = foot.querySelector(`.${styles.scroll}`)

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      tl.from(bg, { opacity: 0, y: 36, duration: 1.05 }, 0).from(
        robotOuter,
        { opacity: 0, scale: 0.94, y: 28, duration: 1.15, ease: 'power3.out' },
        0.15,
      )
      if (headlineEls.length) {
        tl.from(headlineEls, { opacity: 0, y: 18, stagger: 0.12, duration: 0.75 }, 0.45)
      }
      if (scrollEl) {
        tl.from(scrollEl, { opacity: 0, y: 14, duration: 0.65 }, headlineEls.length ? 0.55 : 0.45)
      }

      const float = gsap.to(robotInner, {
        y: -14,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      const parallaxHandler = (e: MouseEvent) => {
        const { innerWidth: w, innerHeight: h } = window
        const nx = (e.clientX / w - 0.5) * 2
        const ny = (e.clientY / h - 0.5) * 2
        gsap.to(bg, { x: nx * 10, y: ny * 6, duration: 0.6, ease: 'power2.out', overwrite: 'auto' })
        gsap.to(robotOuter, { x: nx * 22, y: ny * 14, duration: 0.55, ease: 'power2.out', overwrite: 'auto' })
      }
      window.addEventListener('mousemove', parallaxHandler)

      const pillEnter = (btn: HTMLButtonElement) => () => gsap.to(btn, { scale: 1.05, duration: 0.35, ease: 'power2.out' })
      const pillLeave = (btn: HTMLButtonElement) => () => gsap.to(btn, { scale: 1, duration: 0.35, ease: 'power2.out' })
      const pillHandlers: { btn: HTMLButtonElement; enter: () => void; leave: () => void }[] = []
      pills?.forEach((btn) => {
        const enter = pillEnter(btn)
        const leave = pillLeave(btn)
        pillHandlers.push({ btn, enter, leave })
        btn.addEventListener('mouseenter', enter)
        btn.addEventListener('mouseleave', leave)
      })

      const logoEnter = () => logo && gsap.to(logo, { opacity: 0.72, duration: 0.25 })
      const logoLeave = () => logo && gsap.to(logo, { opacity: 1, duration: 0.25 })
      logo?.addEventListener('mouseenter', logoEnter)
      logo?.addEventListener('mouseleave', logoLeave)

      return () => {
        float.kill()
        tl.kill()
        window.removeEventListener('mousemove', parallaxHandler)
        pillHandlers.forEach(({ btn, enter, leave }) => {
          btn.removeEventListener('mouseenter', enter)
          btn.removeEventListener('mouseleave', leave)
        })
        logo?.removeEventListener('mouseenter', logoEnter)
        logo?.removeEventListener('mouseleave', logoLeave)
      }
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className={styles.page}>
      <Header />
      <div className={styles.stage}>
        <div ref={bgWordRef} className={styles.bgWord}>
          sohub
        </div>
        <div ref={robotParallaxRef} className={styles.robotLayer}>
          <div ref={robotFloatRef} className={styles.robotFloat}>
            <RobotVisual />
          </div>
        </div>
      </div>
      <footer ref={footerRef} className={styles.footer}>
        <h1 className={styles.headline}>
          <span className={styles.headlineLine}>Your story builds</span>
          <span className={styles.headlineLine}>our history.</span>
        </h1>
        <span className={styles.scroll}>Scroll</span>
      </footer>
    </div>
  )
}
