import { LessonTest } from '../interactive/types'
import { normalizeWhitespace } from '../interactive/utils'
import htmlTaskSections from './htmlTaskList'

export type JourneyTask = {
  id: string
  order: number
  title: string
  summary: string
  explanation: string
  instructions: string[]
  starterCode: string
  language: 'html' | 'css' | 'javascript' | 'typescript' | 'php' | 'python' | 'markdown'
  tests: LessonTest[]
  audioNarration: string
  resources?: { label: string; href: string }[]
}

export type JourneyChapter = {
  id: string
  index: number
  title: string
  description: string
  tasks: JourneyTask[]
}

export type JourneyCourse = {
  id: string
  title: string
  tagline: string
  category: 'frontend' | 'backend' | 'fullstack'
  access: 'free'
  certificate: {
    title: string
    description: string
  }
  membershipPerk: {
    title: string
    description: string
  }
  voiceInterview: {
    title: string
    description: string
    focus: string[]
  }
  chapters: JourneyChapter[]
}

const htmlBaseStarter = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>SimplyCode – HTML Journey Workspace</title>
  </head>
  <body>
    <main id="journey-root">
      <!-- Build your solution inside this main element -->
    </main>
  </body>
</html>
`

const htmlJourneyResource = {
  label: 'View journey checklist',
  href: '/curriculum/html-tasks',
}

const stripTaskPrefix = (label: string) =>
  label
    .replace(/^\d+(?:–\d+)?\.\s*/, '')
    .replace(/^\d+\.\s*/, '')
    .trim()

function generateHtmlJourneyChapters(): JourneyChapter[] {
  let order = 1

  return htmlTaskSections.map((section, sectionIndex) => {
    const tasks: JourneyTask[] = section.tasks.map((taskLabel, taskIndex) => {
      const cleanTitle = stripTaskPrefix(taskLabel)
      const currentOrder = order
      order += 1

      return {
        id: `html-phase-${sectionIndex + 1}-task-${taskIndex + 1}`,
        order: currentOrder,
        title: cleanTitle,
        summary: `${section.phase} · ${section.tagline}`,
        explanation: `${section.mission} Focus on: ${cleanTitle}.`,
        instructions: [
          `Project focus: ${section.project}`,
          `Mission objective: ${cleanTitle}`,
          'Implement your solution in the workspace below, then validate to mark it complete.',
        ],
        starterCode: htmlBaseStarter,
        language: 'html',
        tests: [],
        audioNarration: `Mission ${currentOrder}. ${section.mission} Objective: ${cleanTitle}.`,
        resources: [htmlJourneyResource],
      }
    })

    return {
      id: `html-phase-${sectionIndex + 1}`,
      index: sectionIndex,
      title: `${section.phase} — ${section.tagline}`,
      description: `${section.mission} ${section.projectBrief}`,
      tasks,
    }
  })
}

const keywordFromTopic = (topic: string) =>
  topic
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 4)

const toSlug = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const countWords = (content: string) => {
  const withoutCode = content.replace(/```[\s\S]*?```/g, ' ')
  const normalized = normalizeWhitespace(withoutCode)
  if (!normalized) return 0
  return normalized.split(/\s+/).filter(Boolean).length
}

const createWordCountTest = (id: string, minWords: number): LessonTest => ({
  id,
  description: `Write at least ${minWords} words in your study note.`,
  run: (code: string) => countWords(code) >= minWords,
  hint: `Expand your explanation to at least ${minWords} words with meaningful detail.`,
})

function generateGenericCourse(
  id: string,
  title: string,
  tagline: string,
  category: JourneyCourse['category'],
  language: JourneyTask['language']
): JourneyCourse {
  const chapters: JourneyChapter[] = []
  const totalChapters = 10
  const tasksPerChapter = 100

  let globalOrder = 1

  for (let chapterIndex = 0; chapterIndex < totalChapters; chapterIndex += 1) {
    const tasks: JourneyTask[] = []
    for (let taskIndex = 0; taskIndex < tasksPerChapter; taskIndex += 1) {
      const paddedOrder = String(globalOrder).padStart(4, '0')
      const codeHint = `// ${title} challenge ${globalOrder}`
      tasks.push({
        id: `${id}-ch${chapterIndex + 1}-task-${taskIndex + 1}`,
        order: globalOrder,
        title: `Scenario ${paddedOrder}`,
        summary: 'Describe how you would solve the requirement before implementing it in code.',
        explanation:
          'These tasks focus on system design thinking. Write pseudo-code or outline the algorithm that would address the scenario. Real-time voice interview prep will evaluate your ability to reason verbally.',
        instructions: [
          `Outline a solution for challenge ${globalOrder} using well-structured pseudo-code.`,
          'Highlight the trade-offs, data structures, or APIs you would rely on.',
          'End with a summary comment describing how you would validate success.',
        ],
        starterCode: language === 'markdown' ? `# ${title} challenge ${globalOrder}\n\n` : `${codeHint}
`,
        language,
        tests: [
          {
            id: 'includes-tradeoffs',
            description: 'Your outline mentions the word "trade-off" or "tradeoff".',
            run: (code) => /trade-?off/i.test(code),
            hint: 'Discuss at least one trade-off in your outline.',
          },
          {
            id: 'includes-validate',
            description: 'Outline mentions how to validate success.',
            run: (code) => /validate|test case/i.test(code),
            hint: 'Describe how you would confirm your solution works.',
          },
        ],
        audioNarration: `Scenario ${globalOrder}. Talk through the pseudo-code for this challenge, mention the trade-offs, and end with how you would validate success.`,
        resources: [
          { label: 'System Design Checklist', href: 'https://simplycode.dev/resources/system-design' },
        ],
      })
      globalOrder += 1
    }

    chapters.push({
      id: `${id}-chapter-${chapterIndex + 1}`,
      index: chapterIndex,
      title: `Chapter ${chapterIndex + 1}`,
      description: `Spend this chapter drilling interview-style scenarios. Each includes ${tasksPerChapter} questions that reinforce deliberate practice.`,
      tasks,
    })
  }

  return {
    id,
    title,
    tagline,
    category,
    access: 'free',
    certificate: {
      title: `${title} Mastery Certificate`,
      description:
        'Complete every challenge to unlock a verifiable digital certificate you can share with recruiters and on LinkedIn.',
    },
    membershipPerk: {
      title: 'Expert Office Hours',
      description:
        'Premium members can book unlimited office-hour sessions with IT experts to review solutions, pair program, or prep for interviews.',
    },
    voiceInterview: {
      title: `${title} Voice Interview Lab`,
      description:
        'Upgrade for scripted voice simulations powered by GPT-4o voice to rehearse high-pressure interviews.',
      focus: ['Behavioural drills', 'Concept refreshers', 'Hands-on whiteboarding prompts'],
    },
    chapters,
  }
}

const htmlCourse: JourneyCourse = {
  id: 'html',
  title: 'SimplyCode HTML Adventure',
  tagline: "Build SimplyCode's site through 345 narrative HTML missions.",
  category: 'frontend',
  access: 'free',
  certificate: {
    title: 'SimplyCode HTML Adventure Completion Certificate',
    description:
      'Complete all 345 missions to unlock a certificate demonstrating mastery of semantic HTML, storytelling layouts, and accessibility foundations.',
  },
  membershipPerk: {
    title: 'Front-end Expert Coaching',
    description:
      'Active members can request async reviews or live office hours with senior front-end engineers to refine solutions and unblock missions.',
  },
  voiceInterview: {
    title: 'HTML Voice Interview Bootcamp',
    description:
      'Upgrade for voice-led mock interviews inspired by SimplyCode missions covering semantics, forms, SEO, and document structure.',
    focus: ['Semantic HTML', 'Accessibility heuristics', 'SEO hygiene', 'Mission retrospectives'],
  },
  chapters: generateHtmlJourneyChapters(),
}

const cssOutline: Array<{ title: string; description: string; topics: string[] }> = [
  {
    title: 'CSS Overview',
    description: 'Understand what CSS is, who maintains the spec, and why it matters for modern interfaces.',
    topics: ['What is CSS?', 'Advantages of CSS', 'Who Creates and Maintains CSS?', 'CSS Versions'],
  },
  {
    title: 'Selectors and Syntax',
    description: 'Explore selector patterns that let you target exactly the right nodes.',
    topics: [
      'The Type Selectors',
      'The Universal Selectors',
      'The Descendant Selectors',
      'The Class Selectors',
      'The ID Selectors',
      'The Child Selectors',
      'The Attribute Selectors',
      'Multiple Style Rules',
      'Grouping Selectors',
    ],
  },
  {
    title: 'Applying CSS',
    description: 'Compare embedded, inline, external, and imported CSS plus override strategy.',
    topics: [
      'Embedded CSS — The <style> Element',
      'Embedded CSS Attributes',
      'Inline CSS — The style Attribute',
      'Inline CSS Attributes',
      'External CSS — The <link> Element',
      'External CSS Attributes',
      'Imported CSS — @import Rule',
      'CSS Rules Overriding',
      'Handling Old Browsers',
      'CSS Comments',
    ],
  },
  {
    title: 'Measurement Units',
    description: 'Use relative and absolute CSS units responsibly.',
    topics: ['CSS Measurement Units'],
  },
  {
    title: 'Color Systems',
    description: 'Work with hex, RGB, and legacy browser-safe palettes.',
    topics: [
      'CSS Colors — Hex Codes',
      'CSS Colors — Short Hex Codes',
      'CSS Colors — RGB Values',
      'Building Color Codes',
      'Browser Safe Colors',
    ],
  },
  {
    title: 'Background Techniques',
    description: 'Control backgrounds for layout and decorative affordances.',
    topics: ['CSS Background Properties'],
  },
  {
    title: 'Typography',
    description: 'Master font stacks and related typographic controls.',
    topics: [
      'Set the Font Family',
      'Set the Font Style',
      'Set the Font Variant',
      'Set the Font Weight',
      'Set the Font Size',
      'Set the Font Size Adjust',
      'Set the Font Stretch',
      'Shorthand Font Property',
    ],
  },
  {
    title: 'Text Formatting',
    description: 'Fine-tune text rendering, spacing, and decoration.',
    topics: [
      'Set the Text Color',
      'Set the Text Direction',
      'Set the Space between Characters',
      'Set the Space between Words',
      'Set the Text Indent',
      'Set the Text Alignment',
      'Decorating the Text',
      'Set the Text Cases',
      'Set the White Space between Text',
      'Set the Text Shadow',
    ],
  },
  {
    title: 'Working with Images',
    description: 'Adjust image sizing, borders, and older compatibility properties.',
    topics: [
      'The Image Border Property',
      'The Image Height Property',
      'The Image Width Property',
      'The -moz-opacity Property',
    ],
  },
  {
    title: 'Hyperlink Styling',
    description: 'Style link states for accessible navigation.',
    topics: [
      'Set the Color of Links',
      'Set the Color of Visited Links',
      'Change the Color of Hover Links',
      'Change the Color of Active Links',
    ],
  },
  {
    title: 'Table Layouts',
    description: 'Control table rendering with collapsed borders, spacing, and captions.',
    topics: [
      'The border-collapse Property',
      'The border-spacing Property',
      'The caption-side Property',
      'The empty-cells Property',
      'The table-layout Property',
    ],
  },
  {
    title: 'Borders',
    description: 'Compose border color, style, and width combinations.',
    topics: [
      'The border-color Property',
      'The border-style Property',
      'The border-width Property',
      'Border Properties Using Shorthand',
    ],
  },
  {
    title: 'Margins',
    description: 'Manage element spacing outside the border box.',
    topics: [
      'The Margin Property',
      'The margin-bottom Property',
      'The margin-top Property',
      'The margin-left Property',
      'The margin-right Property',
    ],
  },
  {
    title: 'Lists',
    description: 'Format list markers, positions, and imagery.',
    topics: [
      'The list-style-type Property',
      'The list-style-position Property',
      'The list-style-image Property',
      'The list-style Shorthand Property',
      'The marker-offset Property',
    ],
  },
  {
    title: 'Padding',
    description: 'Adjust inner spacing within the border box.',
    topics: [
      'The padding-bottom Property',
      'The padding-top Property',
      'The padding-left Property',
      'The padding-right Property',
      'The Padding Shorthand Property',
    ],
  },
  {
    title: 'Cursors',
    description: 'Choose pointer and custom cursor treatments.',
    topics: ['Cursor Property Basics'],
  },
  {
    title: 'Outlines',
    description: 'Render outlines that live outside the box model.',
    topics: [
      'The outline-width Property',
      'The outline-style Property',
      'The outline-color Property',
      'The outline Shorthand Property',
    ],
  },
  {
    title: 'Dimensions',
    description: 'Control box sizing constraints.',
    topics: [
      'The Height and Width Properties',
      'The line-height Property',
      'The max-height Property',
      'The min-height Property',
      'The max-width Property',
      'The min-width Property',
    ],
  },
  {
    title: 'Scrollbars',
    description: 'Customize scrollable regions.',
    topics: ['Styling Scrollbars'],
  },
  {
    title: 'Visibility',
    description: 'Toggle visibility properties while preserving layout.',
    topics: ['Visibility Property Patterns'],
  },
  {
    title: 'Positioning',
    description: 'Master default flow overrides with relative, absolute, and fixed behaviors.',
    topics: ['Relative Positioning', 'Absolute Positioning', 'Fixed Positioning'],
  },
  {
    title: 'Layering',
    description: 'Manage stacking contexts and layering strategies.',
    topics: ['Layering Content'],
  },
  {
    title: 'Pseudo-classes',
    description: 'Respond to user interaction and document structure with pseudo-classes.',
    topics: [
      'The :link Pseudo-class',
      'The :visited Pseudo-class',
      'The :hover Pseudo-class',
      'The :active Pseudo-class',
      'The :focus Pseudo-class',
      'The :first-child Pseudo-class',
      'The :lang Pseudo-class',
    ],
  },
  {
    title: 'Pseudo-elements',
    description: 'Inject structural styling hooks via pseudo-elements.',
    topics: [
      'The :first-line Pseudo-element',
      'The :first-letter Pseudo-element',
      'The :before Pseudo-element',
      'The :after Pseudo-element',
    ],
  },
  {
    title: '@ Rules',
    description: 'Use at-rules for imports, fonts, charsets, and overrides.',
    topics: ['The @import Rule', 'The @charset Rule', 'The @font-face Rule', 'The !important Rule'],
  },
  {
    title: 'CSS Filters',
    description: 'Apply visual filter effects to elements.',
    topics: [
      'Alpha Channel Filter',
      'Motion Blur Filter',
      'Chroma Filter',
      'Drop Shadow Effect',
      'Flip Effect',
      'Glow Effect',
      'Grayscale Effect',
      'Invert Effect',
      'Mask Effect',
      'Shadow Filter',
      'Wave Effect',
      'X-Ray Effect',
    ],
  },
  {
    title: 'Media Types',
    description: 'Deliver context-aware styles with media queries.',
    topics: ['The @media Rule', 'Document Language Considerations', 'Recognized Media Types'],
  },
  {
    title: 'Paged Media',
    description: 'Optimize layouts for paged and printed output.',
    topics: [
      'Defining Pages — The @page Rule',
      'Setting Page Size',
      'Left, Right, and First Pages',
      'Controlling Pagination',
      'Controlling Widows and Orphans',
    ],
  },
  {
    title: 'Aural Styles',
    description: 'Support audio rendering with the aural media profile.',
    topics: [
      'The azimuth Property',
      'The elevation Property',
      'The cue-after Property',
      'The cue-before Property',
      'The cue Property',
      'The pause-after Property',
      'The pause-before Property',
      'The pause Property',
      'The pitch Property',
      'The pitch-range Property',
      'The play-during Property',
      'The richness Property',
      'The speak Property',
      'The speak-numeral Property',
      'The speak-punctuation Property',
      'The speech-rate Property',
      'The stress Property',
      'The voice-family Property',
      'The volume Property',
    ],
  },
  {
    title: 'Printing',
    description: 'Prepare print-friendly experiences with CSS.',
    topics: ['CSS for Printing Workflows'],
  },
  {
    title: 'Layouts',
    description: 'Implement multi-column layouts using legacy CSS techniques.',
    topics: ['Sample Column Layout'],
  },
  {
    title: 'Validation',
    description: 'Validate CSS and markup to ensure consistent rendering.',
    topics: ['Why Validate Your CSS and HTML Code?'],
  },
  {
    title: 'CSS2 Reference Guide',
    description: 'Build quick reference notes from the CSS2 spec.',
    topics: ['Pseudo-classes and Pseudo-elements Reference'],
  },
  {
    title: 'Color References',
    description: 'Document and recall color reference tables for projects.',
    topics: ['Color Reference Tables'],
  },
]

function generateCssCourse(): JourneyCourse {
  let order = 1

  const chapters: JourneyChapter[] = cssOutline.map((section, sectionIndex) => {
    const selectedTopics = section.topics.slice(0, 5)
    const tasks: JourneyTask[] = selectedTopics.map((topic, topicIndex) => {
      const slug = toSlug(topic) || `topic-${sectionIndex + 1}-${topicIndex + 1}`
      const keywords = keywordFromTopic(topic)
      const primaryKeywords = keywords.length ? keywords.slice(0, 3) : ['css', 'reference']
      const instructions = [
        `Write a focused study note (minimum 120 words) explaining "${topic}" within the CSS ecosystem.`,
        'Highlight when you would use this concept in production and mention at least two implementation tips or pitfalls.',
        'Finish with a short code snippet or pseudo-code block that reinforces the concept.',
      ]

      const tests: LessonTest[] = primaryKeywords.map((keyword, keywordIndex) => ({
        id: `css-${slug}-keyword-${keywordIndex}`,
        description: `Mention the keyword "${keyword}".`,
        run: (code: string) => new RegExp(keyword, 'i').test(code),
        hint: `Work the term "${keyword}" into your notes so you do not forget it.`,
      }))
      tests.push(createWordCountTest(`css-${slug}-word-count`, 120))

      return {
        id: `css-ch${sectionIndex + 1}-task-${topicIndex + 1}`,
        order: order++,
        title: topic,
        summary: `Capture a durable knowledge card for ${topic}.`,
        explanation:
          'Knowledge cards help you rehearse concepts quickly before interviews or production debugging sessions. Provide detail, rationale, and an anchored example.',
        instructions,
        starterCode: `# ${topic}\n\n## Overview\n\n## When to use it\n\n## Example\n\n`,
        language: 'markdown',
        tests,
        audioNarration: `Create a detailed study note for ${topic}. Explain what it does, when you use it, and provide an illustrative snippet.`,
        resources: [
          { label: 'MDN Reference', href: `https://developer.mozilla.org/search?q=${encodeURIComponent(topic)}` },
        ],
      }
    })

    return {
      id: `css-chapter-${sectionIndex + 1}`,
      index: sectionIndex,
      title: `Chapter ${sectionIndex + 1} · ${section.title}`,
      description: section.description,
      tasks,
    }
  })

  return {
    id: 'css',
    title: 'CSS Design Odyssey',
    tagline: 'Document every CSS primitive through guided knowledge cards.',
    category: 'frontend',
    access: 'free',
    certificate: {
      title: 'CSS Design Odyssey Completion Certificate',
      description:
        'Finish every challenge to unlock a certificate that showcases deep CSS, layout, and design system expertise.',
    },
    membershipPerk: {
      title: 'Design Systems Office Hours',
      description:
        'Members can request async CSS reviews or pair with experts to troubleshoot responsive layouts, typography, and accessibility issues.',
    },
    voiceInterview: {
      title: 'CSS Voice Interview Bootcamp',
      description:
        'Upgrade to rehearse voice-led interviews that probe selectors, specificity battles, layout strategies, and performance tuning.',
      focus: ['Specificity drills', 'Responsive layout strategy', 'Cross-browser debugging'],
    },
    chapters,
  }
}

const cssCourse = generateCssCourse()

const jsOutline: Array<{ title: string; description: string; topics: string[] }> = [
  {
    title: 'JavaScript Overview',
    description: 'Ground yourself in JavaScript history, advantages, and the current ecosystem.',
    topics: [
      'What is JavaScript?',
      'Client-Side JavaScript',
      'Advantages of JavaScript',
      'Limitations of JavaScript',
      'JavaScript Development Tools',
      'Where is JavaScript Today?',
    ],
  },
  {
    title: 'Language Syntax',
    description: 'Write basic scripts with correct syntax, whitespace, and comments.',
    topics: [
      'Your First JavaScript Code',
      'Whitespace and Line Breaks',
      'Semicolons are Optional',
      'Case Sensitivity',
      'Comments in JavaScript',
    ],
  },
  {
    title: 'Running JavaScript',
    description: 'Enable JavaScript across browsers and understand compatibility warnings.',
    topics: [
      'JavaScript in Internet Explorer',
      'JavaScript in Firefox',
      'JavaScript in Chrome',
      'JavaScript in Opera',
      'Warning for Non-JavaScript Browsers',
    ],
  },
  {
    title: 'Script Placement Strategies',
    description: 'Decide where scripts live in your documents or modules.',
    topics: [
      'JavaScript in <head> Section',
      'JavaScript in <body> Section',
      'JavaScript in <body> and <head> Sections',
      'JavaScript in External File',
    ],
  },
  {
    title: 'Variables and Data Types',
    description: 'Work with primitive values, scopes, and naming rules.',
    topics: [
      'JavaScript Datatypes',
      'JavaScript Variables',
      'JavaScript Variable Scope',
      'JavaScript Variable Names',
      'JavaScript Reserved Words',
    ],
  },
  {
    title: 'Operators',
    description: 'Apply arithmetic, comparison, logical, and other operators effectively.',
    topics: [
      'Arithmetic Operators',
      'Comparison Operators',
      'Logical Operators',
      'Bitwise Operators',
      'Assignment Operators',
      'Miscellaneous Operators',
    ],
  },
  {
    title: 'Control Flow — If/Else',
    description: 'Branch logic with if/else statements and flowcharts.',
    topics: ['Flow Chart of if-else', 'if Statement', 'if...else Statement', 'if...else if... Statement'],
  },
  {
    title: 'Control Flow — Switch',
    description: 'Simplify branching with switch-case constructs.',
    topics: ['Switch-Case Flow Chart'],
  },
  {
    title: 'Loops — While',
    description: 'Iterate with while and do...while loops responsibly.',
    topics: ['The while Loop', 'The do...while Loop'],
  },
  {
    title: 'Loops — For',
    description: 'Iterate with for loops and variations.',
    topics: ['The for Loop'],
  },
  {
    title: 'Loops — For...in',
    description: 'Enumerate object properties safely with for...in.',
    topics: ['For-in Loop Mechanics'],
  },
  {
    title: 'Loop Control',
    description: 'Command loop execution with break, continue, and labels.',
    topics: ['The break Statement', 'The continue Statement', 'Using Labels to Control Flow'],
  },
  {
    title: 'Functions Fundamentals',
    description: 'Define, invoke, and nest functions in idiomatic JavaScript.',
    topics: [
      'Function Definition',
      'Calling a Function',
      'Function Parameters',
      'The return Statement',
      'Nested Functions',
      'Function Constructor',
      'Function Literals',
    ],
  },
  {
    title: 'Events',
    description: 'Handle DOM events with inline and standard handlers.',
    topics: [
      'What is an Event?',
      'onclick Event Type',
      'onsubmit Event Type',
      'onmouseover and onmouseout',
      'HTML5 Standard Events',
    ],
  },
  {
    title: 'Cookies',
    description: 'Store and manage browser cookies via JavaScript.',
    topics: [
      'What are Cookies?',
      'How It Works?',
      'Storing Cookies',
      'Reading Cookies',
      'Setting Cookies Expiry Date',
      'Deleting a Cookie',
    ],
  },
  {
    title: 'Page Redirects',
    description: 'Navigate users with JavaScript-based redirects and refreshes.',
    topics: ['What is Page Redirection?', 'Page Refresh Techniques', 'Auto Refresh', 'How Page Redirection Works?'],
  },
  {
    title: 'Dialog Boxes',
    description: 'Prompt users with alert, confirmation, and prompt modalities.',
    topics: ['Alert Dialog Box', 'Confirmation Dialog Box', 'Prompt Dialog Box'],
  },
  {
    title: 'Void Keyword',
    description: 'Use javascript:void for intentional non-navigation behaviors.',
    topics: ['Understanding the void Operator'],
  },
  {
    title: 'Printing Pages',
    description: 'Trigger and customize print workflows with window.print.',
    topics: ['How to Print a Page?', 'Auto Print Strategies'],
  },
  {
    title: 'Objects',
    description: 'Compose objects with properties, methods, and prototypes.',
    topics: [
      'Object Properties',
      'Object Methods',
      'User-Defined Objects',
      'Defining Methods for an Object',
      'The with Keyword',
    ],
  },
  {
    title: 'Number Object',
    description: 'Use Number properties and methods for numeric operations.',
    topics: [
      'Number Properties',
      'Number.MAX_VALUE',
      'Number.MIN_VALUE',
      'NaN',
      'NEGATIVE_INFINITY',
      'POSITIVE_INFINITY',
      'Number Prototype',
      'Number Methods Overview',
    ],
  },
  {
    title: 'Boolean Object',
    description: 'Wrap boolean values with object semantics.',
    topics: ['Boolean Properties', 'Boolean Methods', 'Boolean Prototype'],
  },
  {
    title: 'String Object',
    description: 'Manipulate text with string methods, properties, and HTML wrappers.',
    topics: ['String Properties', 'String Methods', 'String HTML Wrappers'],
  },
  {
    title: 'Arrays',
    description: 'Handle ordered data structures with array helpers.',
    topics: ['Array Properties', 'Array Methods Suite'],
  },
  {
    title: 'Date Object',
    description: 'Work with dates and times using the Date API.',
    topics: ['Date Properties', 'Date Methods', 'Date Static Methods'],
  },
  {
    title: 'Math Object',
    description: 'Perform math with constants and helper functions.',
    topics: ['Math Properties', 'Math Methods'],
  },
  {
    title: 'Regular Expressions',
    description: 'Leverage RegExp patterns for text matching.',
    topics: ['RegExp Basics', 'RegExp Properties', 'RegExp Methods'],
  },
  {
    title: 'Document Object Model',
    description: 'Traverse and manipulate the DOM across specifications.',
    topics: ['Legacy DOM', 'W3C DOM', 'IE 4 DOM', 'DOM Compatibility'],
  },
  {
    title: 'Errors and Exceptions',
    description: 'Handle errors gracefully via try/catch and onerror.',
    topics: ['Syntax Errors', 'Runtime Errors', 'Logical Errors', 'try...catch...finally', 'throw Statement', 'onerror Method'],
  },
  {
    title: 'Form Validation',
    description: 'Validate form input with JavaScript before submitting.',
    topics: ['Basic Form Validation', 'Data Format Validation'],
  },
  {
    title: 'Animation',
    description: 'Create manual and automated animations via scripting.',
    topics: ['Manual Animation', 'Automated Animation', 'Mouse Rollover Animation'],
  },
  {
    title: 'Multimedia',
    description: 'Detect and control multimedia integration in the browser.',
    topics: ['Checking for Plug-Ins', 'Controlling Multimedia Playback'],
  },
  {
    title: 'Debugging',
    description: 'Diagnose JavaScript issues across browsers.',
    topics: ['Error Messages in IE', 'Error Messages in Firefox', 'Error Notifications', 'How to Debug a Script', 'Developer Tips'],
  },
  {
    title: 'Image Maps',
    description: 'Control image map behavior via scripting.',
    topics: ['JavaScript and Image Maps'],
  },
  {
    title: 'Browser Object',
    description: 'Inspect navigator APIs and detect browser capabilities.',
    topics: ['Navigator Properties', 'Navigator Methods', 'Browser Detection'],
  },
]

function generateJsCourse(): JourneyCourse {
  let order = 1

  const chapters: JourneyChapter[] = jsOutline.map((section, sectionIndex) => {
    const selectedTopics = section.topics.slice(0, 5)
    const tasks: JourneyTask[] = selectedTopics.map((topic, topicIndex) => {
      const slug = toSlug(topic) || `js-topic-${sectionIndex + 1}-${topicIndex + 1}`
      const keywords = keywordFromTopic(topic)
      const requiredTerms = keywords.length ? keywords.slice(0, 3) : ['javascript', 'runtime']
      const instructions = [
        `Explain "${topic}" in JavaScript with a concise study note (at least 120 words).`,
        'Include one real-world scenario or bug where this concept is important.',
        'End with a runnable code example enclosed in triple backticks that demonstrates the concept.',
      ]

      const tests: LessonTest[] = [
        ...requiredTerms.map((term, index) => ({
          id: `js-${slug}-keyword-${index}`,
          description: `Mention the keyword "${term}".`,
          run: (code: string) => new RegExp(term, 'i').test(code),
          hint: `Work the term "${term}" into your explanation to reinforce vocabulary.`,
        })),
        {
          id: `js-${slug}-code-block`,
          description: 'Include a fenced code block using triple backticks.',
          run: (code: string) => /```[\s\S]+?```/.test(code),
          hint: 'Wrap your example between triple backticks so it renders as code.',
        },
      ]

      tests.push(createWordCountTest(`js-${slug}-word-count`, 120))

      return {
        id: `js-ch${sectionIndex + 1}-task-${topicIndex + 1}`,
        order: order++,
        title: topic,
        summary: `Document what ${topic} does and why it matters.`,
        explanation:
          'Treat each task as a knowledge card you can revisit before interviews or when debugging. Capture definitions, scenarios, and code patterns that anchor the concept.',
        instructions,
        starterCode: `# ${topic}\n\n## Summary\n\n## When it matters\n\n\`\`\`javascript\n// example goes here\n\`\`\`\n`,
        language: 'markdown',
        tests,
        audioNarration: `Create a study note for ${topic}. Describe the concept, cite a real use case, and finish with a runnable snippet.`,
        resources: [
          { label: 'MDN Reference', href: `https://developer.mozilla.org/search?q=${encodeURIComponent(topic)}` },
        ],
      }
    })

    return {
      id: `js-chapter-${sectionIndex + 1}`,
      index: sectionIndex,
      title: `Chapter ${sectionIndex + 1} · ${section.title}`,
      description: section.description,
      tasks,
    }
  })

  return {
    id: 'javascript',
    title: 'JavaScript Questline',
    tagline: 'Forge mastery of JavaScript fundamentals, objects, and advanced tooling through structured knowledge cards.',
    category: 'frontend',
    access: 'free',
    certificate: {
      title: 'JavaScript Questline Completion Certificate',
      description:
        'Complete every chapter to earn a certificate that highlights your command of JavaScript language features, browser APIs, and debugging workflows.',
    },
    membershipPerk: {
      title: 'JavaScript Pairing Sessions',
      description:
        'Members can request expert-led pairing to debug tricky issues, review architecture decisions, or walk through performance profiling.',
    },
    voiceInterview: {
      title: 'JavaScript Voice Interview Lab',
      description:
        'Upgrade for voice-led interview drills that cover language semantics, asynchronous patterns, and DOM manipulation scenarios.',
      focus: ['Language semantics', 'Async patterns', 'DOM and events'],
    },
    chapters,
  }
}

const jsCourse = generateJsCourse()

const reactOutline: Array<{ title: string; description: string; topics: string[] }> = [
  {
    title: 'React Introduction',
    description: "Explore React's history, benefits, and use cases across modern applications.",
    topics: ['React versions', 'Features', 'Benefits', 'Applications'],
  },
  {
    title: 'Installation and Tooling',
    description: 'Set up React projects using various toolchains and compilers.',
    topics: ['Toolchain', 'The serve static server', 'Babel compiler', 'Create React App toolchain'],
  },
  {
    title: 'Architecture',
    description: 'Understand the workflow and structure of a React application.',
    topics: ['Workflow of a React application', 'Architecture of the React Application'],
  },
  {
    title: 'Creating React Applications',
    description: 'Bootstrap React apps via CDN, CRA, or custom bundlers.',
    topics: [
      'Using CDN',
      'Using Create React App tool',
      'Files and folders',
      'Source code of the application',
      'Customize the code',
      'Run the application',
      'Using custom solution',
      'Using Rollup bundler',
      'Using Parcel bundler',
    ],
  },
  {
    title: 'JSX Essentials',
    description: 'Write JSX expressions, functions, and attribute bindings.',
    topics: ['Expressions', 'Functions', 'Attributes', 'Expression in attributes'],
  },
  {
    title: 'Components',
    description: 'Create both class-based and functional React components.',
    topics: ['Creating a React component', 'Creating a class component', 'Creating a function component'],
  },
  {
    title: 'Styling',
    description: 'Style components using CSS files, inline styles, and CSS Modules.',
    topics: ['CSS stylesheet', 'Inline Styling', 'CSS Modules'],
  },
  {
    title: 'Properties (props)',
    description: 'Pass data through props and compose components effectively.',
    topics: ['Create a component using properties', 'Nested components', 'Use components', 'Component collection'],
  },
  {
    title: 'Event Management',
    description: 'Handle DOM events within React components.',
    topics: ['Introduce events in Expense manager app'],
  },
  {
    title: 'State Management & Lifecycle',
    description: 'Manage component state, lifecycle, containment, and advanced reuse patterns.',
    topics: [
      'What is state?',
      'State management API',
      'Stateless component',
      'Create a stateful component',
      'Introduce state in expense manager app',
      'State management using React Hooks',
      'Component Life cycle',
      'Working example of life cycle API',
      'Life cycle api in Expense manager app',
      'Component life cycle using React Hooks',
      'React children property aka Containment',
      'Layout in component',
      'Sharing logic in component aka Render props',
      'Pagination',
      'Material UI',
    ],
  },
  {
    title: 'HTTP Client Programming',
    description: 'Consume REST APIs from React using fetch and supporting tooling.',
    topics: ['Expense Rest Api Server', 'The fetch() api'],
  },
  {
    title: 'Form Programming',
    description: 'Work with controlled, uncontrolled, and Formik-powered forms.',
    topics: ['Controlled component', 'Uncontrolled Component', 'Formik'],
  },
  {
    title: 'Routing',
    description: 'Implement navigation flows with React Router, including nested routes.',
    topics: ['Install React Router', 'Nested routing', 'Creating navigation'],
  },
  {
    title: 'Redux',
    description: 'Manage global state with Redux concepts, APIs, and providers.',
    topics: ['Concepts', 'Redux API', 'Provider component'],
  },
  {
    title: 'Animation',
    description: 'Animate React UIs using React Transition Group primitives.',
    topics: ['React Transition Group', 'Transition', 'CSSTransition', 'TransitionGroup'],
  },
  {
    title: 'Testing',
    description: 'Test React applications in CRA or custom configurations.',
    topics: ['Create React app testing', 'Testing in a custom application'],
  },
  {
    title: 'CLI Commands',
    description: 'Use React CLI commands to scaffold, configure, and run apps.',
    topics: ['Creating a new application', 'Selecting a template', 'Installing a dependency', 'Running the application'],
  },
  {
    title: 'Build & Deployment',
    description: 'Build and deploy React applications to production environments.',
    topics: ['Building', 'Deployment'],
  },
  {
    title: 'Expense Manager Example',
    description: 'Apply React concepts to a full expense manager implementation.',
    topics: [
      'Expense manager API',
      'Install necessary modules',
      'State management',
      'List expenses',
      'Add expense',
    ],
  },
]

function generateReactCourse(): JourneyCourse {
  let order = 1

  const chapters: JourneyChapter[] = reactOutline.map((section, sectionIndex) => {
    const selectedTopics = section.topics.slice(0, 5)
    const tasks: JourneyTask[] = selectedTopics.map((topic, topicIndex) => {
      const slug = toSlug(topic) || `react-topic-${sectionIndex + 1}-${topicIndex + 1}`
      const keywords = keywordFromTopic(topic)
      const requiredTerms = keywords.length ? keywords.slice(0, 3) : ['react', 'component']
      const instructions = [
        `Explain "${topic}" within the React ecosystem. Write at least 140 words describing what it is and why it matters.`,
        'Share one implementation insight or production lesson learned while using this concept.',
        'End with a JSX code example between triple backticks that demonstrates the idea in action.',
      ]

      const tests: LessonTest[] = [
        ...requiredTerms.map((term, index) => ({
          id: `react-${slug}-keyword-${index}`,
          description: `Mention the keyword "${term}".`,
          run: (code: string) => new RegExp(term, 'i').test(code),
          hint: `Include the word "${term}" so you associate it with the concept.`,
        })),
        {
          id: `react-${slug}-code-block`,
          description: 'Include a JSX fenced code block using triple backticks.',
          run: (code: string) => /```[\s\S]+?```/.test(code),
          hint: 'Wrap your JSX snippet inside triple backticks so it renders correctly.',
        },
      ]

      tests.push(createWordCountTest(`react-${slug}-word-count`, 140))

      return {
        id: `react-ch${sectionIndex + 1}-task-${topicIndex + 1}`,
        order: order++,
        title: topic,
        summary: `Create a reusable React study note for ${topic}.`,
        explanation:
          'Treat this deliverable as a knowledge card to revisit before building features or interviewing. Emphasize practical usage and common pitfalls.',
        instructions,
        starterCode: `# ${topic}\n\n## Summary\n\n## Production insight\n\n\`\`\`jsx\n// example component here\n\`\`\`\n`,
        language: 'markdown',
        tests,
        audioNarration: `Document ${topic} in React. Explain the concept, mention a production insight, and share a quick JSX example.`,
        resources: [
          {
            label: 'React Docs',
            href: `https://react.dev/search?q=${encodeURIComponent(topic)}`,
          },
        ],
      }
    })

    return {
      id: `react-chapter-${sectionIndex + 1}`,
      index: sectionIndex,
      title: `Chapter ${sectionIndex + 1} · ${section.title}`,
      description: section.description,
      tasks,
    }
  })

  return {
    id: 'react',
    title: 'React Frontier',
    tagline: 'Systematically master React foundations, architecture, and deployment workflows.',
    category: 'frontend',
    access: 'free',
    certificate: {
      title: 'React Frontier Completion Certificate',
      description:
        'Complete every chapter to earn a certificate that highlights your command of React architecture, state management, and tooling.',
    },
    membershipPerk: {
      title: 'Frontend Architecture Sessions',
      description:
        'Members can book expert office hours to review React architectures, performance tuning, and UI audits.',
    },
    voiceInterview: {
      title: 'React Voice Interview Bootcamp',
      description:
        'Upgrade for voice-led interview drills spanning component patterns, hooks, routing, and deployment.',
      focus: ['Component patterns', 'State management', 'Routing strategy'],
    },
    chapters,
  }
}

const reactCourse = generateReactCourse()

const nextOutline: Array<{ title: string; description: string; topics: string[] }> = [
  {
    title: 'Next.js Overview',
    description: 'Clarify where Next.js fits in the React ecosystem and why teams adopt it.',
    topics: ['History and Versions', 'Key Features', 'Use Cases'],
  },
  {
    title: 'Project Setup',
    description: 'Initialize a Next.js project with the latest tooling.',
    topics: ['create-next-app', 'Directory Structure', 'TypeScript Configuration', 'ESLint and Prettier'],
  },
  {
    title: 'App Router Fundamentals',
    description: 'Understand the App Router, layouts, and file-based conventions.',
    topics: ['App Router Concepts', 'Layouts and Templates', 'Server vs Client Components'],
  },
  {
    title: 'Routing and Navigation',
    description: 'Build nested routes, dynamic segments, and navigation patterns.',
    topics: ['Nested Routes', 'Dynamic Segments', 'Link Component', 'Route Groups'],
  },
  {
    title: 'Data Fetching Strategies',
    description: 'Choose between fetch options for static, dynamic, and revalidated data.',
    topics: ['fetch API in Next.js', 'Static Rendering', 'Dynamic Rendering', 'Revalidation'],
  },
  {
    title: 'Rendering Modes',
    description: 'Compare SSR, SSG, ISR, and client rendering.',
    topics: ['Server-Side Rendering', 'Static Site Generation', 'Incremental Static Regeneration', 'Client Components'],
  },
  {
    title: 'Styling',
    description: 'Style applications with Tailwind, CSS modules, and CSS-in-JS.',
    topics: ['Global CSS', 'CSS Modules', 'Tailwind Integration', 'Styled Components'],
  },
  {
    title: 'Server Components and Actions',
    description: 'Leverage server components and actions for data-heavy flows.',
    topics: ['Server Component Patterns', 'Client Boundary', 'Server Actions'],
  },
  {
    title: 'APIs and Edge Functions',
    description: 'Expose REST endpoints and edge handlers using Next.js primitives.',
    topics: ['Route Handlers', 'Edge Functions', 'Streaming Responses'],
  },
  {
    title: 'Authentication and Middleware',
    description: 'Protect routes and personalize experiences.',
    topics: ['Middleware Basics', 'Auth.js Integration', 'Route Guards', 'Internationalization Middleware'],
  },
  {
    title: 'Caching and Performance',
    description: 'Optimize caching behavior and reduce bottlenecks.',
    topics: ['Cache-Control', 'Route Segment Config', 'Optimizing Images and Fonts'],
  },
  {
    title: 'Deployment and Observability',
    description: 'Ship and monitor your Next.js application.',
    topics: ['Vercel Deployment', 'Custom Hosting', 'Monitoring and Logging'],
  },
]

function generateNextCourse(): JourneyCourse {
  let order = 1

  const chapters: JourneyChapter[] = nextOutline.map((section, sectionIndex) => {
    const selectedTopics = section.topics.slice(0, 5)
    const tasks: JourneyTask[] = selectedTopics.map((topic, topicIndex) => {
      const slug = toSlug(topic) || `next-topic-${sectionIndex + 1}-${topicIndex + 1}`
      const keywords = keywordFromTopic(topic)
      const requiredTerms = keywords.length ? keywords.slice(0, 3) : ['next.js', 'app router']
      const instructions = [
        `Create a study note (minimum 140 words) explaining "${topic}" in the context of Next.js.`,
        'Share one production insight or lesson learned when applying this concept.',
        'Finish with a TypeScript or JSX snippet between triple backticks that demonstrates the idea.',
      ]

      const tests: LessonTest[] = [
        ...requiredTerms.map((term, index) => ({
          id: `next-${slug}-keyword-${index}`,
          description: `Mention the keyword "${term}".`,
          run: (code: string) => new RegExp(term, 'i').test(code),
          hint: `Mention the word "${term}" to anchor the concept.`,
        })),
        {
          id: `next-${slug}-code-block`,
          description: 'Include a fenced code block using triple backticks.',
          run: (code: string) => /```[\s\S]+?```/.test(code),
          hint: 'Wrap your code sample in triple backticks.',
        },
      ]

      tests.push(createWordCountTest(`next-${slug}-word-count`, 140))

      return {
        id: `next-ch${sectionIndex + 1}-task-${topicIndex + 1}`,
        order: order++,
        title: topic,
        summary: `Document how ${topic} works in Next.js.`,
        explanation:
          'Treat this note as a quick reference you can scan before building new features. Emphasize practical guidance and potential pitfalls.',
        instructions,
        starterCode: `# ${topic}\n\n## Summary\n\n## Production insight\n\n\`\`\`tsx\n// example code here\n\`\`\`\n`,
        language: 'markdown',
        tests,
        audioNarration: `Explain ${topic} in Next.js, share a real insight, and include a code sample.`,
        resources: [
          {
            label: 'Next.js Docs',
            href: `https://nextjs.org/search?q=${encodeURIComponent(topic)}`,
          },
        ],
      }
    })

    return {
      id: `next-chapter-${sectionIndex + 1}`,
      index: sectionIndex,
      title: `Chapter ${sectionIndex + 1} · ${section.title}`,
      description: section.description,
      tasks,
    }
  })

  return {
    id: 'next',
    title: 'Next.js Journey',
    tagline: 'Master the fundamentals of Next.js, the React framework for production.',
    category: 'frontend',
    access: 'free',
    certificate: {
      title: 'Next.js Journey Completion Certificate',
      description:
        'Complete every challenge to earn a certificate that highlights your command of Next.js fundamentals, routing, and data fetching.',
    },
    membershipPerk: {
      title: 'Next.js Office Hours',
      description:
        'Members can book expert office hours to review Next.js architectures, performance tuning, and API design.',
    },
    voiceInterview: {
      title: 'Next.js Voice Interview Bootcamp',
      description:
        'Upgrade for voice-led interview drills covering Next.js fundamentals, routing, and data fetching.',
      focus: ['Next.js fundamentals', 'Routing strategy', 'Data fetching'],
    },
    chapters,
  }
}

const nextCourse = generateNextCourse()

const journeyCourses: JourneyCourse[] = [htmlCourse, cssCourse, jsCourse, reactCourse, nextCourse]

export function listJourneyCourses() {
  return journeyCourses
}

const courseCache = new Map<string, JourneyCourse>()

export function getJourneyCourse(courseId: string) {
  if (courseCache.has(courseId)) {
    return courseCache.get(courseId)!
  }
  const course = journeyCourses.find((entry) => entry.id === courseId)
  if (course) {
    courseCache.set(courseId, course)
  }
  return course
}
