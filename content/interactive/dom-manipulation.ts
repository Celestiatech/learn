import { InteractiveLesson } from './types'
import { parseHtmlDocument, runJavaScriptWithDocument } from './utils'

const htmlTemplate = `<div id="app">
  <div class="card">
    <h1 id="title">Loading…</h1>
    <p id="description"></p>
    <button id="cta">Loading</button>
  </div>
</div>`

const lesson: InteractiveLesson = {
  slug: 'dom-manipulation',
  title: 'DOM Manipulation Patterns',
  description:
    'Practice updating the DOM with JavaScript by rendering content, toggling themes, and wiring up interactions.',
  track: 'JavaScript Questline',
  estimatedTime: '30 minutes',
  steps: [
    {
      id: 'render-card',
      title: 'Render a hero card dynamically',
      instructions: [
        'Select the `#title`, `#description`, and `#cta` elements from the template.',
        'Update the title to “Upgrade your skills today”.',
        'Write a helper function `renderHero()` that injects a description and call-to-action text, then invoke it immediately.',
      ],
      starterCode: `// Your DOM manipulation code goes here
function renderHero() {
  // TODO: write your implementation
}

renderHero();
`,
      language: 'javascript',
      tests: [
        {
          id: 'function-exists',
          description: '`renderHero` function is defined.',
          run: (code) => {
            try {
              const fn = new Function(`${code}; return typeof renderHero === 'function';`)
              return fn()
            } catch {
              return false
            }
          },
          hint: 'Define `function renderHero() { ... }` before calling it.',
        },
        {
          id: 'content-updated',
          description: 'Title, description, and button text are updated when the function runs.',
          run: (code) => {
            const result = runJavaScriptWithDocument(
              `
${code}
`,
              htmlTemplate
            )
            if (result.error) return false
            const doc = result.document
            if (!doc) return false
            const title = doc.querySelector('#title')
            const description = doc.querySelector('#description')
            const cta = doc.querySelector('#cta')
            if (!title || !description || !cta) return false
            const titleMatches = /Upgrade your skills today/i.test(title.textContent || '')
            const descriptionHasText = (description.textContent || '').trim().length > 10
            const ctaHasText = (cta.textContent || '').trim().length > 2
            return titleMatches && descriptionHasText && ctaHasText
          },
          hint: 'Use `textContent` or `innerText` to set new copy on each element.',
        },
      ],
      completionMessage: 'Nice! You now render dynamic content into the DOM.',
    },
    {
      id: 'toggle-theme',
      title: 'Add a theme toggle',
      instructions: [
        'Create a function `toggleTheme()` that toggles a `dark` class on the `#app` element.',
        'When the class is applied, set `document.body.dataset.theme = "dark"`; otherwise, remove the dataset attribute.',
        'Call `toggleTheme()` twice to ensure the logic switches between states.',
      ],
      starterCode: `function renderHero() {
  const title = document.querySelector('#title');
  const description = document.querySelector('#description');
  const cta = document.querySelector('#cta');

  if (!title || !description || !cta) return;

  title.textContent = 'Upgrade your skills today';
  description.textContent = 'Level up with story-driven challenges, live playgrounds, and peer feedback.';
  cta.textContent = 'Start now';
}

renderHero();

// Write toggleTheme here

toggleTheme();
toggleTheme();
`,
      language: 'javascript',
      tests: [
        {
          id: 'toggle-function',
          description: '`toggleTheme` function is defined.',
          run: (code) => {
            try {
              const fn = new Function(`${code}; return typeof toggleTheme === 'function';`)
              return fn()
            } catch {
              return false
            }
          },
          hint: 'Define `function toggleTheme() { ... }` before calling it.',
        },
        {
          id: 'toggle-behavior',
          description: 'Toggling the theme adds/removes the class and dataset state.',
          run: (code) => {
            const script = `
${code}
const app = document.querySelector('#app');
const firstState = app?.classList.contains('dark') ? 'dark' : 'light';
toggleTheme();
const secondState = app?.classList.contains('dark') ? 'dark' : 'light';
const bodyTheme = document.body.dataset.theme || 'light';
return { firstState, secondState, bodyTheme };
`
            const parser = new DOMParser()
            const doc = parser.parseFromString(htmlTemplate, 'text/html')

            let result: { firstState: string; secondState: string; bodyTheme: string } | null = null

            try {
              const fn = new Function('document', 'DOMParser', script)
              result = fn(doc, DOMParser)
            } catch {
              return false
            }

            if (!result) return false
            return result.secondState === 'dark' && result.bodyTheme === 'dark'
          },
          hint: 'Use `element.classList.toggle("dark")` and update `document.body.dataset.theme` accordingly.',
        },
      ],
      completionMessage: 'Theme toggles keep interfaces flexible—great job!',
    },
    {
      id: 'wire-events',
      title: 'Wire up interactive event handlers',
      instructions: [
        'Write a function `wireCta()` that attaches a click event listener to the `#cta` button.',
        'When clicked, the button should update the `#description` text to mention “Progress saved!”',
        'Invoke `wireCta()` at the end of your script.',
      ],
      starterCode: `function renderHero() {
  const title = document.querySelector('#title');
  const description = document.querySelector('#description');
  const cta = document.querySelector('#cta');

  if (!title || !description || !cta) return;

  title.textContent = 'Upgrade your skills today';
  description.textContent = 'Level up with story-driven challenges, live playgrounds, and peer feedback.';
  cta.textContent = 'Start now';
}

function toggleTheme() {
  const app = document.querySelector('#app');
  if (!app) return;

  const isDark = app.classList.toggle('dark');
  if (isDark) {
    document.body.dataset.theme = 'dark';
  } else {
    delete document.body.dataset.theme;
  }
}

renderHero();
toggleTheme();
toggleTheme();

// Write wireCta here

wireCta();
`,
      language: 'javascript',
      tests: [
        {
          id: 'wire-function',
          description: '`wireCta` function is defined.',
          run: (code) => {
            try {
              const fn = new Function(`${code}; return typeof wireCta === 'function';`)
              return fn()
            } catch {
              return false
            }
          },
          hint: 'Define `function wireCta() { ... }` before calling it.',
        },
        {
          id: 'event-updates-copy',
          description: 'Clicking the CTA updates the description to mention “Progress saved!”.',
          run: (code) => {
            const doc = parseHtmlDocument(htmlTemplate)
            if (!doc) return false

            try {
              const runner = new Function('document', `${code}; const button = document.querySelector('#cta'); button?.click();`)
              runner(doc)
            } catch {
              return false
            }

            const description = doc.querySelector('#description')
            if (!description) return false
            return /progress saved/i.test(description.textContent || '')
          },
          hint: 'Inside the event handler, update the description text to include “Progress saved!”.',
        },
      ],
      completionMessage: 'You just wired a complete interaction loop—awesome work!',
    },
  ],
}

export default lesson

