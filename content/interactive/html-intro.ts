import { InteractiveLesson } from './types'
import { normalizeWhitespace, parseHtmlDocument } from './utils'

const starter = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Learning Collective — HTML Foundations</title>
  </head>
  <body>
    
  </body>
</html>
`

const lesson: InteractiveLesson = {
  slug: 'intro',
  title: 'HTML Foundations',
  description:
    'Start your journey by crafting semantic structure, meaningful content, and accessible navigation with HTML.',
  track: 'HTML Story Mode',
  estimatedTime: '25 minutes',
  steps: [
    {
      id: 'html-heading',
      title: 'Introduce your page with a semantic heading',
      instructions: [
        'Inside the `<body>` element, add a single `<h1>` element.',
        'The heading should contain the text “Learning Collective”.',
        'Keep the existing document structure intact.',
      ],
      starterCode: starter,
      language: 'html',
      preview: { mode: 'html' },
      tests: [
        {
          id: 'doctype-present',
          description: 'The document includes a <!DOCTYPE html> declaration.',
          run: (code) => /<!doctype html>/i.test(code),
          hint: 'Ensure the first line is `<!DOCTYPE html>`.',
        },
        {
          id: 'has-heading',
          description: 'There is an <h1> element inside <body> containing “Learning Collective”.',
          run: (code) => {
            const doc = parseHtmlDocument(code)
            if (!doc) return false
            const heading = doc.querySelector('body h1')
            if (!heading) return false
            return normalizeWhitespace(heading.textContent || '').includes('Learning Collective')
          },
          hint: 'Double-check you used an `<h1>` element with the words “Learning Collective”.',
        },
      ],
      completionMessage: 'Great! Semantic headings make your content easier to scan for everyone.',
    },
    {
      id: 'html-paragraph',
      title: 'Describe what learners will experience',
      instructions: [
        'Below the `<h1>`, add a `<p>` element that explains the benefit of Learning Collective in one sentence.',
        'Use at least 12 words to keep the description meaningful.',
      ],
      starterCode: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Learning Collective — HTML Foundations</title>
  </head>
  <body>
    <h1>Learning Collective</h1>
    
  </body>
</html>
`,
      language: 'html',
      preview: { mode: 'html' },
      tests: [
        {
          id: 'paragraph-exists',
          description: 'A paragraph follows the heading.',
          run: (code) => {
            const doc = parseHtmlDocument(code)
            if (!doc) return false
            const paragraph = doc.querySelector('body p')
            return !!paragraph
          },
          hint: 'Insert a `<p>` element right after the heading.',
        },
        {
          id: 'paragraph-length',
          description: 'The paragraph contains at least twelve words.',
          run: (code) => {
            const doc = parseHtmlDocument(code)
            if (!doc) return false
            const paragraph = doc.querySelector('body p')
            if (!paragraph) return false
            const wordCount = normalizeWhitespace(paragraph.textContent || '').split(' ').length
            return wordCount >= 12
          },
          hint: 'Write a complete sentence with more detail—aim for 12+ words.',
        },
      ],
      completionMessage: 'Nice description! Clear copy keeps learners engaged.',
    },
    {
      id: 'html-list',
      title: 'Highlight key features with a list',
      instructions: [
        'Create an unordered list `<ul>` after the paragraph.',
        'Add at least three `<li>` items describing platform features (e.g., “Interactive playground”).',
      ],
      starterCode: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Learning Collective — HTML Foundations</title>
  </head>
  <body>
    <h1>Learning Collective</h1>
    <p>Learning Collective blends challenge-based certifications with on-demand references so you always know what to build next.</p>
    
  </body>
</html>
`,
      language: 'html',
      preview: { mode: 'html' },
      tests: [
        {
          id: 'unordered-list',
          description: 'A <ul> element is present after the paragraph.',
          run: (code) => {
            const doc = parseHtmlDocument(code)
            if (!doc) return false
            const list = doc.querySelector('body ul')
            return !!list
          },
          hint: 'Add `<ul>` right after the paragraph.',
        },
        {
          id: 'list-items',
          description: 'The list contains at least three <li> items.',
          run: (code) => {
            const doc = parseHtmlDocument(code)
            if (!doc) return false
            const items = doc.querySelectorAll('body ul li')
            return items.length >= 3
          },
          hint: 'Include at least three `<li>` elements inside the list.',
        },
      ],
      completionMessage: 'Lists help learners quickly scan value propositions.',
    },
    {
      id: 'html-link',
      title: 'Invite learners to explore further',
      instructions: [
        'Add an anchor link `<a>` below the list.',
        'Set the `href` attribute to `https://playground.learningcollective.dev`.',
        'The link text should invite learners to “Try the playground”.',
      ],
      starterCode: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Learning Collective — HTML Foundations</title>
  </head>
  <body>
    <h1>Learning Collective</h1>
    <p>Learning Collective blends challenge-based certifications with on-demand references so you always know what to build next.</p>
    <ul>
      <li>Guided certifications with built-in storylines</li>
      <li>Live playground for experimenting with code</li>
      <li>Supportive community with weekly check-ins</li>
    </ul>
    
  </body>
</html>
`,
      language: 'html',
      preview: { mode: 'html' },
      tests: [
        {
          id: 'anchor-exists',
          description: 'A link element <a> appears after the list.',
          run: (code) => {
            const doc = parseHtmlDocument(code)
            if (!doc) return false
            const link = doc.querySelector('body a')
            return !!link
          },
          hint: 'Add an `<a>` element under the list.',
        },
        {
          id: 'anchor-href',
          description: 'The link points to https://playground.learningcollective.dev.',
          run: (code) => {
            const doc = parseHtmlDocument(code)
            if (!doc) return false
            const link = doc.querySelector('body a')
            if (!link) return false
            return link.getAttribute('href') === 'https://playground.learningcollective.dev'
          },
          hint: 'Ensure the `href` attribute is set exactly to the playground URL.',
        },
        {
          id: 'anchor-text',
          description: 'The link text invites learners to try the playground.',
          run: (code) => {
            const doc = parseHtmlDocument(code)
            if (!doc) return false
            const link = doc.querySelector('body a')
            if (!link) return false
            return /try the playground/i.test(link.textContent || '')
          },
          hint: 'Use link text similar to “Try the playground”.',
        },
      ],
      completionMessage: 'Awesome! Your landing content now welcomes learners with a clear call-to-action.',
    },
  ],
}

export default lesson

