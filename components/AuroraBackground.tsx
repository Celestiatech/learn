import { memo } from 'react'

type AuroraBackgroundProps = {
  className?: string
  intensity?: 'subtle' | 'balanced' | 'vivid'
}

const intensityMap: Record<Required<AuroraBackgroundProps>['intensity'], string> = {
  subtle: 'opacity-40',
  balanced: 'opacity-60',
  vivid: 'opacity-80',
}

function AuroraBackgroundComponent({ className = '', intensity = 'balanced' }: AuroraBackgroundProps) {
  const opacityClass = intensityMap[intensity] ?? intensityMap.balanced

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className={`aurora-bubble aurora-bubble--one ${opacityClass}`} />
      <div className={`aurora-bubble aurora-bubble--two ${opacityClass}`} />
      <div className={`aurora-bubble aurora-bubble--three ${opacityClass}`} />

      <svg
        className="absolute inset-0 h-full w-full opacity-20 mix-blend-soft-light"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="aurora-grid" width="160" height="160" patternUnits="userSpaceOnUse">
            <path
              d="M 160 0 L 0 0 0 160"
              fill="none"
              stroke="rgba(148, 163, 184, 0.12)"
              strokeWidth="1"
            />
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="rgba(148, 163, 184, 0.08)"
              strokeWidth="0.5"
            />
          </pattern>
          <radialGradient id="aurora-vignette">
            <stop offset="0%" stopColor="rgba(15, 23, 42, 0)" />
            <stop offset="70%" stopColor="rgba(15, 23, 42, 0.35)" />
            <stop offset="100%" stopColor="rgba(15, 23, 42, 0.85)" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#aurora-grid)" />
        <rect width="100%" height="100%" fill="url(#aurora-vignette)" />
      </svg>
    </div>
  )
}

const AuroraBackground = memo(AuroraBackgroundComponent)
AuroraBackground.displayName = 'AuroraBackground'

export default AuroraBackground


