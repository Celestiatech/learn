import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.taskProgress.deleteMany()
  await prisma.task.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.course.deleteMany()

  const htmlCourse = await prisma.course.create({
    data: {
      title: 'HTML Story Mode',
      slug: 'html-story-mode',
      level: 'Easy',
      description: 'Forge semantic structure from parchment to production.',
      chapters: {
        create: [
          {
            title: 'Chapter 1 · The Awakening Scroll',
            order: 1,
            storyText:
              'You join the Guild of Markup Scribes. Restore the ancient scrolls by weaving semantic HTML.',
            tasks: {
              create: [
                {
                  title: 'Assemble a basic HTML document',
                  order: 1,
                  prompt: 'Reconstruct the base document skeleton with <!DOCTYPE>, html, head, and body tags.',
                  goal: 'Build a valid HTML5 scaffold with descriptive title.',
                  hint: 'Remember to declare <!DOCTYPE html> and include <meta charset="UTF-8" />.',
                  difficulty: 'Easy',
                  xpReward: 25,
                  starterCode: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Learning Collective — HTML Foundations</title>
  </head>
  <body>
    
  </body>
</html>
`,
                  testDefinition: {
                    tests: [
                      { kind: 'html-has-doctype' },
                      { kind: 'html-element-text', selector: 'body h1', expected: 'Learning Collective' },
                    ],
                  },
                },
                {
                  title: 'Author structured copy',
                  order: 2,
                  prompt: 'Introduce the city with semantic headings and supporting paragraphs.',
                  goal: 'Add an <h1> and a descriptive paragraph of at least twelve words.',
                  hint: 'Use <p> for the description. Count your words!',
                  difficulty: 'Easy',
                  xpReward: 30,
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
                  testDefinition: {
                    tests: [
                      { kind: 'html-exists', selector: 'body p' },
                      { kind: 'html-word-count', selector: 'body p', min: 12 },
                    ],
                  },
                },
                {
                  title: 'Highlight key features with a list',
                  order: 3,
                  prompt: 'Transform the scroll into a quick-reference list of features.',
                  goal: 'Add a <ul> containing at least three <li> items.',
                  hint: 'Think about the benefits learning heroes need to see at a glance.',
                  difficulty: 'Easy',
                  xpReward: 30,
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
                  testDefinition: {
                    tests: [
                      { kind: 'html-exists', selector: 'body ul' },
                      { kind: 'html-min-children', selector: 'body ul', minChildren: 3 },
                    ],
                  },
                },
              ],
            },
          },
          {
            title: 'Chapter 2 · Element Forge',
            order: 2,
            storyText: 'Bring order to nested elements and attributes so the Codex can be parsed by future apprentices.',
            tasks: {
              create: [
                {
                  title: 'Nest elements correctly',
                  order: 1,
                  prompt: 'Forge a callout box using nested div, p, and span tags.',
                  goal: 'Ensure tags are properly nested for a warning message.',
                  hint: 'Start with a div wrapper and place text spans inside.',
                  difficulty: 'Medium',
                  xpReward: 35,
                  premium: false,
                  starterCode: `<div class="callout">
  <!-- Add content here -->
</div>
`,
                  testDefinition: {
                    tests: [
                      { kind: 'html-exists', selector: '.callout p strong' },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    include: { chapters: { include: { tasks: true } } },
  })

  const cssCourse = await prisma.course.create({
    data: {
      title: 'CSS Design Odyssey',
      slug: 'css-design-odyssey',
      level: 'Medium',
      description: 'Style interfaces from atomic utilities to responsive systems.',
      chapters: {
        create: [
          {
            title: 'Chapter 1 · Palette Apprentice',
            order: 1,
            storyText: 'Serve as stylist to the Constellation Archive with typography and spacing tokens.',
            tasks: {
              create: [
                {
                  title: 'Define gradient hero card',
                  order: 1,
                  prompt: 'Design a hero card with gradient background, padding, and rounded corners.',
                  goal: 'Add gradient background, padding >= 2.5rem, radius >= 1.5rem, and box-shadow.',
                  hint: 'Use linear-gradient and a box-shadow for depth.',
                  difficulty: 'Medium',
                  xpReward: 40,
                  starterCode: `.card {
  /* your styles */
}
`,
                  testDefinition: {
                    tests: [
                      { kind: 'css-has-property', selector: '.card', property: 'background' },
                      { kind: 'css-min-value', selector: '.card', property: 'padding', unit: 'rem', min: 2.5 },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  })

  console.log('Seeded courses:', htmlCourse.title, cssCourse.title)

  const password = await hash('password123', 12)
  await prisma.user.upsert({
    where: { email: 'demo@learningcollective.dev' },
    update: {},
    create: {
      name: 'Demo Learner',
      email: 'demo@learningcollective.dev',
      password,
    },
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
