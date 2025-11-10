import tracksManifest from '../content/tracks/tracks.json'

export interface Track {
  title: string
  slug: string
  lessons: string[]
}

export interface TracksManifest {
  [key: string]: Track
}

const tracks = tracksManifest as TracksManifest

export function getTrackForLesson(lessonSlug: string): { trackId: string; track: Track; lessonIndex: number } | null {
  for (const [trackId, track] of Object.entries(tracks)) {
    const lessonIndex = track.lessons.indexOf(lessonSlug)
    if (lessonIndex !== -1) {
      return { trackId, track, lessonIndex }
    }
  }
  return null
}

export function getNextLesson(trackId: string, currentSlug: string): string | null {
  const trackInfo = getTrackForLesson(currentSlug)
  if (!trackInfo || trackInfo.trackId !== trackId) return null

  const { track, lessonIndex } = trackInfo
  if (lessonIndex + 1 < track.lessons.length) {
    return track.lessons[lessonIndex + 1]
  }
  return null
}

export function getPrevLesson(trackId: string, currentSlug: string): string | null {
  const trackInfo = getTrackForLesson(currentSlug)
  if (!trackInfo || trackInfo.trackId !== trackId) return null

  const { track, lessonIndex } = trackInfo
  if (lessonIndex > 0) {
    return track.lessons[lessonIndex - 1]
  }
  return null
}

export function getTrackProgress(trackId: string): { completed: number; total: number } {
  const track = tracks[trackId]
  if (!track) return { completed: 0, total: 0 }
  return { completed: 0, total: track.lessons.length }
}