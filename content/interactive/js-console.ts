import { InteractiveLesson } from './types'
import { runJavaScript } from './utils'

const lesson: InteractiveLesson = {
  slug: 'js-console',
  title: 'JavaScript Console Power-Ups',
  description:
    'Learn to create reusable functions, work with arrays, and format data while mastering console output.',
  track: 'JavaScript Questline',
  estimatedTime: '25 minutes',
  steps: [
    {
      id: 'js-log-greeting',
      title: 'Write a reusable greeting function',
      instructions: [
        'Create a function named `logGreeting` that accepts a single parameter `name`.',
        'When invoked, the function should log “Hello, <name>! Welcome back.” to the console.',
        'Call `logGreeting` at least once with your own name so the message appears when the code runs.',
      ],
      starterCode: `// Write and call your function below

`,
      language: 'javascript',
      tests: [
        {
          id: 'function-exists',
          description: '`logGreeting` is defined as a function.',
          run: (code) => {
            const wrapped = new Function(`${code}; return typeof logGreeting === 'function';`)
            try {
              return wrapped()
            } catch {
              return false
            }
          },
          hint: 'Define the function using `function logGreeting(name) { ... }`.',
        },
        {
          id: 'function-logs',
          description: '`logGreeting` logs the expected message when called.',
          run: (code) => {
            const consoleLogs: string[] = []
            const sandboxConsole = { log: (...args: unknown[]) => consoleLogs.push(args.join(' ')) }
            try {
              const runner = new Function(
                'console',
                `${code}; if (typeof logGreeting !== 'function') throw new Error('logGreeting missing'); logGreeting('Ada');`
              )
              runner(sandboxConsole)
            } catch {
              return false
            }
            return consoleLogs.some((entry) => /Hello, Ada! Welcome back\./.test(entry))
          },
          hint: 'Make sure the message matches exactly: “Hello, Ada! Welcome back.”',
        },
      ],
      completionMessage: 'Great! Functions help reduce repetition and keep output consistent.',
    },
    {
      id: 'js-sum-numbers',
      title: 'Return useful data from a function',
      instructions: [
        'Create a function named `sumNumbers` that accepts two numbers and returns their sum.',
        'Store the result of calling `sumNumbers(42, 58)` in a variable named `total`.',
        'Log `total` to the console.',
      ],
      starterCode: `function logGreeting(name) {
  console.log(\`Hello, \${name}! Welcome back.\`);
}

logGreeting('Ada');

// Build sumNumbers here

`,
      language: 'javascript',
      tests: [
        {
          id: 'sum-function-exists',
          description: '`sumNumbers` exists as a function.',
          run: (code) => {
            const wrapped = new Function(`${code}; return typeof sumNumbers === 'function';`)
            try {
              return wrapped()
            } catch {
              return false
            }
          },
          hint: 'Define the function using `function sumNumbers(a, b) { ... }`.',
        },
        {
          id: 'sum-returns',
          description: '`sumNumbers(42, 58)` returns 100 and the total is logged.',
          run: (code) => {
            const consoleLogs: string[] = []
            const sandboxConsole = { log: (...args: unknown[]) => consoleLogs.push(args.join(' ')) }
            try {
              const runner = new Function(
                'console',
                `${code}; if (typeof sumNumbers !== 'function') throw new Error('sumNumbers missing'); const result = sumNumbers(42, 58); if(result !== 100){ throw new Error('Incorrect sum'); }`
              )
              runner(sandboxConsole)
            } catch {
              return false
            }
            return consoleLogs.some((entry) => entry.includes('100'))
          },
          hint: 'Return the sum from the function and log the result.',
        },
      ],
      completionMessage: 'Nice! You’re returning values and working with logs effectively.',
    },
    {
      id: 'js-array-map',
      title: 'Format arrays gracefully',
      instructions: [
        'Create an array named `tracks` with at least three strings representing course names.',
        'Use `.map` to transform each track into a numbered label like “1 — HTML Foundations”.',
        'Log the transformed array to the console as a single string joined by new lines.',
      ],
      starterCode: `function logGreeting(name) {
  console.log(\`Hello, \${name}! Welcome back.\`);
}

logGreeting('Ada');

function sumNumbers(a, b) {
  return a + b;
}

const total = sumNumbers(42, 58);
console.log(total);

// Format the tracks array here

`,
      language: 'javascript',
      tests: [
        {
          id: 'tracks-array',
          description: 'A `tracks` array with at least three items exists.',
          run: (code) => {
            try {
              const runner = new Function(`${code}; return Array.isArray(tracks) && tracks.length >= 3;`)
              return runner()
            } catch {
              return false
            }
          },
          hint: 'Declare `const tracks = [/* at least three strings */];`.',
        },
        {
          id: 'map-formatting',
          description: 'Console output shows numbered tracks on separate lines.',
          run: (code) => {
            const execution = runJavaScript(`${code}`)
            if (execution.error) return false
            const combinedOutput = execution.logs.join('\n')
            return /1\s+—/.test(combinedOutput) && combinedOutput.split('\n').length >= 3
          },
          hint: 'After mapping, join with `\n` and log the final string.',
        },
      ],
      completionMessage: 'Excellent! You’re transforming data and presenting it clearly in the console.',
    },
  ],
}

export default lesson

