import React from 'react';
import {
  Network,
  Share2,
  GitCommit,
  Send,
  Droplets,
  BarChart3,
  Code2,
  HelpCircle,
  Tv,
  RotateCcw,
  Sparkles,
  Download,
  Cpu,
  Laptop,
} from 'lucide-react';

export type ActiveModule =
  | 'topology'
  | 'dijkstra'
  | 'distance-vector'
  | 'packet-sim'
  | 'leaky-bucket'
  | 'performance'
  | 'java-code'
  | 'technologies';

interface NavbarProps {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
  onResetToSyllabus: () => void;
  onOpenWalkthrough: () => void;
  onOpenViva: () => void;
  onOpenPresentation: () => void;
  onOpenExportModal?: () => void;
  onOpenRunInstructions?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeModule,
  setActiveModule,
  onResetToSyllabus,
  onOpenWalkthrough,
  onOpenViva,
  onOpenPresentation,
  onOpenExportModal,
  onOpenRunInstructions,
}) => {
  const navItems: { id: ActiveModule; label: string; icon: React.ReactNode; number: string }[] = [
    { id: 'topology', label: 'Topology & XML', icon: <Network className="w-4 h-4" />, number: '01' },
    { id: 'dijkstra', label: 'Dijkstra Routing', icon: <Share2 className="w-4 h-4" />, number: '02' },
    { id: 'distance-vector', label: 'Distance Vector', icon: <GitCommit className="w-4 h-4" />, number: '03' },
    { id: 'packet-sim', label: 'Packet Sim', icon: <Send className="w-4 h-4" />, number: '04' },
    { id: 'leaky-bucket', label: 'Leaky Bucket', icon: <Droplets className="w-4 h-4" />, number: '05' },
    { id: 'performance', label: 'Performance', icon: <BarChart3 className="w-4 h-4" />, number: '06' },
    { id: 'java-code', label: 'Java Backend', icon: <Code2 className="w-4 h-4" />, number: '07' },
    { id: 'technologies', label: 'Technologies Stack', icon: <Cpu className="w-4 h-4 text-cyan-400" />, number: '08' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Lab Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-emerald-500 p-0.5 shadow-lg shadow-cyan-950/50 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Network className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Network Routing & Performance Analyzer</span>
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                  CN Lab External
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                HTML • CSS • JS • XML • Java • Dijkstra • Distance Vector • Leaky Bucket
              </p>
            </div>
          </div>

          {/* Action Buttons: Export Topology, Run in VS Code, Walkthrough, Viva Prep, PPT Deck */}
          <div className="flex items-center gap-2">
            {onOpenRunInstructions && (
              <button
                onClick={onOpenRunInstructions}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 transition-colors active:scale-95 shadow-sm"
                title="How to Run Project ZIP in VS Code / Visual Studio"
              >
                <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden lg:inline">Run in VS Code</span>
                <span className="lg:hidden hidden sm:inline">VS Code</span>
              </button>
            )}

            {onOpenExportModal && (
              <button
                onClick={onOpenExportModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors active:scale-95"
                title="Export Network Topology (XML, JSON, CSV, Graphviz DOT, NS-2 TCL, Cisco IOS)"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Export Topology</span>
                <span className="sm:hidden">Export</span>
              </button>
            )}

            <button
              onClick={onOpenWalkthrough}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-md shadow-cyan-950/40 active:scale-95"
              title="Step-by-step External Demo Walkthrough"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exam Walkthrough</span>
              <span className="sm:hidden">Walkthrough</span>
            </button>

            <button
              onClick={onOpenPresentation}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700 active:scale-95"
              title="Open External Project PPT Presentation"
            >
              <Tv className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">PPT Deck</span>
            </button>

            <button
              onClick={onOpenViva}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700 active:scale-95"
              title="Viva Voce Q&A Preparation"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Viva Prep</span>
            </button>

            <button
              onClick={onResetToSyllabus}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
              title="Reset Topology to Syllabus Example (R1-R4)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/80 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <span className={`text-[10px] font-mono px-1 rounded ${isActive ? 'bg-cyan-500/30 text-cyan-300' : 'text-slate-500'}`}>
                  {item.number}
                </span>
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
