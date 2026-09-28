import React, { useRef, useState, useEffect } from 'react';
import { NetworkNode, NetworkTopology } from '../types/network';
import { Router as RouterIcon, ZoomIn, ZoomOut, Maximize2, Move } from 'lucide-react';

interface NetworkCanvasProps {
  topology: NetworkTopology;
  onUpdateNodePosition: (nodeId: string, x: number, y: number) => void;
  highlightedPath?: string[];
  sourceNodeId?: string;
  destinationNodeId?: string;
  visitedNodes?: string[];
  currentNodeId?: string | null;
  activePacket?: {
    source: string;
    target: string;
    progress: number; // 0 to 1
    packetId: number;
    status: 'in-flight' | 'delivered' | 'dropped';
  } | null;
  onSelectNode?: (nodeId: string) => void;
  interactive?: boolean;
}

export const NetworkCanvas: React.FC<NetworkCanvasProps> = ({
  topology,
  onUpdateNodePosition,
  highlightedPath = [],
  sourceNodeId,
  destinationNodeId,
  visitedNodes = [],
  currentNodeId = null,
  activePacket = null,
  onSelectNode,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewOffset, setViewOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Check if an edge is part of the highlighted route path
  const isEdgeInPath = (u: string, v: string): boolean => {
    if (!highlightedPath || highlightedPath.length < 2) return false;
    for (let i = 0; i < highlightedPath.length - 1; i++) {
      const from = highlightedPath[i];
      const to = highlightedPath[i + 1];
      if ((from === u && to === v) || (from === v && to === u)) {
        return true;
      }
    }
    return false;
  };

  // Node position map
  const nodeMap = new Map<string, NetworkNode>();
  topology.nodes.forEach((n) => nodeMap.set(n.id, n));

  // Dragging handler
  const handleMouseDownNode = (e: React.MouseEvent, nodeId: string) => {
    if (!interactive) return;
    e.stopPropagation();
    const node = nodeMap.get(nodeId);
    if (!node) return;

    setDraggingNode(nodeId);
    setDragOffset({
      x: e.clientX - node.x * zoomLevel - viewOffset.x,
      y: e.clientY - node.y * zoomLevel - viewOffset.y,
    });
  };

  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewOffset.x, y: e.clientY - viewOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNode) {
      const newX = (e.clientX - dragOffset.x - viewOffset.x) / zoomLevel;
      const newY = (e.clientY - dragOffset.y - viewOffset.y) / zoomLevel;
      onUpdateNodePosition(draggingNode, Math.max(30, Math.min(650, newX)), Math.max(30, Math.min(450, newY)));
    } else if (isPanning) {
      setViewOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
    setIsPanning(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDraggingNode(null);
      setIsPanning(false);
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Calculate packet interpolated position
  const getPacketCoords = () => {
    if (!activePacket) return null;
    const srcNode = nodeMap.get(activePacket.source);
    const dstNode = nodeMap.get(activePacket.target);
    if (!srcNode || !dstNode) return null;

    const px = srcNode.x + (dstNode.x - srcNode.x) * activePacket.progress;
    const py = srcNode.y + (dstNode.y - srcNode.y) * activePacket.progress;
    return { x: px, y: py };
  };

  const packetCoords = getPacketCoords();

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDownCanvas}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative w-full h-[460px] bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden select-none cursor-grab active:cursor-grabbing shadow-inner"
    >
      {/* Grid Background Pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <pattern id="grid-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#38bdf8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      {/* Canvas Viewport Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/70 shadow-lg">
        <button
          onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.1))}
          className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
          className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setZoomLevel(1);
            setViewOffset({ x: 0, y: 0 });
          }}
          className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Reset View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Legend & Instructions */}
      <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/40"></span>
          <span>Source</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 ring-2 ring-purple-500/40"></span>
          <span>Destination</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-1 bg-cyan-400 rounded"></span>
          <span>Optimal Route</span>
        </div>
        <div className="flex items-center gap-1">
          <Move className="w-3 h-3 text-slate-500" />
          <span>Drag routers to move</span>
        </div>
      </div>

      {/* Main SVG Graph Layer */}
      <svg
        className="w-full h-full"
        style={{
          transform: `translate(${viewOffset.x}px, ${viewOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: '0 0',
        }}
      >
        <defs>
          {/* Animated Glow for Shortest Path */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Links / Edges */}
        {topology.edges.map((edge) => {
          const u = nodeMap.get(edge.source);
          const v = nodeMap.get(edge.destination);
          if (!u || !v) return null;

          const isOptimal = isEdgeInPath(edge.source, edge.destination);
          const midX = (u.x + v.x) / 2;
          const midY = (u.y + v.y) / 2;

          return (
            <g key={edge.id} className="transition-all duration-300">
              {/* Outer Glow if part of optimal route */}
              {isOptimal && (
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke="#06b6d4"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.4"
                  filter="url(#glow)"
                />
              )}

              {/* Base link line */}
              <line
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke={isOptimal ? '#22d3ee' : '#334155'}
                strokeWidth={isOptimal ? '3.5' : '2'}
                strokeDasharray={isOptimal ? 'none' : '4 4'}
                strokeLinecap="round"
                className="transition-colors duration-300"
              />

              {/* Edge Metric Cost Badge */}
              <g transform={`translate(${midX}, ${midY})`}>
                <rect
                  x="-16"
                  y="-11"
                  width="32"
                  height="22"
                  rx="6"
                  className={
                    isOptimal
                      ? 'fill-cyan-950 stroke-cyan-400 stroke-[1.5]'
                      : 'fill-slate-900 stroke-slate-700 stroke-[1]'
                  }
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  className={`text-[11px] font-mono font-bold select-none ${
                    isOptimal ? 'fill-cyan-300' : 'fill-slate-300'
                  }`}
                >
                  {edge.cost}
                </text>
              </g>
            </g>
          );
        })}

        {/* 2. Active In-flight Packet Simulation Marker */}
        {packetCoords && activePacket && (
          <g transform={`translate(${packetCoords.x}, ${packetCoords.y})`}>
            <circle
              r="12"
              className={
                activePacket.status === 'dropped'
                  ? 'fill-rose-500/80 animate-ping'
                  : 'fill-cyan-400/80 animate-pulse'
              }
            />
            <circle
              r="8"
              className={
                activePacket.status === 'dropped'
                  ? 'fill-rose-600 stroke-white stroke-[2]'
                  : 'fill-cyan-400 stroke-white stroke-[2]'
              }
            />
            <text
              y="-14"
              textAnchor="middle"
              className="text-[9px] font-mono font-bold fill-white drop-shadow-md"
            >
              P#{activePacket.packetId}
            </text>
          </g>
        )}

        {/* 3. Routers / Nodes */}
        {topology.nodes.map((node) => {
          const isSource = node.id === sourceNodeId;
          const isDestination = node.id === destinationNodeId;
          const isCurrent = node.id === currentNodeId;
          const isVisited = visitedNodes.includes(node.id);
          const inPath = highlightedPath.includes(node.id);

          let nodeColor = 'bg-slate-900 border-slate-700 text-slate-300';
          let ringColor = '';

          if (isSource) {
            nodeColor = 'bg-emerald-950 border-emerald-400 text-emerald-200';
            ringColor = 'ring-4 ring-emerald-500/40';
          } else if (isDestination) {
            nodeColor = 'bg-purple-950 border-purple-400 text-purple-200';
            ringColor = 'ring-4 ring-purple-500/40';
          } else if (isCurrent) {
            nodeColor = 'bg-amber-950 border-amber-400 text-amber-200 animate-pulse';
            ringColor = 'ring-4 ring-amber-500/40';
          } else if (inPath) {
            nodeColor = 'bg-cyan-950 border-cyan-400 text-cyan-200';
            ringColor = 'ring-2 ring-cyan-500/40';
          } else if (isVisited) {
            nodeColor = 'bg-slate-800 border-slate-600 text-slate-400';
          }

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              onMouseDown={(e) => handleMouseDownNode(e, node.id)}
              onClick={() => onSelectNode && onSelectNode(node.id)}
              className="cursor-pointer group"
            >
              {/* Outer decorative halo */}
              <circle
                r="30"
                className={`transition-all duration-300 ${
                  isSource
                    ? 'fill-emerald-500/15'
                    : isDestination
                    ? 'fill-purple-500/15'
                    : inPath
                    ? 'fill-cyan-500/15'
                    : 'fill-transparent group-hover:fill-slate-800/40'
                }`}
              />

              {/* Main Node Circle */}
              <circle
                r="22"
                className={`transition-all duration-200 stroke-2 ${
                  isSource
                    ? 'fill-slate-950 stroke-emerald-400 filter drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                    : isDestination
                    ? 'fill-slate-950 stroke-purple-400 filter drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]'
                    : isCurrent
                    ? 'fill-slate-950 stroke-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                    : inPath
                    ? 'fill-slate-950 stroke-cyan-400 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                    : 'fill-slate-900 stroke-slate-700 group-hover:stroke-slate-500'
                }`}
              />

              {/* Router Icon inside */}
              <foreignObject x="-10" y="-14" width="20" height="20" className="pointer-events-none">
                <div className="flex items-center justify-center text-slate-300">
                  <RouterIcon
                    className={`w-4 h-4 ${
                      isSource
                        ? 'text-emerald-400'
                        : isDestination
                        ? 'text-purple-400'
                        : inPath
                        ? 'text-cyan-400'
                        : 'text-slate-400'
                    }`}
                  />
                </div>
              </foreignObject>

              {/* Router ID Text */}
              <text
                x="0"
                y="12"
                textAnchor="middle"
                className="text-[11px] font-mono font-bold fill-white select-none pointer-events-none"
              >
                {node.id}
              </text>

              {/* Router Name Label */}
              <text
                x="0"
                y="36"
                textAnchor="middle"
                className="text-[11px] font-medium fill-slate-300 select-none pointer-events-none drop-shadow"
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
