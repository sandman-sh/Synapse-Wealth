import React from 'react';
import { Zap, ShieldCheck, CreditCard, Terminal, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenAspModal: () => void;
  onOpenX402Modal: () => void;
  isX402Unlocked: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAspModal, onOpenX402Modal, isX402Unlocked }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#060911]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand & OKX ASP Badge */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                SYNAPSE WEALTH
              </span>
              <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[11px] font-semibold text-cyan-400">
                OKX ASP
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Knowledge Graph Portfolio Concierge</p>
          </div>
        </div>

        {/* Network & Wallet Controls */}
        <div className="flex items-center gap-3">
          
          {/* Network Selector Badge */}
          <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium">X Layer (Mainnet)</span>
          </div>

          {/* x402 Status */}
          <button
            onClick={onOpenX402Modal}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              isX402Unlocked
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>{isX402Unlocked ? 'x402 Unlocked' : 'x402 Micropayment'}</span>
          </button>

          {/* ASP Inspector Button */}
          <button
            onClick={onOpenAspModal}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">OKX ASP Inspector</span>
          </button>

          {/* Wallet Address Badge */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-mono-num text-slate-200 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span>0x9A74...f321</span>
          </div>

        </div>

      </div>
    </header>
  );
};
