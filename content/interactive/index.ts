import htmlIntro from './html-intro'
import cssBasics from './css-basics'
import jsConsole from './js-console'
import domManipulation from './dom-manipulation'
import miniProjectTodo from './mini-project-todo'
import { InteractiveLesson } from './types'

export const interactiveLessons: Record<string, InteractiveLesson> = {
  [htmlIntro.slug]: htmlIntro,
  [cssBasics.slug]: cssBasics,
  [jsConsole.slug]: jsConsole,
  [domManipulation.slug]: domManipulation,
  [miniProjectTodo.slug]: miniProjectTodo,
}

export const interactiveLessonSlugs = Object.keys(interactiveLessons)

