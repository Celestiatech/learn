import { InteractiveLesson } from './types'

const baseCss = `/* Style the feature card */
.card {
  /* Add your styles here */
}

.card h1 {
  /* Highlight the headline */
}

.primary-button {
  /* Make the button stand out */
}
`

const lesson: InteractiveLesson = {
  slug: 'css-basics',
  title: 'Crafting Visual Style with CSS',
  description:
    'Use modern CSS techniques to create an eye-catching hero card complete with typography, color, and call-to-action.',
  track: 'CSS Design Odyssey',
  estimatedTime: '20 minutes',
  steps: [
    {
      id: 'css-card',
      title: 'Give the hero card depth and breathing room',
      instructions: [
        'Inside the `.card` rule, add a gradient background that blends teal and indigo.',
        'Add `padding` of at least `2.5rem` to space the content.',
        'Round the corners with `border-radius` of at least `1.5rem` and apply a subtle box shadow.',
      ],
      starterCode: baseCss,
      language: 'css',
      preview: {
        mode: 'html',
        wrapper: (css) => `<!doctype html><html><head><style>
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at top, rgba(15,118,110,0.3), rgba(10,37,64,1));
  font-family: 'Inter', system-ui, sans-serif;
  color: white;
}
${css}
</style></head><body>
  <section class="card">
    <h1>Design systems that scale</h1>
    <p>Pair deliberate practice with beautiful UI recipes that grow with your product.</p>
    <button class="primary-button">Start building</button>
  </section>
</body></html>`,
      },
      tests: [
        {
          id: 'card-gradient',
          description: '`.card` uses a gradient background blending teal and indigo hues.',
          run: (code) =>
            /\.card\s*{[^}]*background\s*:\s*linear-gradient/i.test(code) ||
            /\.card\s*{[^}]*background\s*:\s*.*(teal|#0ea5a4).*(indigo|#312e81)/i.test(code),
          hint: 'Use `background: linear-gradient(...)` with teal and indigo colors.',
        },
        {
          id: 'card-padding',
          description: '`.card` includes generous padding of at least 2.5rem.',
          run: (code) => /\.card\s*{[^}]*padding\s*:\s*(2\.5|3|4)rem/i.test(code),
          hint: 'Add `padding: 2.5rem;` inside `.card`.',
        },
        {
          id: 'card-radius-shadow',
          description: '`.card` has rounded corners and a box shadow.',
          run: (code) =>
            /\.card\s*{[^}]*border-radius\s*:\s*(1\.5|2|3)rem/i.test(code) &&
            /\.card\s*{[^}]*box-shadow\s*:/i.test(code),
          hint: 'Use both `border-radius` and `box-shadow` declarations in `.card`.',
        },
      ],
      completionMessage: 'Beautiful! Your hero card now has depth and structure.',
    },
    {
      id: 'css-typography',
      title: 'Set expressive typography',
      instructions: [
        'In the `.card h1` rule, set `font-size` to at least `clamp(2rem, 4vw, 3.5rem)`.',
        'Add `letter-spacing` of `.02em` and increase `line-height` to keep the text readable.',
        'Optionally, lighten the heading color slightly to create contrast with the body text.',
      ],
      starterCode: `/* Style the feature card */
.card {
  background: linear-gradient(135deg, rgba(14,165,164,0.9), rgba(99,102,241,0.85));
  padding: 3rem;
  border-radius: 1.75rem;
  box-shadow: 0 35px 60px rgba(15, 23, 42, 0.45);
}

.card h1 {
  /* Highlight the headline */
}

.primary-button {
  /* Make the button stand out */
}
`,
      language: 'css',
      preview: {
        mode: 'html',
        wrapper: (css) => `<!doctype html><html><head><style>
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at top, rgba(15,118,110,0.3), rgba(10,37,64,1));
  font-family: 'Inter', system-ui, sans-serif;
  color: white;
}
${css}
</style></head><body>
  <section class="card">
    <h1>Design systems that scale</h1>
    <p>Pair deliberate practice with beautiful UI recipes that grow with your product.</p>
    <button class="primary-button">Start building</button>
  </section>
</body></html>`,
      },
      tests: [
        {
          id: 'heading-font-size',
          description: 'The heading uses a responsive clamp-based font size.',
          run: (code) => /\.card h1\s*{[^}]*font-size\s*:\s*clamp\(/i.test(code),
          hint: 'Use `font-size: clamp(2rem, 4vw, 3.5rem);` in `.card h1`.',
        },
        {
          id: 'heading-tracking-line-height',
          description: 'The heading adjusts letter spacing and line height.',
          run: (code) =>
            /\.card h1\s*{[^}]*letter-spacing\s*:\s*0?\.02em/i.test(code) &&
            /\.card h1\s*{[^}]*line-height\s*:/i.test(code),
          hint: 'Add both `letter-spacing` and `line-height` properties in `.card h1`.',
        },
      ],
      completionMessage: 'Excellent! Your headline now scales beautifully across devices.',
    },
    {
      id: 'css-button',
      title: 'Elevate the primary action',
      instructions: [
        'In the `.primary-button` rule, create a pill-shaped button with ample padding.',
        'Use a contrasting gradient background and remove the border.',
        'Add a hover state using `transition` and a slightly brighter background.',
      ],
      starterCode: `/* Style the feature card */
.card {
  background: linear-gradient(135deg, rgba(14,165,164,0.9), rgba(99,102,241,0.85));
  padding: 3rem;
  border-radius: 1.75rem;
  box-shadow: 0 35px 60px rgba(15, 23, 42, 0.45);
}

.card h1 {
  font-size: clamp(2rem, 4vw, 3.5rem);
  letter-spacing: 0.02em;
  line-height: 1.15;
}

.primary-button {
  /* Make the button stand out */
}
`,
      language: 'css',
      preview: {
        mode: 'html',
        wrapper: (css) => `<!doctype html><html><head><style>
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at top, rgba(15,118,110,0.3), rgba(10,37,64,1));
  font-family: 'Inter', system-ui, sans-serif;
  color: white;
}
button {
  cursor: pointer;
}
${css}
</style></head><body>
  <section class="card">
    <h1>Design systems that scale</h1>
    <p>Pair deliberate practice with beautiful UI recipes that grow with your product.</p>
    <button class="primary-button">Start building</button>
  </section>
</body></html>`,
      },
      tests: [
        {
          id: 'button-shape',
          description: 'Button has generous padding and pill-shaped corners.',
          run: (code) =>
            /\.primary-button\s*{[^}]*padding\s*:\s*(0\.9|1|1\.2)rem/i.test(code) &&
            /\.primary-button\s*{[^}]*border-radius\s*:\s*(9999px|3rem)/i.test(code),
          hint: 'Add `padding: 1rem 2.5rem;` and `border-radius: 9999px;` to `.primary-button`.',
        },
        {
          id: 'button-gradient',
          description: 'Button background uses a gradient and removes the border.',
          run: (code) =>
            /\.primary-button\s*{[^}]*background\s*:\s*linear-gradient/i.test(code) &&
            /\.primary-button\s*{[^}]*border\s*:\s*none/i.test(code),
          hint: 'Set `background: linear-gradient(...)` and `border: none;` for `.primary-button`.',
        },
        {
          id: 'button-hover',
          description: 'Button includes a hover state with a transition.',
          run: (code) =>
            /\.primary-button\s*{[^}]*transition\s*:/i.test(code) &&
            /\.primary-button:hover\s*{[^}]*background/i.test(code),
          hint: 'Add `transition` inside `.primary-button` and define `.primary-button:hover`.',
        },
      ],
      completionMessage: 'The call-to-action shines! Your CSS foundations are solid.',
    },
  ],
}

export default lesson

