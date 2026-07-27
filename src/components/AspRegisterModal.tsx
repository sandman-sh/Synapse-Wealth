import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Terminal, Shield, ExternalLink, RefreshCw } from 'lucide-react';
import { AgentCardManifest } from '../types/index.js';

interface AspRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AspRegisterModal: React.FC<AspRegisterModalProps> = ({ isOpen, onClose }) => {
  const [manifest, setManifest] = useState<AgentCardManifest | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/agent-card.json')
        .then((res) => res.json())
        .then((data) => {
          setManifest(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cliPrompt = "Help me register an A2MCP ASP on OKX.AI using OKX Agent Identity from Onchain OS";

  const handleCopy = () => {
    navigator.clipboard.writeText(cliPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0b101d] p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-white">OKX ASP REGISTRATION & MANIFEST INSPECTOR</h2>
              <span className="text-xs text-slate-400">Agentic Service Provider Schema (`agent-card.json`)</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Manifest Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">Live `agent-card.json` Payload</span>
            <a
              href="/agent-card.json"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:underline"
            >
              <span>View Raw Endpoint</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="h-52 w-full overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono-num text-xs text-cyan-300">
            {loading ? (
              <div className="flex items-center gap-2 text-slate-400">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Loading OKX ASP Manifest...</span>
              </div>
            ) : (
              <pre>{JSON.stringify(manifest, null, 2)}</pre>
            )}
          </div>
        </div>

        {/* Registration Instructions Box */}
        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300">OKX.AI Agent Registration Prompt</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded bg-cyan-500/20 px-2.5 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30 transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
            </button>
          </div>
          <p className="font-mono-num text-xs text-white bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
            {cliPrompt}
          </p>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>OnchainOS Identity: ERC-8004 Verified</span>
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
