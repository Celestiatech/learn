export type ProgressMap = Record<string, Record<string, boolean>>

const STORAGE_KEY = 'learning-site-progress'

// Read progress data from localStorage
function read(): ProgressMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    console.error('Progress read error:', e)
    return {}
  }
}

// Write progress data to localStorage
function write(data: ProgressMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Progress write error:', e)
  }
}

// Mark a lesson as completed
export function markCompleted(track: string, slug: string) {
  const data = read()
  if (!data[track]) data[track] = {}
  data[track][slug] = true
  write(data)

  // Dispatch event for components to update
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('progress-update', {
      detail: { track, slug, completed: true }
    }))
  }
}

// Check if a lesson is completed
export function isCompleted(track: string, slug: string) {
  const data = read()
  return !!(data[track] && data[track][slug])
}

// Clear all progress data
export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('progress-update', {
        detail: { cleared: true }
      }))
    }
  } catch(e) {
    console.error('Clear progress error:', e)
  }
}

// Get number of completed lessons for a track
export function getCompletedForTrack(track: string) {
  const data = read()
  return data[track] ? Object.keys(data[track]).length : 0
}

type RemoteProgressRecord = { track?: string; lesson?: string; completed?: boolean }

export function hydrateFromRemote(records: RemoteProgressRecord[]) {
  if (typeof window === 'undefined') return
  if (!Array.isArray(records) || records.length === 0) return

  const data = read()
  let changed = false

  records.forEach(({ track, lesson }) => {
    if (!track || !lesson) return
    if (!data[track]) data[track] = {}
    if (!data[track][lesson]) {
      data[track][lesson] = true
      changed = true
    }
  })

  if (changed) {
    write(data)
    window.dispatchEvent(
      new CustomEvent('progress-update', {
        detail: { synced: true },
      })
    )
  }
}

// Get all completed lessons for a track
export function getCompletedLessons(track: string): string[] {
  const data = read()
  return data[track] ? Object.keys(data[track]) : []
}

// Check if a track is fully completed
export function isTrackCompleted(track: string, totalLessons: number): boolean {
  const completed = getCompletedForTrack(track)
  return completed === totalLessons
}
