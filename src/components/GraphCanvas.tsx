import React, { useState, useMemo, useRef, useEffect } from 'react';
import { GraphNode, GraphEdge } from '../types/index.js';
import { 
  ShieldAlert, TrendingUp, Wallet, Layers, Cpu, CheckCircle2, Zap, Radio, 
  ZoomIn, ZoomOut, RotateCcw, Move, Sparkles, Activity, ArrowUpRight, X, ExternalLink
} from 'lucide-react';

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectNode: (node: GraphNode) => void;
  selectedNodeId?: string;
}

interface PosNode extends GraphNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({ nodes, edges, onSelectNode, selectedNodeId }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [isPhysicsEnabled, setIsPhysicsEnabled] = useState<boolean>(true);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [inspectedNode, setInspectedNode] = useState<GraphNode | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Initialize Base Node Positions (3-Tier Orbital System, scaled to fit inside 900x520 canvas)
  const baseNodes = useMemo<PosNode[]>(() => {
    if (nodes.length === 0) return [];

    const centerX = 450;
    const centerY = 260;

    const walletNodes = nodes.filter(n => n.type === 'wallet');
    const assetNodes = nodes.filter(n => n.type === 'asset');
    const protocolYieldNodes = nodes.filter(n => n.type === 'protocol' || n.type === 'yield' || n.type === 'risk');

    return nodes.map(node => {
      let x = centerX;
      let y = centerY;

      if (node.type === 'wallet') {
        x = centerX;
        y = centerY;
      } else if (node.type === 'asset') {
        const index = assetNodes.findIndex(n => n.id === node.id);
        const radius = 115;
        // Distribute evenly around inner orbit
        const angle = (index / Math.max(assetNodes.length, 1)) * 2 * Math.PI - Math.PI / 2;
        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle);
      } else {
        const index = protocolYieldNodes.findIndex(n => n.id === node.id);
        const radius = 185;
        // Distribute evenly around outer orbit
        const angle = (index / Math.max(protocolYieldNodes.length, 1)) * 2 * Math.PI - Math.PI / 4;
        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle);
      }

      return { ...node, x, y, baseX: x, baseY: y };
    });
  }, [nodes]);

  // Sync positions state when baseNodes change
  useEffect(() => {
    const initialPos: Record<string, { x: number; y: number }> = {};
    baseNodes.forEach(n => {
      initialPos[n.id] = { x: n.baseX, y: n.baseY };
    });
    setNodePositions(initialPos);
  }, [baseNodes]);

  // Floating Physics Motion Effect
  useEffect(() => {
    if (!isPhysicsEnabled) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    let frameId: number;
    const animate = () => {
      timeRef.current += 0.02;
      const t = timeRef.current;

      setNodePositions(prev => {
        const next = { ...prev };
        baseNodes.forEach((node, idx) => {
          if (draggedNodeId === node.id) return; // Don't float dragged node
          if (node.type === 'wallet') return; // Wallet stays centered

          const offsetX = Math.sin(t + idx * 1.5) * 6;
          const offsetY = Math.cos(t * 0.8 + idx * 2.0) * 6;
          next[node.id] = {
            x: node.baseX + offsetX,
            y: node.baseY + offsetY
          };
        });
        return next;
      });

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isPhysicsEnabled, baseNodes, draggedNodeId]);

  // Mouse Dragging Logic for Nodes
  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggedNodeId(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNodeId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / zoom;
    const rawY = (e.clientY - rect.top) / zoom;

    // Constrain within canvas bounds
    const clampedX = Math.max(70, Math.min(830, rawX));
    const clampedY = Math.max(50, Math.min(470, rawY));

    setNodePositions(prev => ({
      ...prev,
      [draggedNodeId]: { x: clampedX, y: clampedY }
    }));
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  // Connected Nodes Mapping
  const activeNodeId = hoveredNodeId || selectedNodeId;
  const connectedNodeIds = useMemo(() => {
    if (!activeNodeId) return new Set<string>();
    const set = new Set<string>([activeNodeId]);
    edges.forEach(e => {
      if (e.source === activeNodeId) set.add(e.target);
      if (e.target === activeNodeId) set.add(e.source);
    });
    return set;
  }, [activeNodeId, edges]);

  const filteredNodes = useMemo(() => {
    return baseNodes.filter(n => filterType === 'all' || n.type === filterType);
  }, [baseNodes, filterType]);

  const getNodeStyle = (type: string) => {
    switch (type) {
      case 'wallet': return 'from-cyan-500/90 to-blue-600/90 border-cyan-400 text-cyan-200 shadow-cyan-500/40 ring-cyan-400';
      case 'asset': return 'from-slate-800/90 to-slate-900/90 border-slate-600 text-slate-200 shadow-slate-700/30 ring-slate-400';
      case 'protocol': return 'from-indigo-600/90 to-purple-700/90 border-indigo-400 text-indigo-200 shadow-indigo-500/40 ring-indigo-400';
      case 'yield': return 'from-emerald-600/90 to-teal-700/90 border-emerald-400 text-emerald-200 shadow-emerald-500/40 ring-emerald-400';
      case 'risk': return 'from-rose-600/90 to-amber-700/90 border-rose-400 text-rose-200 shadow-rose-500/40 ring-rose-400';
      default: return 'from-slate-800/90 to-slate-900/90 border-slate-700 text-slate-300 ring-slate-500';
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'wallet': return <Wallet className="h-4 w-4 text-cyan-200" />;
      case 'asset': return <Layers className="h-4 w-4 text-slate-200" />;
      case 'protocol': return <Cpu className="h-4 w-4 text-indigo-200" />;
      case 'yield': return <TrendingUp className="h-4 w-4 text-emerald-200" />;
      case 'risk': return <ShieldAlert className="h-4 w-4 text-rose-200" />;
      default: return <CheckCircle2 className="h-4 w-4 text-slate-200" />;
    }
  };

  const getEdgeColor = (type?: string, isHighlighted?: boolean) => {
    if (isHighlighted) return '#38bdf8'; // Bright Cyan-Sky
    switch (type) {
      case 'yield_route': return '#10b981'; // Emerald Green
      case 'staking': return '#a855f7'; // Purple
      case 'risk_flag': return '#f43f5e'; // Rose Red
      default: return '#475569'; // Slate Blue
    }
  };

  const resetCanvas = () => {
    setZoom(1);
    setFilterType('all');
    setHoveredNodeId(null);
    const resetPos: Record<string, { x: number; y: number }> = {};
    baseNodes.forEach(n => {
      resetPos[n.id] = { x: n.baseX, y: n.baseY };
    });
    setNodePositions(resetPos);
  };

  return (
    <div className="relative flex h-[620px] w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#050811] p-4 shadow-2xl">
      
      {/* Professional Toolbar Header */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
          </div>
          <span className="font-heading text-sm font-bold tracking-wide text-slate-100 flex items-center gap-1.5">
            DYNAMIC KNOWLEDGE GRAPH
            <span className="rounded-md bg-cyan-950 px-2 py-0.5 text-[10px] font-mono-num font-semibold text-cyan-300 border border-cyan-800/60">
              2D Neural Topology
            </span>
          </span>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex items-center gap-2">
          
          {/* Zoom & Reset Toolbar */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setZoom(z => Math.min(1.4, z + 0.1))}
              title="Zoom In"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoom(z => Math.max(0.7, z - 0.1))}
              title="Zoom Out"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={resetCanvas}
              title="Reset View"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setIsPhysicsEnabled(!isPhysicsEnabled)}
              title="Toggle Physics Motion"
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition ${
                isPhysicsEnabled ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="h-3 w-3" />
              <span>Float</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-950 p-1 border border-slate-800">
            {['all', 'wallet', 'asset', 'protocol', 'yield', 'risk'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize transition ${
                  filterType === type
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Interactive 2D Graph Canvas Container */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative flex-1 w-full h-full overflow-hidden select-none"
      >
        {/* Background Grid Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:26px_26px] opacity-30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06)_0%,transparent_65%)]"></div>

        {/* Scalable Container Box */}
        <div 
          className="relative w-full h-full origin-center transition-transform duration-100 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* SVG Vector Beams Layer */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 900 520">
            <defs>
              <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Render Connecting Lines & Edge Beams */}
            {edges.map(edge => {
              const srcPos = nodePositions[edge.source] || { x: 450, y: 260 };
              const tgtPos = nodePositions[edge.target] || { x: 450, y: 260 };

            const isHighlighted = Boolean(activeNodeId && (edge.source === activeNodeId || edge.target === activeNodeId));
            const isDimmed = Boolean(activeNodeId && !isHighlighted);

              // Quadratic Curved Path
              const midX = (srcPos.x + tgtPos.x) / 2;
              const midY = (srcPos.y + tgtPos.y) / 2 - (edge.source === 'wallet_main' ? 0 : 25);
              const pathD = `M ${srcPos.x} ${srcPos.y} Q ${midX} ${midY} ${tgtPos.x} ${tgtPos.y}`;

              return (
                <g key={edge.id} className="transition-all duration-300">
                  {/* Base Beam Line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={getEdgeColor(edge.type, isHighlighted)}
                    strokeWidth={isHighlighted ? 3 : 1.8}
                    strokeOpacity={isDimmed ? 0.08 : isHighlighted ? 0.95 : 0.4}
                    strokeDasharray={edge.type === 'yield_route' || edge.type === 'risk_flag' ? '6 4' : 'none'}
                    filter={isHighlighted ? 'url(#laserGlow)' : undefined}
                  />

                  {/* Flowing Laser Particle Effect */}
                  {(isHighlighted || edge.type === 'yield_route') && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke={edge.type === 'yield_route' ? '#10b981' : '#38bdf8'}
                      strokeWidth={2.5}
                      strokeDasharray="4 10"
                      className="animate-[dash_12s_linear_infinite]"
                    />
                  )}

                  {/* Edge Text Label */}
                  {edge.label && isHighlighted && (
                    <text
                      x={midX}
                      y={midY - 8}
                      fill="#e2e8f0"
                      fontSize="10"
                      fontWeight="600"
                      textAnchor="middle"
                      className="drop-shadow-md font-mono-num"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Node Cards */}
          <div className="relative w-full h-full pointer-events-auto">
            {filteredNodes.map(node => {
              const pos = nodePositions[node.id] || { x: node.baseX, y: node.baseY };
              const isSelected = Boolean(selectedNodeId === node.id || inspectedNode?.id === node.id);
              const isHovered = Boolean(hoveredNodeId === node.id);
              const isConnected = Boolean(activeNodeId ? connectedNodeIds.has(node.id) : true);
              const isDimmed = Boolean(activeNodeId ? !isConnected : false);

              // Convert canvas coords to percentage for exact placement
              const leftPct = (pos.x / 900) * 100;
              const topPct = (pos.y / 520) * 100;

              return (
                <div
                  key={node.id}
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                  onMouseDown={(e) => handleMouseDown(node.id, e)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => {
                    setInspectedNode(node);
                    onSelectNode(node);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing transition-opacity duration-300 z-20 ${
                    isDimmed ? 'opacity-25 scale-90 blur-[0.5px]' : 'opacity-100 scale-100'
                  }`}
                >
                  <div
                    className={`group relative flex items-center gap-3 rounded-2xl border px-4 py-3 backdrop-blur-xl shadow-2xl transition-all duration-300 bg-gradient-to-br ${getNodeStyle(
                      node.type
                    )} ${
                      isSelected || isHovered
                        ? 'scale-110 ring-2 ring-offset-2 ring-offset-slate-950 shadow-2xl z-30'
                        : 'hover:scale-105'
                    }`}
                  >
                    {/* Node Icon Avatar */}
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950/70 shadow-inner border border-white/10">
                      {getNodeIcon(node.type)}
                      {node.riskLevel === 'high' && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                        </span>
                      )}
                    </div>

                    {/* Node Data Details */}
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading text-xs font-bold text-white group-hover:text-cyan-200 transition">
                          {node.label}
                        </span>
                        {node.chain && (
                          <span className="rounded bg-black/40 px-1.5 py-0.2 text-[9px] font-semibold text-cyan-300 uppercase tracking-wider">
                            {node.chain}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] mt-0.5">
                        <span className="font-mono-num font-bold text-slate-100">
                          ${Math.round(node.val).toLocaleString()}
                        </span>
                        {node.apy && (
                          <span className="flex items-center gap-0.5 font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/60">
                            <Zap className="h-2.5 w-2.5 fill-emerald-400" />
                            +{node.apy}% APY
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Node Inspector Drawer Modal (Bottom Sheet overlay when a node is clicked) */}
      {inspectedNode && (
        <div className="absolute bottom-12 left-4 right-4 z-30 flex items-center justify-between rounded-xl border border-cyan-500/40 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {getNodeIcon(inspectedNode.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading text-sm font-bold text-white">{inspectedNode.label}</h4>
                <span className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-semibold uppercase text-cyan-300 border border-cyan-800/60">
                  {inspectedNode.type}
                </span>
                {inspectedNode.chain && (
                  <span className="text-xs text-slate-400">({inspectedNode.chain})</span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Valuation: <strong className="text-cyan-300 font-mono-num">${inspectedNode.val.toLocaleString()}</strong>
                {inspectedNode.apy && ` • Expected Yield: +${inspectedNode.apy}% APY`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectNode(inspectedNode)}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ask AURA AI Audit</span>
            </button>
            <button
              onClick={() => setInspectedNode(null)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer Guidance Bar */}
      <div className="z-10 flex items-center justify-between border-t border-white/10 pt-2.5 text-xs text-slate-400 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Click & Drag nodes • Hover to trace laser edge beams • Click node for AI Audit</span>
        </div>
        <span className="font-mono-num font-semibold text-cyan-400">OnchainOS Graph Engine Online</span>
      </div>

    </div>
  );
};
