import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../lib/authOptions'
import { getPrisma } from '../../lib/prisma'
type LessonProgressRecord = {
  trackId: string
  lessonSlug: string
  completedAt: Date | null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    try {
      const prisma = getPrisma()
      if (!prisma) {
        return res.status(200).json({ progress: [], tasks: [] })
      }

      const [taskProgress, lessonProgress] = await Promise.all([
        prisma.taskProgress.findMany({
          where: { userId: session.user.id, status: 'completed' },
          select: {
            task: {
              select: {
                id: true,
                chapter: {
                  select: {
                    course: {
                      select: { slug: true },
                    },
                  },
                },
              },
            },
            completedAt: true,
            xpEarned: true,
          },
        }),
        prisma.lessonProgress.findMany({
          where: { userId: session.user.id },
          orderBy: { completedAt: 'desc' },
        }),
      ])

      const tasks = taskProgress.map((item: {
        task: {
          id: string
          chapter: {
            course: {
              slug: string
            }
          }
        }
        completedAt: Date
        xpEarned: number
      }) => ({
        taskId: item.task.id,
        courseSlug: item.task.chapter.course.slug,
        completedAt: item.completedAt,
        xpEarned: item.xpEarned,
      }))

      const progress = lessonProgress.map((item: LessonProgressRecord) => ({
        track: item.trackId,
        lesson: item.lessonSlug,
        completed: true,
        completedAt: item.completedAt,
      }))

      return res.status(200).json({ progress, tasks })
    } catch (error) {
      console.error('Progress fetch failed', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  if (req.method === 'POST') {
    const { taskId, xp = 0, track, lesson } = req.body as {
      taskId?: string
      xp?: number
      track?: string
      lesson?: string
    }

    try {
      const prisma = getPrisma()

      if (!prisma) {
        // No database available or this is a simple lesson completion.
        return res.status(200).json({
          stored: false,
          message: 'Progress stored locally',
          track,
          lesson,
        })
      }

      if (taskId) {
        const task = await prisma.task.findUnique({ where: { id: taskId }, select: { xpReward: true } })
        if (!task) {
          return res.status(404).json({ error: 'Task not found' })
        }

        const xpEarned = xp || task.xpReward

        const progress = await prisma.taskProgress.upsert({
          where: { userId_taskId: { userId: session.user.id, taskId } },
          update: { status: 'completed', xpEarned, completedAt: new Date() },
          create: { userId: session.user.id, taskId, status: 'completed', xpEarned, completedAt: new Date() },
        })

        await prisma.user.update({
          where: { id: session.user.id },
          data: { xp: { increment: xpEarned }, lastActive: new Date() },
        })

        return res.status(200).json({ stored: true, progress })
      }

      if (!track || !lesson) {
        return res.status(400).json({ error: 'Missing track or lesson identifier' })
      }

      const progress = await prisma.lessonProgress.upsert({
        where: {
          userId_trackId_lessonSlug: {
            userId: session.user.id,
            trackId: track,
            lessonSlug: lesson,
          },
        },
        update: { completedAt: new Date() },
        create: {
          userId: session.user.id,
          trackId: track,
          lessonSlug: lesson,
        },
      })

      await prisma.user.update({
        where: { id: session.user.id },
        data: { lastActive: new Date() },
      })

      return res.status(200).json({
        stored: true,
        progress: {
          track: progress.trackId,
          lesson: progress.lessonSlug,
          completedAt: progress.completedAt,
        },
      })
    } catch (error) {
      console.error('Progress update failed', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }

  res.setHeader('Allow', 'GET,POST')
  return res.status(405).end()
}
