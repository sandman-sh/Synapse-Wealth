import React, { useState } from 'react';
import { Bot, Send, Sparkles, Terminal, ShieldCheck, CornerDownLeft } from 'lucide-react';

interface AiConciergeProps {
  onOpenAspModal: () => void;
  onOpenX402Modal: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const renderFormattedText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-bold text-cyan-300">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-cyan-200 border border-slate-700">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={idx} className="italic text-slate-300">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
};

const renderMessageContent = (content: string) => {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} className="h-1" />;

    if (trimmed.startsWith('### ')) {
      return (
        <h4 key={i} className="font-heading text-xs font-bold text-cyan-400 mt-2 mb-1">
          {renderFormattedText(trimmed.replace(/^###\s+/, ''))}
        </h4>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h3 key={i} className="font-heading text-xs font-bold text-cyan-300 mt-2 mb-1">
          {renderFormattedText(trimmed.replace(/^##\s+/, ''))}
        </h3>
      );
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <div key={i} className="flex items-start gap-1.5 ml-2 my-0.5">
          <span className="text-cyan-400 font-bold">•</span>
          <span>{renderFormattedText(trimmed.replace(/^[-*]\s+/, ''))}</span>
        </div>
      );
    }
    if (/^\d+\.\s+/.test(trimmed)) {
      const numMatch = trimmed.match(/^(\d+\.)\s+(.*)/);
      if (numMatch) {
        return (
          <div key={i} className="flex items-start gap-1.5 ml-2 my-0.5">
            <span className="font-semibold text-cyan-400 font-mono-num">{numMatch[1]}</span>
            <span>{renderFormattedText(numMatch[2])}</span>
          </div>
        );
      }
    }

    return (
      <p key={i} className="mb-1 last:mb-0">
        {renderFormattedText(line)}
      </p>
    );
  });
};

export const AiConcierge: React.FC<AiConciergeProps> = ({ onOpenAspModal, onOpenX402Modal }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello! I am **AURA** — your personal Onchain AI Wealth Concierge.\n\nI have analyzed your multi-chain portfolio: **$35,047.50 Net Worth** across ETH, OKB, USDT, and INJ.\n\nHow can I help you optimize yields, run an x402 risk audit, or inspect our OKX ASP manifest today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const newMsgs: ChatMessage[] = [...messages, { role: 'user', content: query }];
    setMessages(newMsgs);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history: newMsgs })
      });
      const data = await res.json();
      setMessages([...newMsgs, { role: 'assistant', content: data.reply || 'Analysis complete.' }]);
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: 'Your portfolio is active. Try asking about **OKX DEX yield opportunities** or **registering our ASP on OKX.AI**!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "How do I register Synapse Wealth on OKX.AI?",
    "Find high yield APY routes for my USDT & OKB",
    "What is the status of my x402 micropayment?",
    "Run smart contract risk audit"
  ];

  return (
    <div className="flex h-[580px] w-full flex-col rounded-2xl border border-white/10 bg-[#070b14] shadow-2xl overflow-hidden">
      
      {/* Concierge Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/80 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-white tracking-wide">AURA AI CONCIERGE</h3>
            <span className="text-[10px] text-cyan-400 font-mono-num font-semibold">Autonomous Onchain Wealth Advisor</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAspModal}
            className="flex items-center gap-1 rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[11px] font-medium text-cyan-300 hover:bg-cyan-500/20"
          >
            <Terminal className="h-3 w-3" />
            <span>ASP Manifest</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyan-600 text-white font-medium rounded-tr-none'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
              }`}
            >
              {renderMessageContent(msg.content)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono-num animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Analyzing OnchainOS knowledge graph & computing yields...</span>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      <div className="border-t border-white/5 bg-slate-950/60 p-2 overflow-x-auto">
        <div className="flex gap-2">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="shrink-0 rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1 text-[11px] text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="border-t border-white/10 bg-slate-950 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about yields, x402 payments, or OKX ASP registration..."
            className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50 transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
