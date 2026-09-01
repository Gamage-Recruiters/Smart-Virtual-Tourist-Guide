import { useState, useRef, useEffect } from 'react';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';
import { useChatbot } from '../../hooks/safety/useChatbot';
import { QUICK_SUGGESTIONS } from '../../constants/safety/chatbotRules';

export default function ChatbotPanel() {
  const { messages, isProcessing, sendMessage, clearChat } = useChatbot();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to the bottom when messages change or processing starts
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;
    sendMessage(input);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChipClick = (query) => {
    if (isProcessing) return;
    sendMessage(query);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-sm h-full min-h-[280px] max-h-[320px] sm:min-h-[340px] sm:max-h-[380px]">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-white/20 p-1.5 rounded-full">
            <FaRobot size={16} />
          </div>
          <div>
            <h4 className="font-bold text-sm leading-tight">SafeBot</h4>
            <p className="text-blue-100 text-[11px]">Travel Safety Assistant</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-1.5 rounded-md hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          title="Clear chat"
          aria-label="Clear chat"
        >
          <FiTrash2 size={14} />
        </button>
      </div>

      {/* ── Messages Area ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/50" style={{ minHeight: 0 }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* Bot avatar */}
            {msg.role === 'bot' && (
              <div className="shrink-0 mr-2 mt-1">
                <div className="bg-blue-100 p-1.5 rounded-full text-blue-600">
                  <FaRobot size={12} />
                </div>
              </div>
            )}

            {/* Message bubble */}
            <div
              className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed ${msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-2xl rounded-br-md'
                : 'bg-white text-slate-700 rounded-2xl rounded-bl-md border border-slate-200 shadow-sm'
                }`}
            >
              {msg.role === 'bot' ? (
                /* Render newlines and basic formatting */
                <div className="whitespace-pre-wrap break-words">{msg.text}</div>
              ) : (
                <span>{msg.text}</span>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="shrink-0 mr-2 mt-1">
              <div className="bg-blue-100 p-1.5 rounded-full text-blue-600">
                <FaRobot size={12} />
              </div>
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md border border-slate-200 shadow-sm">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Invisible anchor for auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick Chips ─────────────────────────────────────────────── */}
      <div className="px-3 py-2 border-t border-slate-100 bg-white shrink-0">
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
          {QUICK_SUGGESTIONS.map((chip) => (
            <button
              key={chip.label}
              onClick={() => handleChipClick(chip.query)}
              disabled={isProcessing}
              className="whitespace-nowrap px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-medium rounded-full
                hover:bg-blue-100 transition-colors border border-blue-100 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input Area ──────────────────────────────────────────────── */}
      <div className="px-3 pb-3 pt-1 bg-white shrink-0">
        <div className="flex items-center gap-2 border border-slate-300 rounded-lg overflow-hidden focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition-all bg-white">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            disabled={isProcessing}
            className="flex-1 px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none bg-transparent disabled:opacity-50"
            aria-label="Chat message input"
            id="chatbot-input"
          />
          <button
            onClick={handleSend}
            disabled={isProcessing || !input.trim()}
            className="px-3 py-2.5 bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed shrink-0"
            aria-label="Send message"
            id="chatbot-send-btn"
          >
            <FiSend size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
