import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Globe,
  ExternalLink,
  RefreshCw,
  Loader2,
  ChevronDown,
  IdCard,
} from 'lucide-react';
import { AbvpLogo } from './AbvpLogo';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  searchQueries?: string[];
  sources?: Array<{ title: string; url: string }>;
  grounded?: boolean;
}

export const VidyarthiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `**Namaskar! I am Vidyarthi Mitra**, the AI campus assistant for **ABVP Narasimha Datta College Unit, Howrah**.\n\nI can assist you with:\n- **Annual Membership (₹5 nominal fee)** and digital card generation\n- **College Admissions & Departments** at NDC\n- **Calcutta University Examination & Syllabus** updates\n- **Scholarships (SVMCM, Kanyashree, Aikyashree)**\n- **Student Help Desk & Grievance support**\n\nHow can I help you today? *(You can also write in বাংলা or हिंदी)*`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickQuestions = [
    'How to join ABVP NDC Unit (₹5 fee)?',
    'SVMCM Scholarship eligibility criteria',
    'Where is the NDC college campus?',
    'CU exam form fill-up & routine info',
  ];

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    if (!userText) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Thank you for contacting the ABVP Narasimha Datta College Unit.',
        searchQueries: data.searchQueries,
        sources: data.sources,
        grounded: data.grounded,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.warn('Chat request failed, using fallback:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'model',
          text: `**ABVP Narasimha Datta College Unit Info:**\n\n- **Membership Drive:** Enroll online in the **Membership** tab for just **₹5** with instant digital ID.\n- **Campus Address:** 129, Belilious Road, Howrah.\n- **Help Desk:** Reach our student representatives via the Help Desk section on this page.\n\nPlease feel free to ask another question!`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple renderer for markdown-like bold and bullet lists
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold rendering
      let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      processed = processed.replace(/\*(.*?)\*/g, '<em>$1</em>');
      processed = processed.replace(/`([^`]+)`/g, '<code class="bg-stone-200 px-1 py-0.5 rounded text-[11px]">$1</code>');

      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = processed.replace(/^[\s-*]+/, '');
        return (
          <li key={idx} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: itemText }} />
        );
      }
      if (/^\d+\.\s/.test(line.trim())) {
        const itemText = processed.replace(/^\d+\.\s+/, '');
        return (
          <li key={idx} className="ml-4 list-decimal" dangerouslySetInnerHTML={{ __html: itemText }} />
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return <p key={idx} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-full shadow-2xl border-2 border-orange-500 hover:scale-105 transition-all duration-200 group"
          aria-label="Ask Vidyarthi Mitra Campus AI"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-orange-400 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold font-display leading-tight flex items-center gap-1">
              <span>Ask Vidyarthi Mitra</span>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </span>
            <span className="text-[10px] text-orange-200 leading-none">
              AI Campus Assistant • Search Grounded
            </span>
          </div>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[420px] max-h-[85vh] h-[600px] bg-white rounded-2xl shadow-2xl border border-stone-300 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-slate-950 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <AbvpLogo size="sm" showText={false} />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm font-display text-white">Vidyarthi Mitra</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-orange-600 text-white">
                    AI Search
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  <span>ABVP NDC Campus Help</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: `welcome-${Date.now()}`,
                      role: 'model',
                      text: `Conversation refreshed. How can I help you regarding **Narasimha Datta College** or the **₹5 Membership**?`,
                    },
                  ]);
                }}
                title="Reset conversation"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50 text-xs">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-orange-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/40">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3 sm:p-3.5 space-y-2 ${
                      isUser
                        ? 'bg-orange-600 text-white rounded-tr-none shadow-sm'
                        : 'bg-white text-slate-800 border border-stone-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <div className="space-y-1">{renderFormattedText(m.text)}</div>

                    {/* Google Search Grounding Sources */}
                    {m.grounded && m.sources && m.sources.length > 0 && (
                      <div className="pt-2 mt-2 border-t border-stone-200/80 text-[10px] space-y-1">
                        <div className="flex items-center gap-1 font-semibold text-slate-500">
                          <Globe className="w-3 h-3 text-blue-600" />
                          <span>Google Search Sources:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {m.sources.map((src, idx) => (
                            <a
                              key={idx}
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-slate-700 max-w-full truncate border border-stone-200"
                            >
                              <span className="truncate">{src.title || 'Source'}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center shrink-0 mt-0.5 border border-orange-200">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-slate-500 text-xs">
                <div className="w-7 h-7 rounded-full bg-slate-900 text-orange-400 flex items-center justify-center shrink-0 border border-amber-400/40">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-600" />
                  <span>Vidyarthi Mitra is researching campus details...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Suggestions */}
          {messages.length <= 3 && (
            <div className="px-3 py-2 bg-stone-100 border-t border-stone-200 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-full bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-700 text-[11px] font-medium border border-stone-300 shrink-0 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 sm:p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about ₹5 membership, SVMCM, exams..."
              className="flex-1 text-xs px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl shadow transition-colors shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
