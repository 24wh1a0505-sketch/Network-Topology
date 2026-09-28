import React, { useState } from 'react';
import { NetworkTopology, NetworkNode, NetworkEdge } from '../types/network';
import { topologyToXml, xmlToTopology, SYLLABUS_4_ROUTER_TOPOLOGY, ENTERPRISE_6_ROUTER_TOPOLOGY, RING_5_ROUTER_TOPOLOGY } from '../data/defaultTopology';
import { generateAllTopologyExports } from '../data/topologyExports';
import { ExportTopologyModal } from './ExportTopologyModal';
import {
  FileCode,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  RefreshCw,
  Layers,
  Table,
  Sparkles,
  AlertCircle,
  Share2,
  Terminal,
  FileSpreadsheet,
  FileJson,
} from 'lucide-react';

interface TopologyModuleProps {
  topology: NetworkTopology;
  onUpdateTopology: (topology: NetworkTopology) => void;
  onSelectRouterForShortestPath?: (nodeId: string) => void;
  onOpenExportModal?: () => void;
}

export const TopologyModule: React.FC<TopologyModuleProps> = ({
  topology,
  onUpdateTopology,
  onOpenExportModal,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'xml' | 'matrix' | 'exports'>('editor');
  const [xmlContent, setXmlContent] = useState<string>(() => topologyToXml(topology));
  const [xmlError, setXmlError] = useState<string | null>(null);
  const [copiedXml, setCopiedXml] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Add router state
  const [newRouterId, setNewRouterId] = useState<string>('');
  const [newRouterName, setNewRouterName] = useState<string>('');

  // Add edge state
  const [edgeSource, setEdgeSource] = useState<string>(topology.nodes[0]?.id || '');
  const [edgeDest, setEdgeDest] = useState<string>(topology.nodes[1]?.id || '');
  const [edgeCost, setEdgeCost] = useState<number>(3);
  const [edgeBandwidth, setEdgeBandwidth] = useState<number>(100);

  // Sync XML whenever activeTab switches to XML
  const handleTabChange = (tab: 'editor' | 'xml' | 'matrix' | 'exports') => {
    setActiveTab(tab);
    if (tab === 'xml') {
      setXmlContent(topologyToXml(topology));
      setXmlError(null);
    }
  };

  // Add new router
  const handleAddRouter = (e: React.FormEvent) => {
    e.preventDefault();
    const id = newRouterId.trim().toUpperCase();
    if (!id) return;
    if (topology.nodes.some((n) => n.id === id)) {
      alert(`Router ID "${id}" already exists.`);
      return;
    }

    const newNode: NetworkNode = {
      id,
      name: newRouterName.trim() || `Router ${id}`,
      x: 100 + Math.random() * 400,
      y: 100 + Math.random() * 250,
    };

    const updated = {
      ...topology,
      nodes: [...topology.nodes, newNode],
    };
    onUpdateTopology(updated);
    setNewRouterId('');
    setNewRouterName('');
  };

  // Delete router
  const handleDeleteRouter = (nodeId: string) => {
    if (topology.nodes.length <= 2) {
      alert('Network must have at least 2 routers.');
      return;
    }
    const updatedNodes = topology.nodes.filter((n) => n.id !== nodeId);
    const updatedEdges = topology.edges.filter(
      (e) => e.source !== nodeId && e.destination !== nodeId
    );
    onUpdateTopology({ nodes: updatedNodes, edges: updatedEdges });
  };

  // Add new edge
  const handleAddEdge = (e: React.FormEvent) => {
    e.preventDefault();
    if (edgeSource === edgeDest) {
      alert('Source and destination cannot be the same router.');
      return;
    }

    // Check if edge already exists
    const exists = topology.edges.some(
      (edge) =>
        (edge.source === edgeSource && edge.destination === edgeDest) ||
        (edge.source === edgeDest && edge.destination === edgeSource)
    );

    if (exists) {
      // Update cost of existing edge
      const updatedEdges = topology.edges.map((edge) => {
        if (
          (edge.source === edgeSource && edge.destination === edgeDest) ||
          (edge.source === edgeDest && edge.destination === edgeSource)
        ) {
          return { ...edge, cost: Math.max(1, edgeCost), bandwidthMbps: edgeBandwidth };
        }
        return edge;
      });
      onUpdateTopology({ ...topology, edges: updatedEdges });
      return;
    }

    const newEdge: NetworkEdge = {
      id: `e-${edgeSource.toLowerCase()}-${edgeDest.toLowerCase()}-${Date.now()}`,
      source: edgeSource,
      destination: edgeDest,
      cost: Math.max(1, edgeCost),
      bandwidthMbps: edgeBandwidth,
      delayMs: edgeCost * 4,
    };

    onUpdateTopology({
      ...topology,
      edges: [...topology.edges, newEdge],
    });
  };

  // Delete edge
  const handleDeleteEdge = (edgeId: string) => {
    onUpdateTopology({
      ...topology,
      edges: topology.edges.filter((e) => e.id !== edgeId),
    });
  };

  // Apply XML edits
  const handleApplyXml = () => {
    const { topology: parsed, error } = xmlToTopology(xmlContent);
    if (error) {
      setXmlError(error);
    } else if (parsed) {
      setXmlError(null);
      onUpdateTopology(parsed);
    }
  };

  // Download XML file
  const handleDownloadXml = () => {
    const xml = topologyToXml(topology);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'network.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy XML to clipboard
  const handleCopyXml = () => {
    const xml = topologyToXml(topology);
    navigator.clipboard.writeText(xml);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2000);
  };

  // Build Cost Matrix for display
  const nodeIds = topology.nodes.map((n) => n.id);
  const matrix: Record<string, Record<string, number | string>> = {};
  nodeIds.forEach((u) => {
    matrix[u] = {};
    nodeIds.forEach((v) => {
      matrix[u][v] = u === v ? 0 : '∞';
    });
  });

  topology.edges.forEach((e) => {
    if (matrix[e.source] && matrix[e.destination]) {
      matrix[e.source][e.destination] = e.cost;
      matrix[e.destination][e.source] = e.cost;
    }
  });

  return (
    <div className="space-y-4">
      {/* Module Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Module 1: Network Topology & XML Architecture</span>
          </h2>
          <p className="text-xs text-slate-400">
            Define network routers, cost metrics, and synchronize directly with standard XML configuration.
          </p>
        </div>

        {/* Preset Selector & Export Button */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Presets:</span>
            <button
              onClick={() => onUpdateTopology(SYLLABUS_4_ROUTER_TOPOLOGY)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-700/60 hover:bg-cyan-900 transition-colors"
            >
              Syllabus (R1-R4)
            </button>
            <button
              onClick={() => onUpdateTopology(ENTERPRISE_6_ROUTER_TOPOLOGY)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              6-Router Mesh
            </button>
            <button
              onClick={() => onUpdateTopology(RING_5_ROUTER_TOPOLOGY)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              5-Node Ring
            </button>
          </div>

          <button
            onClick={() => {
              if (onOpenExportModal) {
                onOpenExportModal();
              } else {
                setIsExportModalOpen(true);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-md shadow-cyan-950 transition-all shrink-0 active:scale-95"
            title="Export Topology to XML, JSON, CSV, Graphviz DOT, NS-2 TCL, or Cisco IOS"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Topology</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher: Topology Editor, XML Config, Adjacency Matrix, Export Formats */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleTabChange('editor')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'editor'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Nodes & Connections</span>
        </button>
        <button
          onClick={() => handleTabChange('xml')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'xml'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
          <span>XML Topology Storage</span>
        </button>
        <button
          onClick={() => handleTabChange('matrix')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'matrix'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table className="w-3.5 h-3.5 text-emerald-400" />
          <span>Adjacency Cost Matrix</span>
        </button>
        <button
          onClick={() => handleTabChange('exports')}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'exports'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Export Formats & Scripts</span>
        </button>
      </div>

      {/* TAB 1: NODES & CONNECTIONS EDITOR */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Add Router Card */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>Add Router Node</span>
            </h3>
            <form onSubmit={handleAddRouter} className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Router ID</label>
                <input
                  type="text"
                  placeholder="e.g. R5"
                  value={newRouterId}
                  onChange={(e) => setNewRouterId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white uppercase focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Label / Name</label>
                <input
                  type="text"
                  placeholder="e.g. Router 5"
                  value={newRouterName}
                  onChange={(e) => setNewRouterName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full mt-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium border border-slate-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Insert Router</span>
                </button>
              </div>
            </form>

            {/* Existing Routers List */}
            <div className="pt-2 border-t border-slate-800">
              <div className="text-[11px] text-slate-400 font-medium mb-1.5">
                Active Routers ({topology.nodes.length}):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {topology.nodes.map((node) => (
                  <div
                    key={node.id}
                    className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2 py-1 rounded-md text-xs text-slate-300"
                  >
                    <span className="font-mono font-bold text-cyan-400">{node.id}</span>
                    <button
                      onClick={() => handleDeleteRouter(node.id)}
                      className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                      title={`Remove router ${node.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add / Edit Connection Card */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Connect / Update Link Cost</span>
            </h3>
            <form onSubmit={handleAddEdge} className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Source Node</label>
                <select
                  value={edgeSource}
                  onChange={(e) => setEdgeSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {topology.nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.id} ({n.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Destination Node</label>
                <select
                  value={edgeDest}
                  onChange={(e) => setEdgeDest(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {topology.nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.id} ({n.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Metric Cost / Weight
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={edgeCost}
                  onChange={(e) => setEdgeCost(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Bandwidth</label>
                <select
                  value={edgeBandwidth}
                  onChange={(e) => setEdgeBandwidth(parseInt(e.target.value) || 100)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value={10}>10 Mbps</option>
                  <option value={100}>100 Mbps (Fast Ethernet)</option>
                  <option value={1000}>1000 Mbps (Gigabit)</option>
                </select>
              </div>

              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full mt-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 rounded-lg text-xs font-semibold border border-emerald-700/60 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Set / Update Link</span>
                </button>
              </div>
            </form>

            {/* Connections Table summary */}
            <div className="pt-2 border-t border-slate-800 max-h-32 overflow-y-auto pr-1">
              <div className="text-[11px] text-slate-400 font-medium mb-1">
                Active Connections ({topology.edges.length}):
              </div>
              <div className="space-y-1">
                {topology.edges.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between bg-slate-950 px-2 py-1 rounded text-xs text-slate-300 border border-slate-800/80"
                  >
                    <span className="font-mono">
                      <span className="text-cyan-400 font-bold">{e.source}</span>
                      <span className="text-slate-500 mx-1.5">⟷</span>
                      <span className="text-cyan-400 font-bold">{e.destination}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                        Cost: {e.cost}
                      </span>
                      <button
                        onClick={() => handleDeleteEdge(e.id)}
                        className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: XML CONFIGURATION EDITOR */}
      {activeTab === 'xml' && (
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span>XML Topology Definition (data/network.xml)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                You can directly edit this XML and click &quot;Apply XML&quot; to update the live graph!
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyXml}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
              >
                {copiedXml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedXml ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownloadXml}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .xml</span>
              </button>
              <button
                onClick={handleApplyXml}
                className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Apply XML</span>
              </button>
            </div>
          </div>

          {xmlError && (
            <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{xmlError}</span>
            </div>
          )}

          <textarea
            value={xmlContent}
            onChange={(e) => setXmlContent(e.target.value)}
            rows={14}
            className="w-full bg-slate-950 font-mono text-xs text-emerald-400 p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed selection:bg-indigo-600 selection:text-white"
            spellCheck={false}
          />
        </div>
      )}

      {/* TAB 3: ADJACENCY COST MATRIX */}
      {activeTab === 'matrix' && (
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Table className="w-3.5 h-3.5 text-emerald-400" />
              <span>Network Adjacency Matrix (C[i][j])</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              0 = Self, ∞ = No direct link
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse border border-slate-800 text-xs font-mono">
              <thead>
                <tr className="bg-slate-950">
                  <th className="p-2 border border-slate-800 text-slate-400">Router</th>
                  {nodeIds.map((id) => (
                    <th key={id} className="p-2 border border-slate-800 text-cyan-400 font-bold">
                      {id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {nodeIds.map((u) => (
                  <tr key={u} className="hover:bg-slate-900/80">
                    <td className="p-2 border border-slate-800 font-bold text-cyan-400 bg-slate-950/60">
                      {u}
                    </td>
                    {nodeIds.map((v) => {
                      const cost = matrix[u][v];
                      const isZero = cost === 0;
                      const isInf = cost === '∞';
                      return (
                        <td
                          key={v}
                          className={`p-2 border border-slate-800 ${
                            isZero
                              ? 'text-slate-500'
                              : isInf
                              ? 'text-slate-600'
                              : 'text-amber-400 font-bold bg-amber-950/20'
                          }`}
                        >
                          {cost}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: EXPORT FORMATS & SCRIPTS */}
      {activeTab === 'exports' && (
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Multi-Format Topology Exporter & Network Simulator Scripts</span>
              </h3>
              <p className="text-xs text-slate-400">
                Generate and download topology configurations for XML, JSON, CSV, NS-2 TCL, Graphviz DOT, and Cisco IOS.
              </p>
            </div>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-cyan-950 transition-all shrink-0 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Open Export Center</span>
            </button>
          </div>

          {/* Cards for each format */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* 1. XML */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    <span>XML Topology</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                    network.xml
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Canonical CN Lab XML format storing router nodes, IDs, coordinates, and link metrics without databases.
                </p>
              </div>
              <button
                onClick={() => {
                  const exports = generateAllTopologyExports(topology);
                  const blob = new Blob([exports.xml], { type: 'application/xml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'network.xml';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="mt-2 w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded-lg text-xs font-medium border border-slate-700/80 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .xml</span>
              </button>
            </div>

            {/* 2. JSON */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <FileJson className="w-4 h-4 text-amber-400" />
                    <span>JSON Schema</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
                    topology.json
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Structured JavaScript object notation with nodes, coordinates, bandwidth, and edge cost weights.
                </p>
              </div>
              <button
                onClick={() => {
                  const exports = generateAllTopologyExports(topology);
                  const blob = new Blob([exports.json], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'network-topology.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="mt-2 w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-lg text-xs font-medium border border-slate-700/80 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .json</span>
              </button>
            </div>

            {/* 3. CSV Adjacency Matrix */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Adjacency CSV</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                    matrix.csv
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Adjacency cost matrix C[i][j] in CSV format ready for Excel, MATLAB, and lab manual reports.
                </p>
              </div>
              <button
                onClick={() => {
                  const exports = generateAllTopologyExports(topology);
                  const blob = new Blob([exports.adjacencyMatrixCsv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'adjacency-matrix.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="mt-2 w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 rounded-lg text-xs font-medium border border-slate-700/80 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .csv</span>
              </button>
            </div>

            {/* 4. Graphviz DOT */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-cyan-400" />
                    <span>Graphviz (DOT)</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                    topology.dot
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Graphviz syntax for high-resolution vector diagrams used in research papers and PowerPoint slides.
                </p>
              </div>
              <button
                onClick={() => {
                  const exports = generateAllTopologyExports(topology);
                  const blob = new Blob([exports.graphvizDot], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'topology.dot';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="mt-2 w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded-lg text-xs font-medium border border-slate-700/80 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .dot</span>
              </button>
            </div>

            {/* 5. NS-2 TCL Simulator */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <span>NS-2 Simulator (TCL)</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/40">
                    network-sim.tcl
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Complete runnable NS-2 simulator TCL script setting up duplex links, DropTail queues, and UDP traffic agents.
                </p>
              </div>
              <button
                onClick={() => {
                  const exports = generateAllTopologyExports(topology);
                  const blob = new Blob([exports.ns2TclScript], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'network-sim.tcl';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="mt-2 w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-purple-300 rounded-lg text-xs font-medium border border-slate-700/80 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .tcl</span>
              </button>
            </div>

            {/* 6. Cisco Router CLI */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-rose-400" />
                    <span>Cisco IOS Config</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/40">
                    cisco-config.txt
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  Cisco IOS interface IP commands, OSPF link metric weights, and router processes for physical hardware.
                </p>
              </div>
              <button
                onClick={() => {
                  const exports = generateAllTopologyExports(topology);
                  const blob = new Blob([exports.ciscoRouterConfig], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'cisco-router-config.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="mt-2 w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-rose-300 rounded-lg text-xs font-medium border border-slate-700/80 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <ExportTopologyModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        topology={topology}
      />
    </div>
  );
};
