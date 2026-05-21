import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

const sendMessage = async () => {
  const text = input.trim()
  if (!text || isStreaming) return

  setInput('')
  setMessages(prev => [...prev, { role: 'user', content: text }])
  setIsStreaming(true)
  setMessages(prev => [...prev, { 
    role: 'assistant', 
    content: '...', 
    streaming: true 
  }])

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, userId: 'test' }),
    })

    const data = await response.json()

    setMessages(prev => {
      const updated = [...prev]
      updated[updated.length - 1] = {
        role: 'assistant',
        content: data.text ?? data.error ?? 'Something went wrong.',
        streaming: false,
      }
      return updated
    })

  } catch {
    setMessages(prev => {
      const updated = [...prev]
      updated[updated.length - 1] = {
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        streaming: false,
      }
      return updated
    })
  } finally {
    setIsStreaming(false)
  }
}

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col gap-4 max-w-2xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center pt-20">
            <p className="text-purple-300 text-sm">Say something to begin.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-3xl px-5 py-3.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white rounded-br-md'
                  : 'bg-white border border-purple-100 text-gray-800 shadow-sm rounded-bl-md'
              }`}
            >
              {msg.content}
              {msg.streaming && (
                <span className="inline-block w-1.5 h-4 ml-0.5 bg-purple-400 rounded-sm align-middle animate-pulse" />
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-purple-100 px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-3 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            disabled={isStreaming}
            className="flex-1 resize-none rounded-2xl border border-purple-200 px-4 py-3 text-sm text-gray-800 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isStreaming || !input.trim()}
            className="rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-3 text-sm font-medium transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
