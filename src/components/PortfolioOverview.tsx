import React from 'react';
import { PortfolioAsset, YieldOpportunity, RiskAuditAlert } from '../types/index.js';
import { DollarSign, TrendingUp, ShieldAlert, Zap, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface PortfolioOverviewProps {
  assets: PortfolioAsset[];
  yields: YieldOpportunity[];
  risks: RiskAuditAlert[];
  onExecuteRebalance: () => void;
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  assets,
  yields,
  risks,
  onExecuteRebalance
}) => {
  const totalValue = assets.reduce((sum, a) => sum + a.valueUsd, 0);

  return (
    <div className="space-y-6">
      
      {/* 4 Executive Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Net Worth */}
        <div className="glass-panel-interactive rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400">NET WORTH</span>
            <div className="rounded-lg bg-cyan-500/20 p-2 text-cyan-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-mono-num text-2xl font-bold text-white">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <span className="text-[11px] font-semibold text-emerald-400">+3.4% this week</span>
          </div>
        </div>

        {/* Avg Yield APY */}
        <div className="glass-panel-interactive rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400">OPTIMIZED APY</span>
            <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-mono-num text-2xl font-bold text-emerald-400">14.5% APY</h3>
            <span className="text-[11px] text-slate-400">OKX DEX Vault Potential</span>
          </div>
        </div>

        {/* Risk Score */}
        <div className="glass-panel-interactive rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400">RISK SCORE</span>
            <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-heading text-2xl font-bold text-amber-300">Low-Medium</h3>
            <span className="text-[11px] text-slate-400">{risks.length} Risk flags detected</span>
          </div>
        </div>

        {/* OKX ASP Status */}
        <div className="glass-panel-interactive rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-400">OKX ASP STATE</span>
            <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="font-heading text-2xl font-bold text-cyan-300">A2MCP Ready</h3>
            <span className="text-[11px] text-slate-400">OnchainOS ERC-8004</span>
          </div>
        </div>

      </div>

      {/* Grid: Assets Table + Yield Strategies */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Token Allocation (7 Cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-heading text-sm font-bold text-white tracking-wide">
              TOKEN ALLOCATION & BALANCE
            </h3>
            <span className="text-xs font-mono-num text-slate-400">{assets.length} Tokens</span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400">
                  <th className="pb-2 font-medium">Asset</th>
                  <th className="pb-2 font-medium">Chain</th>
                  <th className="pb-2 font-medium text-right">Balance</th>
                  <th className="pb-2 font-medium text-right">Value (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono-num">
                {assets.map((asset, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 flex items-center gap-2">
                      <span className="text-base">{asset.icon}</span>
                      <div>
                        <span className="font-bold text-white block">{asset.symbol}</span>
                        <span className="text-[10px] text-slate-400 font-sans">{asset.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-slate-300 font-sans">{asset.chain}</td>
                    <td className="py-2.5 text-right font-medium text-slate-200">
                      {asset.balance.toLocaleString()} {asset.symbol}
                    </td>
                    <td className="py-2.5 text-right font-bold text-white">
                      ${asset.valueUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* High-Yield Opportunities (5 Cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading text-sm font-bold text-white tracking-wide">
                RECOMMENDED YIELD ROUTES
              </h3>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                OKX DEX Verified
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {yields.map((route) => (
                <div
                  key={route.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 hover:border-emerald-500/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading text-xs font-bold text-white">{route.protocol}</h4>
                      <span className="text-[10px] text-slate-400">{route.chain} • {route.asset}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono-num text-sm font-extrabold text-emerald-400 block">
                        +{route.apy}% APY
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono-num">
                        +${route.estimatedReturnUsd}/yr
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onExecuteRebalance}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition"
          >
            <span>Execute Optimal Rebalance</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
