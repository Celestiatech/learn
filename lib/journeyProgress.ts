import { JourneyCourse, JourneyTask } from '../content/tracks/journey'

export const journeyProgressStorageKey = 'learning-site:journey-progress'

export type JourneyTaskStatus = 'locked' | 'in-progress' | 'completed'

export function computeTaskStatus(
  task: JourneyTask,
  completedIds: Set<string>,
  orderedTasks: JourneyTask[]
): JourneyTaskStatus {
  if (completedIds.has(task.id)) {
    return 'completed'
  }
  const prerequisites = orderedTasks.filter((entry) => entry.order < task.order)
  const meetsPrerequisites = prerequisites.every((entry) => completedIds.has(entry.id))
  return meetsPrerequisites ? 'in-progress' : 'locked'
}

export function findNextTask(task: JourneyTask, ordered: JourneyTask[], completed: Set<string>) {
  const currentIndex = ordered.findIndex((entry) => entry.id === task.id)
  if (currentIndex === -1) return null
  for (let index = currentIndex + 1; index < ordered.length; index += 1) {
    const candidate = ordered[index]
    if (!completed.has(candidate.id)) {
      return candidate
    }
  }
  return null
}

export function findChapterAndTaskIndices(course: JourneyCourse, taskId: string) {
  for (let chapterIndex = 0; chapterIndex < course.chapters.length; chapterIndex += 1) {
    const taskIndex = course.chapters[chapterIndex].tasks.findIndex((task) => task.id === taskId)
    if (taskIndex !== -1) {
      return { chapterIndex, taskIndex }
    }
  }
  return null
}

