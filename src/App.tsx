import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GraphCanvas } from './components/GraphCanvas';
import { PortfolioOverview } from './components/PortfolioOverview';
import { AiConcierge } from './components/AiConcierge';
import { AspRegisterModal } from './components/AspRegisterModal';
import { X402PaymentModal } from './components/X402PaymentModal';
import { GraphNode, GraphEdge, PortfolioAsset, YieldOpportunity, RiskAuditAlert } from './types';
import { Sparkles, Layers, RefreshCw } from 'lucide-react';

export function App() {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [yields, setYields] = useState<YieldOpportunity[]>([]);
  const [risks, setRisks] = useState<RiskAuditAlert[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const [isAspModalOpen, setIsAspModalOpen] = useState(false);
  const [isX402ModalOpen, setIsX402ModalOpen] = useState(false);
  const [isX402Unlocked, setIsX402Unlocked] = useState(false);

  const [activeTab, setActiveTab] = useState<'canvas' | 'portfolio'>('canvas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [portRes, yieldRes, riskRes] = await Promise.all([
          fetch('/api/portfolio'),
          fetch('/api/yields'),
          fetch('/api/risks')
        ]);
        const portData = await portRes.json();
        const yieldData = await yieldRes.json();
        const riskData = await riskRes.json();

        setAssets(portData.assets || []);
        setNodes(portData.nodes || []);
        setEdges(portData.edges || []);
        setYields(yieldData || []);
        setRisks(riskData || []);
      } catch (err) {
        console.error('Data fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleExecuteRebalance = () => {
    setActiveTab('canvas');
    alert('Rebalance strategy triggered! Swap routes prepared via OKX DEX.');
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col">
      
      {/* Top Navigation */}
      <Navbar
        onOpenAspModal={() => setIsAspModalOpen(true)}
        onOpenX402Modal={() => setIsX402ModalOpen(true)}
        isX402Unlocked={isX402Unlocked}
      />

      {/* Main Workspace */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        
        {/* Banner Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="h-5 w-5 animate-spin" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-bold text-white">SYNAPSE WEALTH (OKX ASP AI)</h2>
              <p className="text-xs text-slate-400">OnchainOS Knowledge Graph Wealth Planner & AI Concierge</p>
            </div>
          </div>

          {/* View Tab Toggle */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setActiveTab('canvas')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === 'canvas'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Living Graph Canvas</span>
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === 'portfolio'
                  ? 'bg-cyan-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Portfolio Metrics</span>
            </button>
          </div>
        </div>

        {/* Content Layout Grid (8 Cols Left, 4 Cols Right) */}
        {loading ? (
          <div className="flex h-64 items-center justify-center text-cyan-400 font-mono-num gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Initializing OnchainOS Knowledge Graph...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            
            {/* Left Area (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {activeTab === 'canvas' ? (
                <GraphCanvas
                  nodes={nodes}
                  edges={edges}
                  onSelectNode={(node) => setSelectedNode(node)}
                  selectedNodeId={selectedNode?.id}
                />
              ) : (
                <PortfolioOverview
                  assets={assets}
                  yields={yields}
                  risks={risks}
                  onExecuteRebalance={handleExecuteRebalance}
                />
              )}
            </div>

            {/* Right Area (4 Cols) - AI Twin Concierge */}
            <div className="lg:col-span-4">
              <AiConcierge
                onOpenAspModal={() => setIsAspModalOpen(true)}
                onOpenX402Modal={() => setIsX402ModalOpen(true)}
              />
            </div>

          </div>
        )}

      </main>

      {/* Modals */}
      <AspRegisterModal
        isOpen={isAspModalOpen}
        onClose={() => setIsAspModalOpen(false)}
      />

      <X402PaymentModal
        isOpen={isX402ModalOpen}
        onClose={() => setIsX402ModalOpen(false)}
        onPaymentSuccess={() => setIsX402Unlocked(true)}
        isUnlocked={isX402Unlocked}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 bg-[#04070d] py-4 text-center text-xs text-slate-500 font-mono-num">
        Synapse Wealth — OKX.AI Genesis Hackathon ASP Submission • Powered by OnchainOS & AURA AI
      </footer>

    </div>
  );
}
