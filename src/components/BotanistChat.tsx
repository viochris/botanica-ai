import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import {
  Send,
  User,
  Trash2,
  Copy,
  Check,
  Info,
  X,
  Lightbulb,
  AlertTriangle,
} from 'lucide-react';
import { ChatMessage, PlantIdentificationData } from '../types';

interface BotanistChatProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  currentPlantContext: PlantIdentificationData | null;
  onClearPlantContext: () => void;
}

export const BotanistChat: React.FC<BotanistChatProps> = ({
  messages,
  setMessages,
  currentPlantContext,
  onClearPlantContext,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState<'gemini-4-argon' | 'gemini-3.8-flash' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  // Suggested prompt questions
  const samplePrompts = [
    'Why are my leaf tips turning brown and crispy?',
    'How do I naturally eliminate fungus gnats without harsh chemicals?',
    'What is the best way to propagate stem cuttings in water?',
    'How much should I reduce watering during winter dormancy?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isSending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      plantContext: currentPlantContext ? {
        commonName: currentPlantContext.commonName,
        scientificName: currentPlantContext.scientificName,
      } : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsSending(true);

    try {
      const historyPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      let taskComplexity = 'general';
      if (selectedModel === 'gemini-4-argon') {
        taskComplexity = 'complex';
      } else if (selectedModel === 'gemini-3.1-flash-lite') {
        taskComplexity = 'fast';
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          model: selectedModel,
          plantContext: currentPlantContext,
          taskComplexity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.reply || 'I apologize, could you please repeat that gardening question?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat send failed:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `I encountered an unexpected issue connecting to the botanical database: ${err.message || 'Network error'}. Please try asking again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        content: "Conversation history cleared. What plant questions can I answer for you?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
  };

  const renderFormattedContent = (content: string) => {
    try {
      const rawHtml = marked.parse(content, { async: false, breaks: true, gfm: true }) as string;
      // marked does not sanitize its output, so strip scripts, event handlers and unsafe URLs.
      const safeHtml = DOMPurify.sanitize(rawHtml, { USE_PROFILES: { html: true } });
      return (
        <div
          className="botanist-markdown text-xs sm:text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      );
    } catch {
      return <div className="whitespace-pre-wrap text-xs sm:text-sm">{content}</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Chat Top Banner & Model Configuration */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800 text-emerald-100 flex items-center justify-center font-serif-display font-bold text-lg shadow-xs">
            F
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900">Dr. Flora</h2>
              <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                Master Horticulturist
              </span>
            </div>
            <p className="text-xs text-stone-500">Multi-turn AI botanical consultation</p>
          </div>
        </div>

        {/* Model Selector Bar */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs overflow-x-auto w-full sm:w-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
              title="Fastest responses: quick tips, emergency triage"
              className={`flex-1 sm:flex-initial px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap font-medium text-center ${
                selectedModel === 'gemini-3.1-flash-lite'
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Flash Lite (Fast)
            </button>
            <button
              type="button"
              onClick={() => setSelectedModel('gemini-3.8-flash')}
              title="Recommended for general gardening tasks: care questions, watering routines, potting mixes"
              className={`flex-1 sm:flex-initial px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap font-medium text-center ${
                selectedModel === 'gemini-3.8-flash'
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              3.8 Flash (Standard)
            </button>
            <button
              type="button"
              onClick={() => setSelectedModel('gemini-4-argon')}
              title="Best for complex tasks: deep botanical pathology, soil biology, rare specimen propagation"
              className={`flex-1 sm:flex-initial px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap font-medium text-center ${
                selectedModel === 'gemini-4-argon'
                  ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Argon (Complex)
            </button>
          </div>

          <button
            type="button"
            onClick={clearChat}
            className="p-2 text-stone-400 hover:text-stone-700 transition-colors shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visible AI Disclaimer */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900 shadow-2xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          AI-generated information. Diagnosis and pet-toxicity details may be inaccurate; consult a vet or plant specialist before acting.
        </p>
      </div>

      {/* Active Focused Plant Badge (if available) */}
      {currentPlantContext && (
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Consultation actively focused on:{' '}
              <strong className="font-semibold">{currentPlantContext.commonName}</strong> (
              <em className="italic">{currentPlantContext.scientificName}</em>)
            </span>
          </div>
          <button
            onClick={onClearPlantContext}
            className="p-1 text-emerald-700 hover:text-emerald-900 transition-colors"
            title="Remove plant focus"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Scrollable Message Thread */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col h-[65vh] sm:h-[520px] overflow-hidden">
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
          {messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <div
                key={message.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                    isUser
                      ? 'bg-stone-800 text-stone-100'
                      : 'bg-emerald-800 text-emerald-100 font-serif-display'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : 'F'}
                </div>

                <div className="space-y-1">
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-emerald-800 text-white rounded-tr-xs shadow-xs'
                        : 'bg-stone-50 border border-stone-200 text-stone-800 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      renderFormattedContent(message.content)
                    )}
                  </div>

                  <div
                    className={`flex items-center gap-2 text-[10px] text-stone-400 px-1 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{message.timestamp}</span>
                    {message.modelUsed && (
                      <>
                        <span>·</span>
                        <span className="font-mono">{message.modelUsed}</span>
                      </>
                    )}
                    {!isUser && (
                      <button
                        onClick={() => handleCopyMessage(message.id, message.content)}
                        className="hover:text-stone-700 transition-colors ml-1"
                        title="Copy message"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-3 mr-auto max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-serif-display font-bold text-xs shrink-0">
                F
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-2xl rounded-tl-xs p-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-stone-500 ml-1">Dr. Flora is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Shelf */}
        <div className="p-3 border-t border-stone-100 bg-stone-50/50 flex items-center gap-2 overflow-x-auto">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-1" />
          <span className="text-[11px] font-medium text-stone-500 shrink-0">Suggestions:</span>
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              disabled={isSending}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] text-stone-600 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200 rounded-full px-3 py-1 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            <textarea
              ref={inputRef}
              rows={2}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Dr. Flora about watering, propagation, soil, pests, or yellow leaves... (Press Enter to send)"
              className="flex-1 p-2.5 sm:p-3 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 resize-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isSending}
              className={`p-3 rounded-xl transition-all flex items-center justify-center shrink-0 ${
                inputPrompt.trim() && !isSending
                  ? 'bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
