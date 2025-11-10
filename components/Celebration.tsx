import { useEffect, useState } from 'react'
import { CheckIcon, StarIcon } from '@radix-ui/react-icons'

interface CelebrationModalProps {
  type: 'lesson' | 'track'
  title: string
  subtitle?: string
  onClose: () => void
}

function CelebrationModal({ type, title, subtitle, onClose }: CelebrationModalProps) {
  useEffect(() => {
    let isMounted = true

    async function launchConfetti() {
      const confetti = (await import('canvas-confetti')).default
      if (!isMounted) return
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#20e052', '#673de6', '#ffcd35'],
      })
    }

    launchConfetti()

    const timeoutId = setTimeout(() => {
      onClose()
    }, 5000)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur">
      <div className="animate-scale-in rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-900 sm:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
            {type === 'lesson' ? (
              <CheckIcon className="h-8 w-8 text-brand" />
            ) : (
              <StarIcon className="h-8 w-8 text-yellow-500" />
            )}
          </div>
          
          <div className="relative mb-2">
            <StarIcon className="absolute -left-6 -top-4 h-5 w-5 text-yellow-500 opacity-75" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              {title}
            </h2>
            <StarIcon className="absolute -right-6 -top-4 h-5 w-5 text-yellow-500 opacity-75" />
          </div>

          {subtitle && (
            <p className="mb-8 text-slate-600 dark:text-slate-400">{subtitle}</p>
          )}

          <button
            onClick={onClose}
            className="rounded-lg bg-brand px-6 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  )
}

export function useCelebration() {
  const [celebration, setCelebration] = useState<{
    type: 'lesson' | 'track'
    title: string
    subtitle?: string
  } | null>(null)

  const triggerCelebration = (type: 'lesson' | 'track', title: string, subtitle?: string) => {
    setCelebration({ type, title, subtitle })
  }

  const clearCelebration = () => {
    setCelebration(null)
  }

  const CelebrationComponent = celebration ? (
    <CelebrationModal
      type={celebration.type}
      title={celebration.title}
      subtitle={celebration.subtitle}
      onClose={clearCelebration}
    />
  ) : null

  return {
    triggerCelebration,
    clearCelebration,
    CelebrationComponent
  }
}