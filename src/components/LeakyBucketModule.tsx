import React, { useState, useEffect } from 'react';
import { simulateLeakyBucket } from '../algorithms/leakyBucket';
import {
  Droplets,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';

export const LeakyBucketModule: React.FC = () => {
  // Standard syllabus defaults: Incoming = 20, Bucket Size = 10, Output Rate = 5
  const [incomingPackets, setIncomingPackets] = useState<number>(20);
  const [bucketCapacity, setBucketCapacity] = useState<number>(10);
  const [outputRate, setOutputRate] = useState<number>(5);

  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [simulationMode, setSimulationMode] = useState<'single-burst' | 'multi-slot'>('single-burst');

  // Multi-slot arrival stream pattern
  const multiSlotArrivals = [6, 12, 18, 4, 2];

  const currentArrivals =
    simulationMode === 'single-burst' ? [incomingPackets] : multiSlotArrivals;

  const result = simulateLeakyBucket(currentArrivals, {
    bucketCapacity,
    outputRate,
  });

  const currentLog = result.logs[Math.min(activeStep, result.logs.length - 1)] || result.logs[0];

  // Visual animation loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnimating) {
      if (activeStep < result.logs.length - 1) {
        timer = setTimeout(() => {
          setActiveStep((s) => s + 1);
        }, 1200);
      } else {
        setIsAnimating(false);
      }
    }
    return () => clearTimeout(timer);
  }, [isAnimating, activeStep, result.logs.length]);

  const handleRun = () => {
    setActiveStep(0);
    setIsAnimating(true);
  };

  const handleReset = () => {
    setIsAnimating(false);
    setActiveStep(0);
  };

  // Calculate bucket fill percentage for visual representation
  const fillPercentage = Math.min(
    100,
    Math.round(((currentLog?.remainingInBucket ?? 0) / bucketCapacity) * 100)
  );

  return (
    <div className="space-y-4">
      {/* Header and Context */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Module 5: Congestion Control (Leaky Bucket Algorithm)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Smooths bursty incoming traffic into a constant, uniform output transmission stream, dropping overflow packets.
            </p>
          </div>

          {/* Mode switch */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setSimulationMode('single-burst');
                handleReset();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                simulationMode === 'single-burst'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Standard Syllabus Burst
            </button>
            <button
              onClick={() => {
                setSimulationMode('multi-slot');
                handleReset();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                simulationMode === 'multi-slot'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Multi-Slot Stream
            </button>
          </div>
        </div>

        {/* Input Parameters Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
          {simulationMode === 'single-burst' ? (
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Incoming Packets: <strong className="text-cyan-400 font-mono">{incomingPackets}</strong>
              </label>
              <div className="flex items-center gap-1">
                {[10, 15, 20, 25].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      setIncomingPackets(val);
                      handleReset();
                    }}
                    className={`flex-1 py-1 rounded text-xs font-mono font-bold transition-all ${
                      incomingPackets === val
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Traffic Burst Sequence:
              </label>
              <div className="text-xs font-mono text-cyan-300 bg-slate-950 py-1.5 px-2 rounded-lg border border-slate-800">
                [{multiSlotArrivals.join(', ')}] packets
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Bucket Capacity (Buffer): <strong className="text-emerald-400 font-mono">{bucketCapacity}</strong>
            </label>
            <div className="flex items-center gap-1">
              {[5, 10, 15, 20].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setBucketCapacity(val);
                    handleReset();
                  }}
                  className={`flex-1 py-1 rounded text-xs font-mono font-bold transition-all ${
                    bucketCapacity === val
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Output Leak Rate: <strong className="text-indigo-400 font-mono">{outputRate} pkts/sec</strong>
            </label>
            <div className="flex items-center gap-1">
              {[2, 5, 8, 10].map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setOutputRate(val);
                    handleReset();
                  }}
                  className={`flex-1 py-1 rounded text-xs font-mono font-bold transition-all ${
                    outputRate === val
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Simulation View: Physical Bucket Graphic & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Animated Physical Bucket Container */}
        <div className="lg:col-span-7 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-between relative overflow-hidden">
          {/* Top Incoming Packets Stream Funnel */}
          <div className="flex flex-col items-center z-10">
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-700 text-xs font-mono text-cyan-300">
              <ArrowDown className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
              <span>Incoming Packets: {currentLog ? currentLog.incoming : incomingPackets}</span>
            </div>
            {/* Visual packet balls flowing in */}
            <div className="h-6 flex items-center justify-center gap-1 mt-1">
              {Array.from({ length: Math.min(6, currentLog ? currentLog.incoming : 4) }).map((_, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>

          {/* The Acrylic Leaky Bucket SVG */}
          <div className="relative w-64 h-52 my-3 flex items-center justify-center">
            {/* Overflow Dropped Alert Spout on the Right */}
            {currentLog && currentLog.dropped > 0 && (
              <div className="absolute -right-6 top-6 bg-rose-950/90 border border-rose-600/80 px-2.5 py-1 rounded-lg text-rose-300 text-[11px] font-mono font-bold animate-pulse flex items-center gap-1 shadow-lg shadow-rose-950">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span>OVERFLOW: -{currentLog.dropped} DROPPED</span>
              </div>
            )}

            {/* SVG Bucket Vessel */}
            <svg viewBox="0 0 200 180" className="w-full h-full drop-shadow-2xl">
              <defs>
                <linearGradient id="waterGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Bucket Body outline (tapered trapezoid) */}
              <polygon
                points="30,20 170,20 150,150 50,150"
                fill="none"
                stroke="#475569"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Water / Packet Fluid Level */}
              <rect
                x="45"
                y={150 - (fillPercentage * 1.2)}
                width="110"
                height={fillPercentage * 1.2}
                fill="url(#waterGrad)"
                rx="4"
                className="transition-all duration-700 ease-out"
              />

              {/* Capacity measurement ticks on side */}
              <line x1="30" y1="20" x2="40" y2="20" stroke="#94a3b8" strokeWidth="2" />
              <text x="10" y="24" className="text-[10px] font-mono fill-slate-400 font-bold">
                {bucketCapacity}
              </text>

              <line x1="40" y1="85" x2="48" y2="85" stroke="#94a3b8" strokeWidth="2" />
              <text x="10" y="89" className="text-[10px] font-mono fill-slate-400">
                {Math.round(bucketCapacity / 2)}
              </text>

              <line x1="50" y1="150" x2="58" y2="150" stroke="#94a3b8" strokeWidth="2" />
              <text x="22" y="154" className="text-[10px] font-mono fill-slate-400">
                0
              </text>

              {/* Bottom Leak Hole / Nozzle */}
              <rect x="90" y="150" width="20" height="12" fill="#334155" rx="2" />

              {/* Center Water Level text */}
              <text
                x="100"
                y="95"
                textAnchor="middle"
                className="text-xs font-mono font-bold fill-white select-none drop-shadow"
              >
                {currentLog ? currentLog.remainingInBucket : 0} / {bucketCapacity}
              </text>
            </svg>
          </div>

          {/* Bottom Leaking Stream (Output Transmission) */}
          <div className="flex flex-col items-center z-10">
            <div className="h-6 flex items-center justify-center gap-1.5">
              {Array.from({ length: Math.min(5, currentLog ? currentLog.transmitted : 3) }).map((_, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-bounce"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-full border border-emerald-800/60 text-xs font-mono text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Transmitted (Leak Rate): {currentLog ? currentLog.transmitted : outputRate} pkts/sec</span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="w-full flex items-center justify-between pt-4 mt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRun}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isAnimating ? 'Running...' : 'Run Leaky Bucket'}</span>
              </button>
              <button
                onClick={handleReset}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
                title="Reset simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Time Slot: <strong className="text-white">{currentLog?.timeStep ?? 1}</strong>
            </div>
          </div>
        </div>

        {/* Canonical Output & Lab Results Card */}
        <div className="lg:col-span-5 space-y-4">
          {/* Syllabus Exact Results Banner */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Syllabus Program Output</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Verified CN Output
              </span>
            </div>

            {/* Exactly as requested in prompt Section 7 */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/90 font-mono text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Incoming Packets</span>
                <span className="font-bold text-cyan-400">{result.totalIncoming}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Bucket Capacity</span>
                <span className="font-bold text-white">{bucketCapacity}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Output Leak Rate</span>
                <span className="font-bold text-indigo-300">{outputRate} pkts/sec</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-emerald-400 font-medium">Packets Transmitted</span>
                <span className="font-bold text-emerald-400">{result.totalTransmitted}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-rose-400 font-medium">Packets Dropped</span>
                <span className="font-bold text-rose-400">{result.totalDropped}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-amber-400 font-medium">Remaining in Buffer</span>
                <span className="font-bold text-amber-300">{result.remainingInBucket}</span>
              </div>
            </div>
          </div>

          {/* Mathematical Equations & Viva Card */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Algorithm Logic & Formula</span>
            </h3>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5">
              <div>
                <strong className="text-cyan-400">1. Buffer Overflow Check:</strong>
                <p className="text-slate-400">
                  if (inBucket &gt; bucketSize) dropped = inBucket - bucketSize;
                </p>
              </div>
              <div>
                <strong className="text-emerald-400">2. Fixed Leak Transmission:</strong>
                <p className="text-slate-400">
                  transmitted = Math.min(inBucket, outputRate);
                </p>
              </div>
              <div>
                <strong className="text-purple-400">3. Buffer Update:</strong>
                <p className="text-slate-400">
                  remaining = inBucket - transmitted;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discrete Time Step Log Table */}
      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Time-Slot Progression Table</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            {result.logs.length} Discrete Time Steps
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-slate-800 text-xs font-mono">
            <thead>
              <tr className="bg-slate-950 text-slate-400">
                <th className="p-2 border border-slate-800">Time Slot</th>
                <th className="p-2 border border-slate-800">Incoming</th>
                <th className="p-2 border border-slate-800">In Bucket (Pre-Leak)</th>
                <th className="p-2 border border-slate-800 text-emerald-400">Transmitted</th>
                <th className="p-2 border border-slate-800 text-rose-400">Dropped</th>
                <th className="p-2 border border-slate-800 text-amber-400">Remaining</th>
              </tr>
            </thead>
            <tbody>
              {result.logs.map((log) => {
                const isActive = log.timeStep === currentLog?.timeStep;
                return (
                  <tr
                    key={log.timeStep}
                    className={`transition-colors ${
                      isActive ? 'bg-cyan-950/40 text-cyan-200 font-bold' : 'hover:bg-slate-900'
                    }`}
                  >
                    <td className="p-2 border border-slate-800">t = {log.timeStep}</td>
                    <td className="p-2 border border-slate-800">{log.incoming}</td>
                    <td className="p-2 border border-slate-800">{log.beforeLeak}</td>
                    <td className="p-2 border border-slate-800 text-emerald-400 font-bold">
                      {log.transmitted}
                    </td>
                    <td className="p-2 border border-slate-800 text-rose-400 font-bold">
                      {log.dropped}
                    </td>
                    <td className="p-2 border border-slate-800 text-amber-300">
                      {log.remainingInBucket}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
