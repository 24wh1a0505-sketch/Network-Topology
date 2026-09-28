import React, { useState, useEffect } from 'react';
import { NetworkTopology, DijkstraResult } from '../types/network';
import { computeDijkstra } from '../algorithms/dijkstra';
import {
  Share2,
  ArrowRight,
  Play,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Info,
  Zap,
} from 'lucide-react';

interface DijkstraModuleProps {
  topology: NetworkTopology;
  sourceNode: string;
  destNode: string;
  onSourceChange: (src: string) => void;
  onDestChange: (dest: string) => void;
  onHighlightPathChange: (path: string[]) => void;
  onVisitedNodesChange: (visited: string[]) => void;
  onCurrentNodeChange: (curr: string | null) => void;
}

export const DijkstraModule: React.FC<DijkstraModuleProps> = ({
  topology,
  sourceNode,
  destNode,
  onSourceChange,
  onDestChange,
  onHighlightPathChange,
  onVisitedNodesChange,
  onCurrentNodeChange,
}) => {
  const [result, setResult] = useState<DijkstraResult | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Compute Dijkstra whenever topology or endpoints change
  const runAlgorithm = () => {
    if (!sourceNode || !destNode) return;
    const res = computeDijkstra(topology, sourceNode, destNode);
    setResult(res);
    setCurrentStepIndex(res.steps.length - 1); // Jump to final result by default
    onHighlightPathChange(res.path);
    onVisitedNodesChange(Object.keys(res.distances).filter((k) => res.distances[k] < Infinity));
    onCurrentNodeChange(null);
  };

  useEffect(() => {
    runAlgorithm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topology, sourceNode, destNode]);

  // Handle step-by-step playback
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && result) {
      if (currentStepIndex < result.steps.length - 1) {
        timer = setTimeout(() => {
          handleStep(currentStepIndex + 1);
        }, 1200);
      } else {
        setIsPlaying(false);
      }
    }
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentStepIndex, result]);

  const handleStep = (stepIdx: number) => {
    if (!result) return;
    const safeIdx = Math.max(0, Math.min(result.steps.length - 1, stepIdx));
    setCurrentStepIndex(safeIdx);
    const step = result.steps[safeIdx];

    onVisitedNodesChange(step.visitedNodes);
    onCurrentNodeChange(step.currentNode);

    // If at final step, show the full path glow
    if (safeIdx === result.steps.length - 1) {
      onHighlightPathChange(result.path);
    } else {
      onHighlightPathChange([]);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    handleStep(0);
  };

  return (
    <div className="space-y-4">
      {/* Control Bar: Source, Destination, Run, Step Controls */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Module 2: Dijkstra&apos;s Shortest Path Algorithm</span>
            </h2>
            <p className="text-xs text-slate-400">
              Greedy link-state routing algorithm finding minimum total metric cost from source to destination.
            </p>
          </div>

          {/* Source & Destination Selectors */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-emerald-400 font-semibold">Source:</span>
              <select
                value={sourceNode}
                onChange={(e) => onSourceChange(e.target.value)}
                className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none cursor-pointer"
              >
                {topology.nodes.map((n) => (
                  <option key={n.id} value={n.id} className="bg-slate-900">
                    {n.id}
                  </option>
                ))}
              </select>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-500" />

            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-purple-400 font-semibold">Dest:</span>
              <select
                value={destNode}
                onChange={(e) => onDestChange(e.target.value)}
                className="bg-transparent text-xs font-mono font-bold text-white focus:outline-none cursor-pointer"
              >
                {topology.nodes.map((n) => (
                  <option key={n.id} value={n.id} className="bg-slate-900">
                    {n.id}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={runAlgorithm}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-950 transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Compute</span>
            </button>
          </div>
        </div>

        {/* Stepper Toolbar */}
        {result && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                title="Reset to Step 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={currentStepIndex <= 0}
                onClick={() => handleStep(currentStepIndex - 1)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs transition-colors"
                title="Previous Step"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={currentStepIndex >= result.steps.length - 1}
                onClick={() => handleStep(currentStepIndex + 1)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs transition-colors"
                title="Next Step"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  isPlaying
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                <Play className="w-3 h-3" />
                <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Step <span className="text-cyan-400 font-bold">{currentStepIndex + 1}</span> of{' '}
              <span className="text-white font-bold">{result.steps.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Result Card: Optimal Path Banner */}
      {result && result.totalCost !== -1 && (
        <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 p-4 rounded-2xl border border-cyan-500/40 shadow-lg shadow-cyan-950/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Optimal Shortest Route Identified</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg sm:text-xl font-mono font-extrabold text-white flex items-center gap-2">
                  {result.path.map((node, i) => (
                    <React.Fragment key={node}>
                      <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-700">
                        {node}
                      </span>
                      {i < result.path.length - 1 && (
                        <span className="text-cyan-400 font-sans text-sm">=====&gt;</span>
                      )}
                    </React.Fragment>
                  ))}
                </span>
              </div>
            </div>

            {/* Total Cost Badge */}
            <div className="bg-slate-950/90 border border-cyan-500/40 px-4 py-2.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase block font-medium">Total Cost</span>
              <span className="text-2xl font-mono font-black text-cyan-300">
                {result.totalCost}
              </span>
            </div>
          </div>

          {/* Segment Cost Breakdown */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs">
            <span className="text-slate-400 font-medium">Cost Breakdown:</span>
            {result.segments.map((seg, idx) => (
              <span key={idx} className="font-mono bg-slate-900 px-2 py-1 rounded text-slate-300 border border-slate-800">
                {seg.from} ➔ {seg.to} = <strong className="text-cyan-400">{seg.cost}</strong>
              </span>
            ))}
            <span className="text-slate-400">
              Sum = <strong className="text-emerald-400">{result.segments.map((s) => s.cost).join(' + ')} = {result.totalCost}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Step Explanation & Tentative Distances Table */}
      {result && currentStepIndex >= 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step Explanation Card */}
          <div className="md:col-span-1 bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Execution Trace (Step {currentStepIndex + 1})</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {result.steps[currentStepIndex]?.explanation}
            </p>
            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              Visited Set S: [{result.steps[currentStepIndex]?.visitedNodes.join(', ')}]
            </div>
          </div>

          {/* Tentative Distance Array Table */}
          <div className="md:col-span-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Distance & Predecessor Vector (dist[v] & parent[v])
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Formula: dist[v] = min(dist[v], dist[u] + cost(u,v))
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse border border-slate-800 text-xs font-mono">
                <thead>
                  <tr className="bg-slate-950 text-slate-400">
                    <th className="p-1.5 border border-slate-800">Node</th>
                    {topology.nodes.map((n) => (
                      <th key={n.id} className="p-1.5 border border-slate-800 text-cyan-400 font-bold">
                        {n.id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-1.5 border border-slate-800 font-semibold text-slate-400 bg-slate-950">
                      dist[v]
                    </td>
                    {topology.nodes.map((n) => {
                      const d = result.steps[currentStepIndex]?.distances[n.id];
                      return (
                        <td
                          key={n.id}
                          className={`p-1.5 border border-slate-800 font-bold ${
                            d === Infinity ? 'text-slate-600' : 'text-emerald-400'
                          }`}
                        >
                          {d === Infinity ? '∞' : d}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-1.5 border border-slate-800 font-semibold text-slate-400 bg-slate-950">
                      parent[v]
                    </td>
                    {topology.nodes.map((n) => {
                      const p = result.steps[currentStepIndex]?.predecessors[n.id];
                      return (
                        <td key={n.id} className="p-1.5 border border-slate-800 text-slate-300">
                          {p ?? '-'}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
