import React, { useState } from 'react';
import { NetworkTopology } from '../types/network';
import { generateAllTopologyExports } from '../data/topologyExports';
import {
  Download,
  Copy,
  Check,
  FileCode,
  Share2,
  Terminal,
  FileSpreadsheet,
  Network,
  Cpu,
  X,
  FileJson,
} from 'lucide-react';

interface ExportTopologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  topology: NetworkTopology;
}

type ExportTab = 'xml' | 'json' | 'csv' | 'dot' | 'ns2' | 'cisco';

export const ExportTopologyModal: React.FC<ExportTopologyModalProps> = ({
  isOpen,
  onClose,
  topology,
}) => {
  const [activeTab, setActiveTab] = useState<ExportTab>('xml');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const exports = generateAllTopologyExports(topology);

  const exportConfigs: Record<
    ExportTab,
    {
      label: string;
      filename: string;
      mimeType: string;
      content: string;
      icon: React.ReactNode;
      description: string;
      syllabusRelevance: string;
    }
  > = {
    xml: {
      label: 'XML Topology',
      filename: 'network.xml',
      mimeType: 'application/xml',
      content: exports.xml,
      icon: <FileCode className="w-4 h-4 text-indigo-400" />,
      description: 'Standard hierarchical XML format storing routers and weighted connections for topology persistence.',
      syllabusRelevance: 'Specifically required by syllabus topic: "XML storing network topology/configuration".',
    },
    json: {
      label: 'JSON Schema',
      filename: 'network-topology.json',
      mimeType: 'application/json',
      content: exports.json,
      icon: <FileJson className="w-4 h-4 text-amber-400" />,
      description: 'Full JavaScript object notation format with node coordinates, bandwidth, and edge metrics.',
      syllabusRelevance: 'Used by JavaScript and REST APIs for client-side serialization.',
    },
    csv: {
      label: 'Adjacency Matrix (CSV)',
      filename: 'adjacency-matrix.csv',
      mimeType: 'text/csv',
      content: exports.adjacencyMatrixCsv,
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" />,
      description: 'Cost matrix C[i][j] in CSV format ready for Excel, MATLAB, or statistical evaluation.',
      syllabusRelevance: 'Ideal for printing or including in CN lab record books.',
    },
    dot: {
      label: 'Graphviz (DOT)',
      filename: 'topology.dot',
      mimeType: 'text/plain',
      content: exports.graphvizDot,
      icon: <Share2 className="w-4 h-4 text-cyan-400" />,
      description: 'Graphviz DOT graph syntax for high-resolution visual network rendering in Graphviz / D3.',
      syllabusRelevance: 'Enables rendering vector network diagrams for project reports and PPT slides.',
    },
    ns2: {
      label: 'NS-2 Simulation Script (TCL)',
      filename: 'network-sim.tcl',
      mimeType: 'text/plain',
      content: exports.ns2TclScript,
      icon: <Terminal className="w-4 h-4 text-purple-400" />,
      description: 'Complete runnable NS-2 simulator TCL script setting up duplex links, DropTail queues, and UDP traffic agents.',
      syllabusRelevance: 'Directly connects with university CN Lab NS-2 and NS-3 simulation experiments.',
    },
    cisco: {
      label: 'Cisco IOS Router Config',
      filename: 'cisco-router-config.txt',
      mimeType: 'text/plain',
      content: exports.ciscoRouterConfig,
      icon: <Cpu className="w-4 h-4 text-rose-400" />,
      description: 'Cisco IOS configuration scripts with interface IPs, OSPF link metric costs, and routing process definitions.',
      syllabusRelevance: 'Demonstrates enterprise industry networking application of Dijkstra/OSPF to examiners.',
    },
  };

  const currentConfig = exportConfigs[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentConfig.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentConfig.content], { type: currentConfig.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentConfig.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllZipBundle = () => {
    // Downloads all exports consecutively
    Object.entries(exportConfigs).forEach(([key, cfg], index) => {
      setTimeout(() => {
        const blob = new Blob([cfg.content], { type: cfg.mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = cfg.filename;
        a.click();
        URL.revokeObjectURL(url);
      }, index * 200);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col my-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Export Network Topology</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                  {topology.nodes.length} Nodes • {topology.edges.length} Links
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Export current network topology across multiple formats (XML, JSON, CSV, NS-2 TCL, Graphviz, Cisco IOS).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-950/70 border-b border-slate-800 overflow-x-auto no-scrollbar">
          {(Object.keys(exportConfigs) as ExportTab[]).map((tabKey) => {
            const cfg = exportConfigs[tabKey];
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => {
                  setActiveTab(tabKey);
                  setCopied(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                {cfg.icon}
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Format Info Banner */}
        <div className="px-5 py-3 bg-slate-950/40 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <p className="text-slate-200 font-medium">{currentConfig.description}</p>
            <p className="text-amber-400/90 text-[11px] mt-0.5">{currentConfig.syllabusRelevance}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-cyan-950"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {currentConfig.filename}</span>
            </button>
          </div>
        </div>

        {/* Code Content Viewer */}
        <div className="p-5 flex-1 bg-slate-950">
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
              <span>{currentConfig.filename}</span>
              <span>{currentConfig.mimeType}</span>
            </div>
            <pre className="p-4 font-mono text-xs text-emerald-400 overflow-x-auto h-[380px] overflow-y-auto leading-relaxed selection:bg-cyan-600 selection:text-white">
              <code>{currentConfig.content}</code>
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-950 border-t border-slate-800">
          <button
            onClick={handleDownloadAllZipBundle}
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All Formats Bundle (.xml, .json, .csv, .dot, .tcl, .txt)</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
