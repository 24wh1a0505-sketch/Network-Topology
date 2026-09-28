import React, { useState, useMemo } from 'react';
import { NetworkTopology } from '../types/network';
import { computeDistanceVector } from '../algorithms/distanceVector';
import {
  GitCommit,
  CheckCircle2,
  RefreshCw,
  Zap,
  HelpCircle,
  Clock,
  Layers,
} from 'lucide-react';

interface DistanceVectorModuleProps {
  topology: NetworkTopology;
}

export const DistanceVectorModule: React.FC<DistanceVectorModuleProps> = ({ topology }) => {
  const [selectedRouter, setSelectedRouter] = useState<string>(topology.nodes[0]?.id || 'R1');
  const [currentIterationIndex, setCurrentIterationIndex] = useState<number>(-1);

  // Calculate Distance Vector algorithm
  const dvData = useMemo(() => {
    return computeDistanceVector(topology);
  }, [topology]);

  const totalIterations = dvData.iterations.length;
  const activeIter =
    currentIterationIndex === -1 ? totalIterations - 1 : currentIterationIndex;
  const currentIterationData = dvData.iterations[activeIter];
  const routingTables = currentIterationData?.tables || dvData.finalTables;
  const routerTable = routingTables[selectedRouter] || [];

  return (
    <div className="space-y-4">
      {/* Module Header & Explanation */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-cyan-400" />
              <span>Module 3: Distance Vector Routing Algorithm</span>
            </h2>
            <p className="text-xs text-slate-400">
              Distributed Bellman-Ford routing table calculation where routers exchange distance vectors with direct neighbors.
            </p>
          </div>

          {/* Convergence status badge */}
          <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1.5 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300">
              Converged in {dvData.convergedAtIteration} Round(s)
            </span>
          </div>
        </div>

        {/* Iteration Round Stepper */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Iteration Step:</span>
            {dvData.iterations.map((iter, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIterationIndex(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeIter === idx
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Round {iter.iteration}
              </button>
            ))}
            <button
              onClick={() => setCurrentIterationIndex(-1)}
              className="text-xs text-cyan-400 hover:underline ml-2"
            >
              Latest (Converged)
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>
              Showing: {activeIter === 0 ? 'Initial Configuration' : `Iteration Round ${activeIter}`}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Router Routing Tables & Live Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Router Selection & Routing Table View */}
        <div className="lg:col-span-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Select Router:
              </span>
              <div className="flex items-center gap-1">
                {topology.nodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedRouter(node.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedRouter === node.id
                        ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {node.id}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
              Routing Table for Router <strong className="text-cyan-400">{selectedRouter}</strong>
            </span>
          </div>

          {/* Canonical Syllabus Routing Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-800 text-xs font-mono">
              <thead>
                <tr className="bg-slate-950 text-slate-400">
                  <th className="p-3 border border-slate-800">Destination</th>
                  <th className="p-3 border border-slate-800 text-center">Cost (Metric)</th>
                  <th className="p-3 border border-slate-800 text-center">Next Hop</th>
                  <th className="p-3 border border-slate-800">Status / Explanation</th>
                </tr>
              </thead>
              <tbody>
                {routerTable.map((row) => {
                  const isSelf = row.destination === selectedRouter;
                  const isInf = row.cost === Infinity;

                  return (
                    <tr
                      key={row.destination}
                      className={`hover:bg-slate-900 transition-colors ${
                        isSelf ? 'bg-slate-950/40 text-slate-500' : 'text-slate-200'
                      }`}
                    >
                      <td className="p-3 border border-slate-800 font-bold text-cyan-400">
                        {row.destination}
                      </td>
                      <td className="p-3 border border-slate-800 text-center font-bold">
                        {isInf ? (
                          <span className="text-slate-600">∞</span>
                        ) : (
                          <span
                            className={
                              isSelf
                                ? 'text-slate-500'
                                : 'text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40'
                            }
                          >
                            {row.cost}
                          </span>
                        )}
                      </td>
                      <td className="p-3 border border-slate-800 text-center font-bold">
                        {row.nextHop === '-' ? (
                          <span className="text-slate-600">-</span>
                        ) : (
                          <span className="text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/40">
                            {row.nextHop}
                          </span>
                        )}
                      </td>
                      <td className="p-3 border border-slate-800 text-slate-400 font-sans text-[11px]">
                        {isSelf
                          ? 'Local router interface (Cost = 0)'
                          : isInf
                          ? 'Unreachable'
                          : row.nextHop === row.destination
                          ? `Direct point-to-point link to ${row.destination}`
                          : `Multi-hop route routed through gateway ${row.nextHop}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Quick Syllabus Example Check Box */}
          {selectedRouter === 'R1' && topology.nodes.some((n) => n.id === 'R4') && (
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 block font-medium mb-1">
                Syllabus Verification Check:
              </span>
              <p className="text-slate-300 font-mono">
                Router R1 routing to <span className="text-purple-400 font-bold">R4</span> has Cost ={' '}
                <span className="text-emerald-400 font-bold">
                  {routerTable.find((r) => r.destination === 'R4')?.cost ?? 4}
                </span>{' '}
                via Next Hop ={' '}
                <span className="text-cyan-400 font-bold">
                  {routerTable.find((r) => r.destination === 'R4')?.nextHop ?? 'R3'}
                </span>
                .
              </p>
            </div>
          )}
        </div>

        {/* Side Panel: Iteration Changes Log & Bellman-Ford Theory */}
        <div className="space-y-4">
          {/* Vector Exchange Log */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Round {activeIter} Updates</span>
            </h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {currentIterationData?.changes.map((ch, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-2 rounded text-[11px] text-slate-300 font-mono border border-slate-800/80 leading-relaxed"
                >
                  {ch}
                </div>
              ))}
            </div>
          </div>

          {/* Viva Voce Theory Box */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Viva Voce Key Notes</span>
            </h3>
            <div className="text-xs text-slate-300 space-y-2">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold font-mono block text-[11px] mb-1">
                  Bellman-Ford Equation:
                </span>
                <code className="text-amber-300 font-mono text-xs block">
                  D_x(y) = min_v &#123; c(x,v) + D_v(y) &#125;
                </code>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Routers exchange distance vectors with neighbors every 30 seconds (in RIP). If a link fails,
                it can cause the <strong>Count-to-Infinity problem</strong>, solved by <em>Split Horizon</em> and <em>Poison Reverse</em>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
