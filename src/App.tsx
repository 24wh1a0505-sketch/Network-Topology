import React, { useState } from 'react';
import { NetworkTopology, PerformanceStats } from './types/network';
import { SYLLABUS_4_ROUTER_TOPOLOGY } from './data/defaultTopology';
import { Navbar, ActiveModule } from './components/Navbar';
import { NetworkCanvas } from './components/NetworkCanvas';
import { TopologyModule } from './components/TopologyModule';
import { DijkstraModule } from './components/DijkstraModule';
import { DistanceVectorModule } from './components/DistanceVectorModule';
import { PacketSimulationModule } from './components/PacketSimulationModule';
import { LeakyBucketModule } from './components/LeakyBucketModule';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { JavaCodeViewer } from './components/JavaCodeViewer';
import { TechnologiesStackModule } from './components/TechnologiesStackModule';
import { ExportTopologyModal } from './components/ExportTopologyModal';
import { RunInstructionsModal } from './components/RunInstructionsModal';
import { WalkthroughGuide } from './components/WalkthroughGuide';
import { VivaVoceModal } from './components/VivaVoceModal';
import { PresentationModal } from './components/PresentationModal';
import { Network, Sparkles, ChevronUp, ChevronDown, Laptop } from 'lucide-react';

export default function App() {
  const [topology, setTopology] = useState<NetworkTopology>(SYLLABUS_4_ROUTER_TOPOLOGY);
  const [activeModule, setActiveModule] = useState<ActiveModule>('dijkstra');
  const [sourceNode, setSourceNode] = useState<string>('R1');
  const [destNode, setDestNode] = useState<string>('R4');

  // Canvas visualization highlights
  const [highlightedPath, setHighlightedPath] = useState<string[]>(['R1', 'R3', 'R4']);
  const [visitedNodes, setVisitedNodes] = useState<string[]>(['R1', 'R2', 'R3', 'R4']);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [activePacket, setActivePacket] = useState<{
    source: string;
    target: string;
    progress: number;
    packetId: number;
    status: 'in-flight' | 'delivered' | 'dropped';
  } | null>(null);

  // Performance stats (Canonical defaults from prompt: 100 sent, 94 delivered, 6 dropped)
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    packetsSent: 100,
    packetsDelivered: 94,
    packetsDropped: 6,
    packetLossRate: 6.0,
    averageDelayMs: 25,
    throughputPacketsPerSec: 94,
    throughputMbps: 1.13,
    jitterMs: 2.4,
  });

  // Modals state
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState<boolean>(false);
  const [isVivaOpen, setIsVivaOpen] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [isExportTopologyOpen, setIsExportTopologyOpen] = useState<boolean>(false);
  const [isRunInstructionsOpen, setIsRunInstructionsOpen] = useState<boolean>(false);
  const [isCanvasCollapsed, setIsCanvasCollapsed] = useState<boolean>(false);

  // Update node coordinates when dragged
  const handleUpdateNodePosition = (nodeId: string, x: number, y: number) => {
    setTopology((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.id === nodeId ? { ...node, x, y } : node
      ),
    }));
  };

  const handleResetToSyllabus = () => {
    setTopology(SYLLABUS_4_ROUTER_TOPOLOGY);
    setSourceNode('R1');
    setDestNode('R4');
    setHighlightedPath(['R1', 'R3', 'R4']);
  };

  const handleNodeClick = (nodeId: string) => {
    if (activeModule === 'dijkstra' || activeModule === 'packet-sim') {
      if (sourceNode === nodeId) return;
      if (destNode === nodeId) {
        setDestNode(sourceNode);
        setSourceNode(nodeId);
      } else {
        setDestNode(nodeId);
      }
    }
  };

  // Whether canvas should be prominently shown
  const showCanvas =
    activeModule !== 'java-code' &&
    activeModule !== 'leaky-bucket' &&
    activeModule !== 'technologies';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Global Navigation Bar */}
      <Navbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        onResetToSyllabus={handleResetToSyllabus}
        onOpenWalkthrough={() => setIsWalkthroughOpen(true)}
        onOpenViva={() => setIsVivaOpen(true)}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onOpenExportModal={() => setIsExportTopologyOpen(true)}
        onOpenRunInstructions={() => setIsRunInstructionsOpen(true)}
      />

      {/* 2. Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-5">
        {/* Interactive Network Topology Canvas (Shown for Graph & Simulation modules) */}
        {showCanvas && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Interactive Network Topology Canvas</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {topology.nodes.length} Routers • {topology.edges.length} Links
                </span>
              </div>

              <button
                onClick={() => setIsCanvasCollapsed(!isCanvasCollapsed)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                <span>{isCanvasCollapsed ? 'Expand Canvas' : 'Collapse Canvas'}</span>
                {isCanvasCollapsed ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {!isCanvasCollapsed && (
              <NetworkCanvas
                topology={topology}
                onUpdateNodePosition={handleUpdateNodePosition}
                highlightedPath={highlightedPath}
                sourceNodeId={sourceNode}
                destinationNodeId={destNode}
                visitedNodes={visitedNodes}
                currentNodeId={currentNodeId}
                activePacket={activePacket}
                onSelectNode={handleNodeClick}
              />
            )}
          </div>
        )}

        {/* 3. Active Module Views */}
        <div className="transition-all duration-300">
          {activeModule === 'topology' && (
            <TopologyModule
              topology={topology}
              onUpdateTopology={setTopology}
              onOpenExportModal={() => setIsExportTopologyOpen(true)}
              onSelectRouterForShortestPath={(id) => {
                setSourceNode(id);
                setActiveModule('dijkstra');
              }}
            />
          )}

          {activeModule === 'dijkstra' && (
            <DijkstraModule
              topology={topology}
              sourceNode={sourceNode}
              destNode={destNode}
              onSourceChange={setSourceNode}
              onDestChange={setDestNode}
              onHighlightPathChange={setHighlightedPath}
              onVisitedNodesChange={setVisitedNodes}
              onCurrentNodeChange={setCurrentNodeId}
            />
          )}

          {activeModule === 'distance-vector' && (
            <DistanceVectorModule topology={topology} />
          )}

          {activeModule === 'packet-sim' && (
            <PacketSimulationModule
              topology={topology}
              sourceNode={sourceNode}
              destNode={destNode}
              onActivePacketUpdate={setActivePacket}
              onUpdatePerformanceStats={setPerformanceStats}
            />
          )}

          {activeModule === 'leaky-bucket' && (
            <LeakyBucketModule />
          )}

          {activeModule === 'performance' && (
            <PerformanceDashboard
              stats={performanceStats}
              topology={topology}
              sourceNode={sourceNode}
              destNode={destNode}
              path={highlightedPath}
            />
          )}

          {activeModule === 'java-code' && (
            <JavaCodeViewer />
          )}

          {activeModule === 'technologies' && (
            <TechnologiesStackModule />
          )}
        </div>
      </main>

      {/* 4. Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-slate-400">Network Routing & Performance Analyzer</strong> • Computer Networks Lab External Examination Project
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>HTML • CSS • JS • XML • Java • NS-2 • Cisco</span>
            <button
              onClick={() => setIsRunInstructionsOpen(true)}
              className="text-emerald-400 hover:underline font-bold flex items-center gap-1"
            >
              <Laptop className="w-3 h-3" />
              <span>Run in VS Code Guide</span>
            </button>
            <button
              onClick={() => setIsExportTopologyOpen(true)}
              className="text-cyan-400 hover:underline font-bold"
            >
              Export Topology
            </button>
            <button
              onClick={() => setIsWalkthroughOpen(true)}
              className="text-indigo-400 hover:underline font-bold"
            >
              Start 8-Step Exam Walkthrough
            </button>
          </div>
        </div>
      </footer>

      {/* 5. Modals */}
      <RunInstructionsModal
        isOpen={isRunInstructionsOpen}
        onClose={() => setIsRunInstructionsOpen(false)}
      />

      <ExportTopologyModal
        isOpen={isExportTopologyOpen}
        onClose={() => setIsExportTopologyOpen(false)}
        topology={topology}
      />

      <WalkthroughGuide
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
        onNavigateModule={(mod) => {
          setActiveModule(mod);
          setIsCanvasCollapsed(false);
        }}
        onSetSourceAndDest={(src, dest) => {
          setSourceNode(src);
          setDestNode(dest);
        }}
      />

      <VivaVoceModal
        isOpen={isVivaOpen}
        onClose={() => setIsVivaOpen(false)}
      />

      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />
    </div>
  );
}
