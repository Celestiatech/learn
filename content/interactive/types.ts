export type LessonTest = {
  id: string
  description: string
  run: (code: string) => boolean | Promise<boolean>
  hint?: string
}

export type LessonPreview =
  | {
      mode: 'html'
      wrapper?: (code: string) => string
    }
  | {
      mode: 'javascript'
      wrapper?: (code: string) => string
    }

export type LessonStep = {
  id: string
  title: string
  instructions: string[]
  starterCode: string
  language: 'html' | 'css' | 'javascript'
  tests: LessonTest[]
  preview?: LessonPreview
  resources?: { label: string; href: string }[]
  completionMessage?: string
}

export type InteractiveLesson = {
  slug: string
  title: string
  description: string
  track: string
  estimatedTime: string
  steps: LessonStep[]
}

