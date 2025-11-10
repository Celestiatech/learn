// UI components for track progress and completion
import { useCallback, useEffect, useState } from 'react'
import { getCompletedLessons, getCompletedForTrack, isTrackCompleted } from '../lib/progress'
import { getTrackProgress } from '../lib/tracks'
import confetti from 'canvas-confetti'

import { useCelebration } from './Celebration'

export function useTrackProgress(trackId: string | null) {
  const [progress, setProgress] = useState({ completed: 0, total: 0 })
  const [isComplete, setIsComplete] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const updateProgress = useCallback(() => {
    if (!trackId) return
    const { total } = getTrackProgress(trackId)
    const completed = getCompletedForTrack(trackId)
    const wasComplete = isComplete
    const nowComplete = completed === total && total > 0
    
    setProgress({ completed, total })
    setIsComplete(nowComplete)

    // Trigger celebration when track is newly completed
    if (!wasComplete && nowComplete) {
      setShowModal(true)
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#20e052', '#673de6', '#ffcd35']
      })
    }
    setIsComplete(isTrackCompleted(trackId, total))
  }, [trackId])

  // Listen for progress updates
  useEffect(() => {
    updateProgress()
    const handleUpdate = () => updateProgress()
    window.addEventListener('progress-update', handleUpdate)
    return () => window.removeEventListener('progress-update', handleUpdate)
  }, [updateProgress])

  // Return progress info and celebration function
  return {
    ...progress,
    isComplete,
    celebrate: () => {
      if (isComplete) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      }
    }
  }
}

export function useKeyboardShortcuts(onNext: () => void, onComplete: () => void) {
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Alt/Option + Enter to mark complete
      if (e.key === 'Enter' && (e.altKey || e.metaKey)) {
        e.preventDefault()
        onComplete()
      }
      // Alt/Option + Right Arrow for next lesson
      else if (e.key === 'ArrowRight' && (e.altKey || e.metaKey)) {
        e.preventDefault()
        onNext()
      }
    }

    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [onNext, onComplete])
}

export function TrackCompletion({ trackId, totalLessons }: { trackId: string, totalLessons: number }) {
  const [showModal, setShowModal] = useState(false)
  const { completed, total, isComplete } = useTrackProgress(trackId)

  useEffect(() => {
    if (isComplete && !showModal) {
      setShowModal(true)
    }
  }, [isComplete, showModal])

  if (!showModal) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="rounded-2xl border border-soft bg-surface-card p-6 max-w-md text-center shadow-soft">
        <h2 className="text-2xl font-bold text-heading mb-4">🎉 Track Completed!</h2>
        <p className="text-secondary mb-4">
          Congratulations! You've completed all {total} lessons in this track.
        </p>
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 rounded-full bg-[var(--gradient-brand-alt)] text-white font-semibold tracking-[0.14em] transition hover:brightness-110"
        >
          Continue Learning
        </button>
      </div>
    </div>
  )
}