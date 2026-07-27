import React, { useState } from 'react';
import { GraphNode, GraphEdge } from '../types/index.js';
import { ShieldAlert, TrendingUp, Wallet, Layers, Cpu, CheckCircle2 } from 'lucide-react';

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode: (node: GraphNode) => void;
  selectedNodeId?: string;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({ nodes, edges, onSelectNode, selectedNodeId }) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNodes = nodes.filter(n => filterType === 'all' || n.type === filterType);

  const getNodeColor = (type: string, risk?: string) => {
    if (type === 'wallet') return 'from-cyan-500 to-blue-600 border-cyan-400 shadow-cyan-500/30';
    if (type === 'asset') return 'from-slate-700 to-slate-800 border-slate-600 shadow-slate-700/20';
    if (type === 'protocol') return 'from-indigo-600 to-purple-600 border-indigo-400 shadow-indigo-500/30';
    if (type === 'yield') return 'from-emerald-500 to-teal-600 border-emerald-400 shadow-emerald-500/30';
    if (type === 'risk') return 'from-amber-500 to-rose-600 border-rose-400 shadow-rose-500/30';
    return 'from-slate-700 to-slate-800 border-slate-600';
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'wallet': return <Wallet className="h-5 w-5 text-cyan-200" />;
      case 'asset': return <Layers className="h-5 w-5 text-slate-200" />;
      case 'protocol': return <Cpu className="h-5 w-5 text-indigo-200" />;
      case 'yield': return <TrendingUp className="h-5 w-5 text-emerald-200" />;
      case 'risk': return <ShieldAlert className="h-5 w-5 text-amber-200" />;
      default: return <CheckCircle2 className="h-5 w-5 text-slate-200" />;
    }
  };

  return (
    <div className="relative flex h-[580px] w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#070b14] p-4 shadow-2xl">
      
      {/* Canvas Controls Header */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="font-heading text-sm font-semibold tracking-wide text-slate-200">
            LIVING KNOWLEDGE GRAPH CANVAS
          </span>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono-num text-slate-400">
            {nodes.length} Nodes • {edges.length} Edges
          </span>
        </div>

        {/* Node Filters */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-900/90 p-1 border border-slate-800">
          {['all', 'wallet', 'asset', 'protocol', 'yield', 'risk'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition ${
                filterType === type
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Connections Canvas Background */}
      <div className="relative flex-1 items-center justify-center p-4">
        
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>

        {/* Nodes Grid Layout */}
        <div className="relative z-10 grid h-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filteredNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <div
                key={node.id}
                onClick={() => onSelectNode(node)}
                className={`group cursor-pointer flex flex-col justify-between rounded-xl border p-4 backdrop-blur-md transition-all duration-300 ${getNodeColor(
                  node.type,
                  node.riskLevel
                )} ${
                  isSelected
                    ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 scale-105 shadow-2xl'
                    : 'hover:scale-102 hover:border-cyan-400/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-black/30 p-2 shadow-inner">
                    {getNodeIcon(node.type)}
                  </div>
                  <span className="rounded bg-black/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                    {node.type}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="font-heading text-sm font-bold text-white group-hover:text-cyan-300 transition">
                    {node.label}
                  </h4>
                  {node.chain && (
                    <span className="text-[11px] font-medium text-cyan-400/90">
                      {node.chain}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-2 text-xs">
                  <span className="text-slate-400">Valuation</span>
                  <span className="font-mono-num font-semibold text-slate-100">
                    ${node.val.toLocaleString()}
                  </span>
                </div>

                {node.apy && (
                  <div className="mt-1 flex items-center justify-between text-xs font-semibold text-emerald-400">
                    <span>Yield</span>
                    <span>+{node.apy}% APY</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Footer Info */}
      <div className="z-10 flex items-center justify-between border-t border-white/10 pt-2 text-xs text-slate-400">
        <span>Click any node to inspect OnchainOS parameters & trigger AI audit</span>
        <span className="font-mono-num text-cyan-400">Status: Active Graph Sync</span>
      </div>

    </div>
  );
};
