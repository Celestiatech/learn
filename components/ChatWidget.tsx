import { useEffect, useMemo, useRef, useState } from 'react'
import { ChatBubbleIcon, Cross2Icon, PaperPlaneIcon } from '@radix-ui/react-icons'

type MessageRole = 'user' | 'bot'

type ChatMessage = {
  id: string
  role: MessageRole
  text: string
}

type ScriptedReply = {
  keywords: string[]
  response: string
}

const scriptedReplies: ScriptedReply[] = [
  {
    keywords: ['signin', 'login', 'account'],
    response: 'Need help signing in? Make sure your email is verified and try resetting your password if needed. You can always reach out to support@simplycode.dev for more help.',
  },
  {
    keywords: ['progress', 'lesson', 'track'],
    response: 'Your lesson progress syncs automatically when you are signed in. Visit the Profile page to review your XP, streak, and completed lessons.',
  },
  {
    keywords: ['price', 'pricing', 'plan', 'subscribe'],
    response: 'We currently offer a free tier for early learners and a Pro tier with cohort workshops and mentor feedback. Check out the Pricing page for the full comparison.',
  },
  {
    keywords: ['contact', 'support', 'email'],
    response: 'You can reach our support team any time at support@simplycode.dev. We usually reply within one business day.',
  },
  {
    keywords: ['course', 'curriculum', 'roadmap'],
    response: 'Our curriculum is split into immersive tracks. Start with HTML & CSS basics, then move through DOM manipulation, JavaScript fundamentals, and project-based missions.',
  },
  {
    keywords: ['theme', 'dark mode', 'light mode'],
    response: 'You can toggle between light and dark themes from the header. When you are signed in we remember your choice across devices.',
  },
  {
    keywords: ['xp', 'streak', 'level'],
    response: 'XP and streaks increase as you complete interactive lessons and tasks. Visit your Profile to see totals, current level, and streak progress.',
  },
  {
    keywords: ['certificate', 'certification'],
    response: 'Complete every lesson in a track and you’ll unlock a downloadable certificate. Head to the Profile page to view any certificates you have earned.',
  },
  {
    keywords: ['bug', 'issue', 'feedback'],
    response: 'Thanks for spotting something! Please email the details to feedback@simplycode.dev or drop them in the in-app feedback form so we can investigate quickly.',
  },
  {
    keywords: ['ai', 'chatbot', 'assistant'],
    response: 'The chat assistant gives quick answers about SimplyCode. Want a smarter AI tutor? Let us know at feedback@simplycode.dev so we can add you to the beta waitlist.',
  },
  {
    keywords: ['delete account', 'remove account', 'privacy'],
    response: 'You can request account deletion by emailing privacy@simplycode.dev from the address tied to your profile. We’ll remove your data within 48 hours.',
  },
]

function matchReply(text: string): string {
  const normalized = text.toLowerCase()
  for (const entry of scriptedReplies) {
    if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
      return entry.response
    }
  }
  return "I'm here to help! Try asking about signing in, progress, pricing, themes, certificates, or how to contact support."
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'bot',
      text: 'Hi! I’m the SimplyCode guide. Ask me about lessons, progress, pricing, or getting in touch with support.',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const canSend = input.trim().length > 0 && !isTyping

  useEffect(() => {
    if (!open) return
    const node = scrollRef.current
    if (node) {
      node.scrollTop = node.scrollHeight
    }
    const timeout = window.setTimeout(() => {
      inputRef.current?.focus()
    }, 120)
    return () => window.clearTimeout(timeout)
  }, [open, messages])

  const handleToggle = () => {
    setOpen((prev) => !prev)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    const replyText = matchReply(trimmed)
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'bot',
          text: replyText,
        },
      ])
      setIsTyping(false)
    }, 600)
  }

  const statusText = useMemo(() => {
    if (isTyping) return 'SimplyCode guide is typing…'
    return 'Ask about lessons, pricing, or support'
  }, [isTyping])

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        className="fixed bottom-6 right-6 z-[var(--z-index-5)] inline-flex h-14 w-14 items-center justify-center rounded-full border border-soft bg-[var(--gradient-brand-alt)] text-white shadow-[0_20px_60px_-25px_rgba(var(--primary--800-rgb),0.65)] transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent-primary)]"
        aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
      >
        {open ? <Cross2Icon className="h-5 w-5" /> : <ChatBubbleIcon className="h-6 w-6" />}
      </button>

      {open ? (
        <div className="fixed bottom-24 right-6 z-[var(--z-index-5)] w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-3xl border border-soft bg-surface-card shadow-[0_28px_120px_-35px_rgba(var(--primary--800-rgb),0.65)] backdrop-blur">
          <header className="flex items-center justify-between border-b border-white/5 bg-white/5 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-heading">SimplyCode Guide</p>
              <p className="text-xs text-secondary">{statusText}</p>
            </div>
            <button
              type="button"
              onClick={handleToggle}
              className="rounded-full border border-soft bg-surface-card p-1 text-heading transition hover:border-strong hover:text-[var(--color-accent-primary)]"
              aria-label="Close chat assistant"
            >
              <Cross2Icon className="h-4 w-4" />
            </button>
          </header>

          <div ref={scrollRef} className="max-h-[340px] overflow-y-auto px-5 py-4 space-y-4 text-sm tracking-[0.01em]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-[var(--gradient-brand-alt)] text-white shadow-[0_14px_40px_-20px_rgba(var(--primary--800-rgb),0.55)]'
                      : 'border border-soft bg-surface-muted text-heading'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping ? (
              <div className="flex justify-start">
                <div className="flex max-w-[82%] items-center gap-2 rounded-2xl border border-soft bg-surface-muted px-4 py-2 text-xs text-secondary">
                  <span className="inline-flex h-2 w-2 animate-bounce rounded-full bg-[var(--color-accent-primary)]" />
                  typing…
                </div>
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/5 bg-white/5 px-5 py-4">
            <div className="flex items-center gap-3 rounded-full border border-soft bg-surface-card px-4 py-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a question…"
                className="flex-1 bg-transparent text-sm text-heading placeholder:text-secondary focus:outline-none"
                type="text"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent-primary)] px-3 py-2 text-white transition hover:bg-[var(--color-accent-primary)]/80 disabled:opacity-60"
                aria-label="Send message"
              >
                <PaperPlaneIcon className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  )
}

