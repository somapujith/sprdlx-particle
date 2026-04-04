import styles from './RobotVisual.module.css'

const ACCENT = '#8BA89E'
const DARK = '#1E2228'
const JOINT = '#2F353D'
const WIRE = '#4A5563'

/**
 * Vector stand-in for the hero 3D robot — matches palette and industrial silhouette from the reference.
 * Replace with a transparent PNG/GLB if you have the original asset.
 */
export function RobotVisual() {
  return (
    <div className={styles.wrap} aria-hidden>
      <svg
        className={styles.svg}
        viewBox="0 0 320 400"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <defs>
          <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9BB5AA" />
            <stop offset="50%" stopColor={ACCENT} />
            <stop offset="100%" stopColor="#6F8A7E" />
          </linearGradient>
          <linearGradient id="darkMetal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3D454F" />
            <stop offset="100%" stopColor={DARK} />
          </linearGradient>
        </defs>

        {/* Leg left */}
        <path
          d="M118 310 L108 340 L98 372 L112 378 L125 352 L135 318 Z"
          fill="url(#metal)"
          stroke={JOINT}
          strokeWidth="1.2"
        />
        <path d="M98 372 L92 395 L104 398 L112 378 Z" fill={DARK} />
        <circle cx="120" cy="325" r="6" fill={JOINT} />

        {/* Leg right */}
        <path
          d="M202 310 L212 340 L222 372 L208 378 L195 352 L185 318 Z"
          fill="url(#metal)"
          stroke={JOINT}
          strokeWidth="1.2"
        />
        <path d="M222 372 L228 395 L216 398 L208 378 Z" fill={DARK} />
        <circle cx="200" cy="325" r="6" fill={JOINT} />

        {/* Torso / hip block */}
        <rect x="125" y="240" width="70" height="85" rx="8" fill="url(#metal)" stroke={JOINT} strokeWidth="1.5" />
        <rect x="135" y="252" width="50" height="12" rx="2" fill={DARK} opacity="0.35" />
        <text
          x="160"
          y="290"
          textAnchor="middle"
          fill={DARK}
          opacity="0.45"
          fontSize="9"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
          letterSpacing="0.12em"
        >
          TEST UNIT
        </text>

        {/* Wires */}
        <path d="M140 240 Q130 200 125 180" stroke={WIRE} strokeWidth="2" fill="none" />
        <path d="M180 240 Q190 200 195 180" stroke={WIRE} strokeWidth="2" fill="none" />

        {/* Head block */}
        <rect x="105" y="120" width="110" height="130" rx="14" fill="url(#metal)" stroke={JOINT} strokeWidth="1.5" />
        <rect x="118" y="135" width="84" height="72" rx="6" fill="url(#darkMetal)" opacity="0.92" />

        {/* Eye lens */}
        <circle cx="160" cy="168" r="28" fill="#0D1117" opacity="0.9" />
        <circle cx="160" cy="168" r="20" fill="#1a2332" />
        <circle cx="168" cy="162" r="6" fill="#8BA89E" opacity="0.6" />

        {/* Top antenna / detail */}
        <rect x="152" y="92" width="16" height="32" rx="3" fill={DARK} />
        <circle cx="160" cy="88" r="5" fill={ACCENT} />

        {/* Shoulder pods */}
        <ellipse cx="95" cy="175" rx="18" ry="24" fill="url(#metal)" stroke={JOINT} strokeWidth="1.2" />
        <ellipse cx="225" cy="175" rx="18" ry="24" fill="url(#metal)" stroke={JOINT} strokeWidth="1.2" />

        {/* Arm stubs */}
        <path d="M88 185 L72 210 L78 222 L95 200 Z" fill="url(#metal)" stroke={JOINT} strokeWidth="1" />
        <path d="M232 185 L248 210 L242 222 L225 200 Z" fill="url(#metal)" stroke={JOINT} strokeWidth="1" />
      </svg>
    </div>
  )
}
