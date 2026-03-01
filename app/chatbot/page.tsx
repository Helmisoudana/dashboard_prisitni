'use client'

import { useState, useRef, useEffect, type ComponentPropsWithoutRef } from 'react'
import { motion } from 'framer-motion'
import AppLayout from '@/components/layout/app-layout'
import { chatAPI } from '@/lib/api'
import { Send, Loader2, Bot, User, FileText } from 'lucide-react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import InlineChart from '@/components/inline-chart'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const mdComponents: Components = {
  h1: (props: ComponentPropsWithoutRef<'h1'>) => (
    <h1 className="text-lg font-bold mt-4 mb-2 text-foreground border-b border-border/50 pb-1" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2 className="text-[15px] font-bold mt-4 mb-2 text-foreground" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 className="text-sm font-bold mt-3 mb-1.5 text-foreground" {...props} />
  ),
  h4: (props: ComponentPropsWithoutRef<'h4'>) => (
    <h4 className="text-sm font-semibold mt-2 mb-1 text-foreground" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p className="my-2 leading-relaxed" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="my-2 ml-5 list-disc space-y-1 marker:text-muted-foreground" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="my-2 ml-5 list-decimal space-y-1.5 marker:text-muted-foreground" {...props} />
  ),
  li: ({ children, ...props }: ComponentPropsWithoutRef<'li'>) => (
    <li className="leading-relaxed pl-1" {...props}>{children}</li>
  ),
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  em: (props: ComponentPropsWithoutRef<'em'>) => (
    <em className="italic text-muted-foreground" {...props} />
  ),
  hr: () => (
    <hr className="my-3 border-border/60" />
  ),
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote className="border-l-3 border-primary/60 pl-3 my-3 text-muted-foreground" {...props} />
  ),
  code: ({ children, className, ...props }: ComponentPropsWithoutRef<'code'>) => {
    const isChart = className?.includes('language-chart')
    if (isChart) {
      const raw = String(children).trim()
      return <InlineChart raw={raw} />
    }
    const isBlock = className?.includes('language-')
    if (isBlock) {
      return (
        <code className={`block text-xs ${className || ''}`} {...props}>
          {children}
        </code>
      )
    }
    return (
      <code className="bg-background/50 text-primary px-1.5 py-0.5 rounded text-[12px] font-mono border border-border/30" {...props}>
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }: ComponentPropsWithoutRef<'pre'>) => {
    const child = children as any
    if (child?.props?.className?.includes('language-chart')) {
      return <>{children}</>
    }
    return (
      <pre className="bg-background/50 rounded-lg p-3 my-3 overflow-x-auto text-xs leading-relaxed border border-border/30" {...props}>
        {children}
      </pre>
    )
  },
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full text-xs border-collapse" {...props} />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<'thead'>) => (
    <thead className="bg-background/50 text-foreground" {...props} />
  ),
  th: (props: ComponentPropsWithoutRef<'th'>) => (
    <th className="px-3 py-2 text-left font-semibold border-b border-border/60 whitespace-nowrap" {...props} />
  ),
  tr: (props: ComponentPropsWithoutRef<'tr'>) => (
    <tr className="border-b border-border/30 last:border-0" {...props} />
  ),
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td className="px-3 py-2 whitespace-nowrap" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<'a'>) => (
    <a className="text-primary underline underline-offset-2 hover:text-primary/80" target="_blank" {...props} />
  ),
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your **AI Factory Assistant**. I can help you with:\n- Production insights & KPIs\n- Machine diagnostics\n- Employee performance\n- Factory optimization\n\nWhat would you like to know today?',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isStreamingRef = useRef(false)

  const scrollToBottom = () => {
    const el = scrollContainerRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)

    try {
      const placeholder: Message = { role: 'assistant', content: '' }
      setMessages(prev => [...prev, placeholder])
      const assistantIdx = updatedMessages.length

      const stream = chatAPI.streamMessage(updatedMessages)
      for await (const chunk of stream) {
        setMessages(prev => {
          const updated = [...prev]
          updated[assistantIdx] = {
            ...updated[assistantIdx],
            content: updated[assistantIdx].content + chunk,
          }
          return updated
        })
      }
    } catch (error) {
      setMessages(prev => {
        const last = prev[prev.length - 1]
        if (last.role === 'assistant' && last.content === '') {
          return [
            ...prev.slice(0, -1),
            { role: 'assistant' as const, content: 'Sorry, I encountered an error. Please try again later.' },
          ]
        }
        return [...prev, { role: 'assistant' as const, content: 'Sorry, I encountered an error. Please try again later.' }]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReport = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsGeneratingReport(true)

    const reportMessages = [...messages, userMessage]

    try {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Generating your PDF report...' }])
      const blob = await chatAPI.generateReport(reportMessages)

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pristini_report_${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Your PDF report has been generated and downloaded.',
        }
        return updated
      })
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Failed to generate the report. Please try again.',
        }
        return updated
      })
    } finally {
      setIsGeneratingReport(false)
    }
  }

  return (
    <AppLayout>
      <motion.div
        className="space-y-6 h-full flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-foreground">AI Factory Assistant</h1>
          <p className="text-muted-foreground mt-2">Get insights and recommendations powered by AI</p>
        </motion.div>

        <motion.div
          className="flex flex-col flex-1 bg-card rounded-xl border border-border overflow-hidden min-h-[600px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 space-y-5">
              {messages.map((msg, idx) => {
                if (msg.role === 'assistant' && msg.content === '' && isLoading) return null
                return (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent text-accent-foreground'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-secondary text-secondary-foreground rounded-tl-sm'
                    }`}>
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{msg.content}</ReactMarkdown>
                      ) : (
                        <p className="leading-relaxed">{msg.content}</p>
                      )}
                    </div>
                  </div>
                </div>
                )
              })}

            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent text-accent-foreground flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-secondary px-4 py-3 rounded-xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Analyzing factory data...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask about production, machines, employees..."
                className="flex-1 px-4 py-3 bg-secondary text-foreground rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground"
              />
              <motion.button
                onClick={handleReport}
                disabled={isLoading || isGeneratingReport || !input.trim()}
                className="px-4 py-3 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                title="Generate PDF Report"
              >
                {isGeneratingReport ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              </motion.button>
              <motion.button
                onClick={handleSend}
                disabled={isLoading || isGeneratingReport || !input.trim()}
                className="px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  )
}
