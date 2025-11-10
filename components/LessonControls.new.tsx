import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@radix-ui/react-icons'
import { isCompleted, markCompleted } from '../lib/progress'
import { getPrevLesson, getNextLesson } from '../lib/tracks'

interface LessonControlsProps {
  trackId: string | null
  slug: string
  nextSlug?: string | null
  totalLessons?: number
}

export default function LessonControls({ trackId, slug, nextSlug }: LessonControlsProps) {
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const prevSlug = trackId ? getPrevLesson(trackId, slug) : null

  // Check completion on mount
  useEffect(() => {
    if (trackId) setDone(isCompleted(trackId, slug))
  }, [trackId, slug])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      // Alt/Option + Enter to mark complete
      if (e.key === 'Enter' && (e.altKey || e.metaKey)) {
        e.preventDefault()
        if (!done && !loading) handleMark()
      }
      // Alt/Option + Right Arrow for next lesson
      else if (e.key === 'ArrowRight' && (e.altKey || e.metaKey)) {
        e.preventDefault()
        if (nextSlug) router.push(`/lessons/${nextSlug}`)
      }
      // Alt/Option + Left Arrow for previous lesson
      else if (e.key === 'ArrowLeft' && (e.altKey || e.metaKey)) {
        e.preventDefault()
        if (prevSlug) router.push(`/lessons/${prevSlug}`)
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [done, loading, nextSlug, prevSlug, router])

  const handleMark = useCallback(async () => {
    if (!trackId || loading) return
    setLoading(true)
    setError(null)

    try {
      // Mark completed locally first for instant feedback
      markCompleted(trackId, slug)
      setDone(true)

      // Try to persist to server
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ track: trackId, lesson: slug })
      })

      if (!res.ok) throw new Error('Failed to save progress')

      // Auto-advance after a short delay
      if (nextSlug) {
        setTimeout(() => router.push(`/lessons/${nextSlug}`), 600)
      }
    } catch (e) {
      console.error('Error saving progress:', e)
      setError('Failed to save progress. Your progress is saved locally but may not sync across devices.')
      setDone(false)
    } finally {
      setLoading(false)
    }
  }, [trackId, slug, nextSlug, router, loading])

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          {prevSlug ? (
            <Link 
              href={`/lessons/${prevSlug}`}
              className="inline-flex items-center px-4 py-2 text-sm border rounded hover:bg-gray-50"
              title="Alt/Option + ←"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-2" />
              Previous lesson
            </Link>
          ) : null}
        </div>

        <div className="flex-1 text-center">
          {!done ? (
            <button 
              className={`px-6 py-2 bg-brand text-white rounded flex items-center justify-center mx-auto
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-dark'}`}
              onClick={handleMark}
              disabled={loading}
              title="Alt/Option + Enter"
            >
              {loading ? (
                <span className="inline-block animate-spin mr-2">⋯</span>
              ) : (
                <CheckIcon className="w-4 h-4 mr-2" />
              )}
              Mark complete
            </button>
          ) : (
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded inline-flex items-center">
              <CheckIcon className="w-4 h-4 mr-2" />
              Completed
            </span>
          )}
        </div>

        <div className="flex-1 text-right">
          {nextSlug ? (
            <Link
              href={`/lessons/${nextSlug}`}
              className={`inline-flex items-center px-4 py-2 text-sm rounded
                ${done ? 'bg-brand text-white hover:bg-brand-dark' : 'border hover:bg-gray-50'}`}
              title="Alt/Option + →"
            >
              Next lesson
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </Link>
          ) : (
            <span className="text-slate-600 text-sm">
              Last lesson in track
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  )
}