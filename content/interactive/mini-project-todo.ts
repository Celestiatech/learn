import { InteractiveLesson } from './types'
import { parseHtmlDocument, runJavaScriptWithDocument } from './utils'

const template = `<main>
  <section class="todo-app">
    <h1>Micro To-Do</h1>
    <form id="todo-form">
      <input id="todo-input" placeholder="Add a new task" />
      <button type="submit">Add</button>
    </form>
    <ul id="todo-list"></ul>
  </section>
</main>`

const lesson: InteractiveLesson = {
  slug: 'mini-project-todo',
  title: 'Mini Project — Micro To-Do App',
  description:
    'Build a lightweight to-do list experience that adds, toggles, and renders tasks with semantic markup.',
  track: 'Project Milestones',
  estimatedTime: '35 minutes',
  steps: [
    {
      id: 'todo-render-list',
      title: 'Render a list of tasks',
      instructions: [
        'Create an array named `tasks` containing three task objects with properties `{ id, text, completed }`.',
        'Write a function `renderList(list)` that receives an array and renders `<li>` items inside `#todo-list`.',
        'Each list item should include a checkbox input reflecting the `completed` state and the task text inside a `<span>`.',
        'Call `renderList(tasks)` to display the initial tasks.',
      ],
      starterCode: `// Define your initial tasks array

// Render helper
function renderList(list) {
  // TODO: implement rendering
}

renderList(tasks);
`,
      language: 'javascript',
      tests: [
        {
          id: 'tasks-array',
          description: '`tasks` is an array containing at least three items with id, text, and completed fields.',
          run: (code) => {
            try {
              const fn = new Function(`${code}; return Array.isArray(tasks) && tasks.length >= 3 && tasks.every(task => 'id' in task && 'text' in task && 'completed' in task);`)
              return fn()
            } catch {
              return false
            }
          },
          hint: 'Declare `const tasks = [{ id: 1, text: "...", completed: false }, ...];`.',
        },
        {
          id: 'render-helper',
          description: '`renderList` outputs list items with checkboxes and spans.',
          run: (code) => {
            const result = runJavaScriptWithDocument(
              `
${code}
`,
              template
            )
            if (result.error) return false
            const doc = result.document
            if (!doc) return false
            const items = Array.from(doc.querySelectorAll('#todo-list li'))
            if (items.length < 3) return false
            return items.every((item) => item.querySelector('input[type="checkbox"]') && item.querySelector('span'))
          },
          hint: 'Within `renderList`, create `<li>` elements with a checkbox and span for the text.',
        },
      ],
      completionMessage: 'Awesome start! Your to-do list now renders existing tasks.',
    },
    {
      id: 'todo-add-task',
      title: 'Handle new task submissions',
      instructions: [
        'Write a function `addTask(list, text)` that returns a new array with an appended task object.',
        'Each new task should have a unique `id` and default `completed` value of `false`.',
        'Attach a `submit` event listener to `#todo-form` that prevents the default behavior, reads the input value, updates the tasks array, rerenders the list, and clears the input.',
      ],
      starterCode: `const tasks = [
  { id: 1, text: 'Ship hero section', completed: true },
  { id: 2, text: 'Practice CSS gradients', completed: false },
  { id: 3, text: 'Review DOM patterns', completed: false },
];

function renderList(list) {
  const listElement = document.querySelector('#todo-list');
  if (!listElement) return;

  listElement.innerHTML = '';

  list.forEach((task) => {
    const item = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.dataset.id = String(task.id);

    const label = document.createElement('span');
    label.textContent = task.text;

    item.append(checkbox, label);
    listElement.appendChild(item);
  });
}

renderList(tasks);

// Implement addTask and the form handler below

`,
      language: 'javascript',
      tests: [
        {
          id: 'add-task-function',
          description: '`addTask` returns a new array with a correctly shaped task.',
          run: (code) => {
            try {
              const fn = new Function(`${code}; const updated = addTask(tasks, 'New mission'); return Array.isArray(updated) && updated.length === tasks.length + 1 && updated.at(-1)?.text === 'New mission' && updated.at(-1)?.completed === false;`)
              return fn()
            } catch {
              return false
            }
          },
          hint: 'Return a new array like `[...list, { id: Date.now(), text, completed: false }]`.',
        },
        {
          id: 'form-handler',
          description: 'Submitting the form adds a task, re-renders, and clears the input.',
          run: (code) => {
            const result = runJavaScriptWithDocument(
              `
${code}
const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
input.value = 'Write more tests';
form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
const items = document.querySelectorAll('#todo-list li');
const lastLabel = items[items.length - 1]?.querySelector('span');
return {
  length: items.length,
  lastText: lastLabel?.textContent || '',
  inputValue: input.value
};
`,
              template
            )

            if (result.error) return false
            const payload = result.document
            if (!payload) return false
            const items = payload.querySelectorAll('#todo-list li')
            const lastLabel = items[items.length - 1]?.querySelector('span')
            const input = payload.querySelector('#todo-input')
            return (
              items.length >= 4 &&
              /Write more tests/i.test(lastLabel?.textContent || '') &&
              ((input as HTMLInputElement)?.value ?? '') === ''
            )
          },
          hint: 'Inside the submit handler, prevent default, update tasks, re-render, and clear the input field.',
        },
      ],
      completionMessage: 'Great! You can now add tasks dynamically.',
    },
    {
      id: 'todo-toggle',
      title: 'Toggle completion and style updates',
      instructions: [
        'Add a click event listener to `#todo-list` that checks if a checkbox was clicked.',
        'When toggled, update the corresponding task’s `completed` property and rerender the list.',
        'If a task is completed, apply a class `done` to the `<li>` so it can be styled differently.',
      ],
      starterCode: `const tasks = [
  { id: 1, text: 'Ship hero section', completed: true },
  { id: 2, text: 'Practice CSS gradients', completed: false },
  { id: 3, text: 'Review DOM patterns', completed: false },
];

function renderList(list) {
  const listElement = document.querySelector('#todo-list');
  if (!listElement) return;

  listElement.innerHTML = '';

  list.forEach((task) => {
    const item = document.createElement('li');
    if (task.completed) {
      item.classList.add('done');
    }
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.dataset.id = String(task.id);

    const label = document.createElement('span');
    label.textContent = task.text;

    item.append(checkbox, label);
    listElement.appendChild(item);
  });
}

function addTask(list, text) {
  const trimmed = text.trim();
  if (!trimmed) return list;
  const nextId = Math.max(...list.map((item) => item.id)) + 1;
  return [...list, { id: nextId, text: trimmed, completed: false }];
}

renderList(tasks);

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');

if (form && input) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value;
    if (!value.trim()) return;
    const updated = addTask(tasks, value);
    tasks.length = 0;
    tasks.push(...updated);
    renderList(tasks);
    input.value = '';
  });
}

// Wire the toggle behavior here

`,
      language: 'javascript',
      tests: [
        {
          id: 'toggle-handler',
          description: 'Clicking a checkbox toggles the task completion and adds the done class.',
          run: (code) => {
            const result = runJavaScriptWithDocument(
              `
${code}
const list = document.querySelector('#todo-list');
const firstCheckbox = list?.querySelector('input[type="checkbox"]');
if (firstCheckbox) {
  firstCheckbox.checked = !firstCheckbox.checked;
  firstCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
  firstCheckbox.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}
const firstItem = list?.querySelector('li');
return {
  hasDoneClass: firstItem?.classList.contains('done') ?? false
};
`,
              template
            )
            if (result.error) return false
            const doc = result.document
            if (!doc) return false
            const firstItem = doc.querySelector('#todo-list li')
            return !!firstItem && firstItem.classList.contains('done')
          },
          hint: 'Listen for `change` events on the list, update the task data, and re-render.',
        },
      ],
      completionMessage: 'Fantastic! Your mini to-do app now handles adding and completing tasks.',
    },
  ],
}

export default lesson

