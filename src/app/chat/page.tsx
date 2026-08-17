'use client';

import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

import { RequireAuth } from '@/components/auth/RequireAuth';
import type { ChatMessage } from '@/lib/types';
import { trackEngagement } from '@/lib/signals';
import { cn } from '@/lib/utils';
import {
  ZenPage,
  ZenButton,
  ZenBackLink,
} from '@/components/zen';
import ModulePage from '@/components/ui/ModulePage';
import { getTheme } from '@/lib/moduleThemes';
import { useChatPhase } from './components/chatPhase';
import { mapChatSentiment } from './components/mapChatSentiment';
import { SeviyanCompanion } from './components/SeviyanCompanion';
import { ChatBubble } from './components/ChatBubble';
import { ChatAtmosphere } from './components/ChatAtmosphere';

const initialGreeting: ChatMessage = {
  id: -1,
  role: 'assistant',
  content: "Hello, I'm Seviyan. Share what's on your mind, and we'll work through it together.",
  createdAt: new Date().toISOString(),
};

const QUICK_PROMPTS = [
  "I'm feeling overwhelmed by school",
  'Help me unwind after a long day',
  'I need a gentle pep talk',
  "Let's plan one small next step",
];

const PRE_REACT_MS = 200;

const filterVisibleMessages = (messages: ChatMessage[]) =>
  messages.filter((message) => message.role === 'user' || message.role === 'assistant');

const ChatContent = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [bloomMessageId, setBloomMessageId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    phase,
    presentation,
    showThoughtCloud,
    onFocus,
    onBlur,
    onInputChange,
    beginProcessing,
    beginResponding,
    resetToIdle,
  } = useChatPhase();

  useEffect(() => {
    trackEngagement('chatbot_seviyan', 'opened');
    const start = Date.now();
    return () => {
      const duration = Math.round((Date.now() - start) / 1000);
      trackEngagement('chatbot_seviyan', 'completed', duration);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending, bloomMessageId]);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    beginProcessing();
    setIsSending(true);
    setBloomMessageId(null);

    const newUserMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput('');
    onInputChange('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/chat/message`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          conversation_history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || "I'm here for you. Can you tell me more?";
      const mapped = mapChatSentiment(data);

      beginResponding(mapped);
      await new Promise((r) => window.setTimeout(r, PRE_REACT_MS));

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: reply,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setBloomMessageId(assistantMessage.id);

      if (data.safety_triggered) {
        toast.warning(
          'We noticed you might be going through a tough time. Please reach out to someone you trust.',
        );
      }
    } catch (error) {
      console.error('Failed to send chat message', error);
      resetToIdle();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: "I had trouble connecting. Please try again — I'm here for you.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const visibleMessages = filterVisibleMessages(messages);
  const hasConversation = visibleMessages.length > 0;
  const theme = getTheme('chat');
  const thoughtVisible = showThoughtCloud || phase === 'paused';

  return (
    <ModulePage theme={theme}>
      <div className="relative">
        <ChatAtmosphere emotion={presentation.emotion} />
        <ZenPage
          atmosphere="none"
          className="relative z-10 h-[calc(100dvh-4rem)] pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-4"
        >
          <div className="mx-auto flex h-full w-full max-w-[1100px] flex-col px-3 sm:px-4 lg:px-6">
            <div className="shrink-0 space-y-3 px-1 pt-3">
              <ZenBackLink section="Seviyan" />
              <header className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="font-display text-2xl font-medium tracking-[-0.02em] text-white md:text-[1.75rem]">
                    Seviyan
                  </h1>
                  <p className="mt-0.5 font-ui text-sm text-blue-100/80">
                    Your listening companion
                  </p>
                </div>
                <ZenButton
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn(
                    'shrink-0 border-white/25 bg-white/10 text-white',
                    'hover:bg-white/18 hover:text-white',
                  )}
                  onClick={() => {
                    setMessages([]);
                    setBloomMessageId(null);
                    resetToIdle();
                  }}
                >
                  Clear chat
                </ZenButton>
              </header>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-2 pt-5">
              <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
                {hasConversation
                  ? visibleMessages.map((message) => (
                      <ChatBubble
                        key={message.id}
                        role={message.role === 'user' ? 'user' : 'assistant'}
                        content={message.content}
                        bloom={
                          message.role === 'assistant' && message.id === bloomMessageId
                        }
                      />
                    ))
                  : null}

                {!visibleMessages.length && !isSending ? (
                  <ChatBubble role="assistant" content={initialGreeting.content} />
                ) : null}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="mx-auto w-full max-w-3xl shrink-0 px-1 pb-2 pt-1">
              <SeviyanCompanion
                emotion={presentation.emotion}
                animation={presentation.animation}
                showThoughtCloud={thoughtVisible}
              />

              <div className="mt-2 flex flex-wrap justify-center gap-2 md:mt-2.5">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      setInput(prompt);
                      onInputChange(prompt);
                      onFocus();
                    }}
                    className={cn(
                      'min-h-9 rounded-2xl px-3 py-1.5',
                      'border border-[hsl(221_70%_52%/0.22)] bg-[hsl(220_60%_97%)]',
                      'font-ui text-[0.75rem] font-medium text-[hsl(222_47%_20%)]',
                      'shadow-[0_4px_14px_-10px_rgba(15,23,42,0.35)]',
                      'transition-colors hover:bg-[hsl(221_70%_52%/0.12)]',
                      'active:scale-[0.98]',
                      'focus-visible:outline-2 focus-visible:outline-zen-primary focus-visible:outline-offset-2',
                    )}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <form
                onSubmit={handleSendMessage}
                className={cn(
                  'mt-2.5 flex items-center gap-2 rounded-[22px] px-3 py-1.5 md:mt-3 md:px-3.5',
                  'border border-white/25 bg-white/[0.12]',
                  'shadow-[0_10px_32px_-18px_rgba(0,0,0,0.5)]',
                  'backdrop-blur-md',
                  'focus-within:border-zen-primary/55 focus-within:ring-2 focus-within:ring-zen-primary/25',
                )}
              >
                <input
                  value={input}
                  onChange={(event) => {
                    const next = event.target.value;
                    setInput(next);
                    onInputChange(next);
                  }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  placeholder="Share what's on your mind…"
                  disabled={isSending}
                  aria-label="Message Seviyan"
                  className={cn(
                    'min-h-11 flex-1 bg-transparent px-1 py-2',
                    'font-ui text-sm text-white placeholder:text-blue-100/55',
                    'outline-none disabled:cursor-not-allowed disabled:opacity-50',
                  )}
                />
                <ZenButton
                  type="submit"
                  size="icon-sm"
                  variant="primary"
                  disabled={isSending || !input.trim()}
                  aria-label="Send message"
                  className="shrink-0 rounded-full shadow-zen-subtle"
                >
                  <Send className="h-3.5 w-3.5" />
                </ZenButton>
              </form>
            </div>
          </div>
        </ZenPage>
      </div>
    </ModulePage>
  );
};

export default function ChatPage() {
  return (
    <RequireAuth>
      <ChatContent />
    </RequireAuth>
  );
}
