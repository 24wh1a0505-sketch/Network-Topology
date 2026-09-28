import React, { useState, useEffect, useRef } from 'react';
import { NetworkTopology, PerformanceStats } from '../types/network';
import { computeDijkstra } from '../algorithms/dijkstra';
import {
  Send,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  Sliders,
} from 'lucide-react';

interface PacketSimulationModuleProps {
  topology: NetworkTopology;
  sourceNode: string;
  destNode: string;
  onActivePacketUpdate: (packet: {
    source: string;
    target: string;
    progress: number;
    packetId: number;
    status: 'in-flight' | 'delivered' | 'dropped';
  } | null) => void;
  onUpdatePerformanceStats: (stats: PerformanceStats) => void;
}

interface PacketLog {
  id: number;
  status: 'delivered' | 'dropped';
  delayMs: number;
  timeStr: string;
}

export const PacketSimulationModule: React.FC<PacketSimulationModuleProps> = ({
  topology,
  sourceNode,
  destNode,
  onActivePacketUpdate,
  onUpdatePerformanceStats,
}) => {
  const [totalPacketsToTransmit, setTotalPacketsToTransmit] = useState<number>(100);
  const [packetLossRatePercent, setPacketLossRatePercent] = useState<number>(6); // Default 6%
  const [simSpeed, setSimSpeed] = useState<'slow' | 'normal' | 'fast' | 'instant'>('normal');

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentPacketIndex, setCurrentPacketIndex] = useState<number>(0);
  const [deliveredCount, setDeliveredCount] = useState<number>(0);
  const [droppedCount, setDroppedCount] = useState<number>(0);
  const [packetLogs, setPacketLogs] = useState<PacketLog[]>([]);

  const pathResult = computeDijkstra(topology, sourceNode, destNode);
  const optimalPath = pathResult.path;
  const pathCost = pathResult.totalCost;

  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [packetLogs]);

  // Run simulation frame-by-frame or step-by-step
  useEffect(() => {
    if (!isRunning) return;

    if (currentPacketIndex >= totalPacketsToTransmit) {
      setIsRunning(false);
      onActivePacketUpdate(null);
      return;
    }

    // Instant mode calculation
    if (simSpeed === 'instant') {
      let del = 0;
      let drp = 0;
      const logs: PacketLog[] = [];
      let totalDelay = 0;

      for (let i = 1; i <= totalPacketsToTransmit; i++) {
        // Pseudo-random drop based on percentage
        const isDropped = Math.random() * 100 < packetLossRatePercent;
        const delay = Math.round((pathCost * 5) + (Math.random() * 6 - 3));

        if (isDropped) {
          drp++;
          logs.push({ id: i, status: 'dropped', delayMs: 0, timeStr: `+${(i * 10).toFixed(0)}ms` });
        } else {
          del++;
          totalDelay += delay;
          logs.push({ id: i, status: 'delivered', delayMs: delay, timeStr: `+${(i * 10).toFixed(0)}ms` });
        }
      }

      setDeliveredCount(del);
      setDroppedCount(drp);
      setCurrentPacketIndex(totalPacketsToTransmit);
      setPacketLogs(logs);
      setIsRunning(false);

      const avgDelay = del > 0 ? totalDelay / del : 25;
      onUpdatePerformanceStats({
        packetsSent: totalPacketsToTransmit,
        packetsDelivered: del,
        packetsDropped: drp,
        packetLossRate: parseFloat(((drp / totalPacketsToTransmit) * 100).toFixed(1)),
        averageDelayMs: Math.round(avgDelay),
        throughputPacketsPerSec: del,
        throughputMbps: parseFloat(((del * 1500 * 8) / 1000000).toFixed(2)),
        jitterMs: 2.4,
      });
      return;
    }

    // Animated mode
    const speedIntervals = {
      slow: 350,
      normal: 120,
      fast: 40,
    };
    const intervalMs = speedIntervals[simSpeed as 'slow' | 'normal' | 'fast'] || 120;

    const timer = setTimeout(() => {
      const nextId = currentPacketIndex + 1;
      const isDropped = Math.random() * 100 < packetLossRatePercent;
      const delay = Math.round((pathCost * 5) + (Math.random() * 6 - 3));

      // Visual hop animation on canvas
      if (optimalPath.length >= 2) {
        const firstHop = optimalPath[0];
        const nextHop = optimalPath[1];
        onActivePacketUpdate({
          source: firstHop,
          target: nextHop,
          progress: 0.8,
          packetId: nextId,
          status: isDropped ? 'dropped' : 'delivered',
        });
      }

      if (isDropped) {
        setDroppedCount((d) => d + 1);
        setPacketLogs((prev) => [
          ...prev.slice(-150),
          { id: nextId, status: 'dropped', delayMs: 0, timeStr: `+${(nextId * 10)}ms` },
        ]);
      } else {
        setDeliveredCount((d) => d + 1);
        setPacketLogs((prev) => [
          ...prev.slice(-150),
          { id: nextId, status: 'delivered', delayMs: delay, timeStr: `+${(nextId * 10)}ms` },
        ]);
      }

      setCurrentPacketIndex(nextId);

      // Push partial stats
      const totalSent = nextId;
      const currentDel = isDropped ? deliveredCount : deliveredCount + 1;
      const currentDrp = isDropped ? droppedCount + 1 : droppedCount;

      onUpdatePerformanceStats({
        packetsSent: totalSent,
        packetsDelivered: currentDel,
        packetsDropped: currentDrp,
        packetLossRate: parseFloat(((currentDrp / totalSent) * 100).toFixed(1)),
        averageDelayMs: 25,
        throughputPacketsPerSec: currentDel,
        throughputMbps: parseFloat(((currentDel * 1500 * 8) / 1000000).toFixed(2)),
        jitterMs: 2.4,
      });
    }, intervalMs);

    return () => clearTimeout(timer);
  }, [
    isRunning,
    currentPacketIndex,
    totalPacketsToTransmit,
    packetLossRatePercent,
    simSpeed,
    pathCost,
    optimalPath,
    deliveredCount,
    droppedCount,
    onActivePacketUpdate,
    onUpdatePerformanceStats,
  ]);

  const handleStart = () => {
    if (currentPacketIndex >= totalPacketsToTransmit) {
      handleReset();
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    onActivePacketUpdate(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentPacketIndex(0);
    setDeliveredCount(0);
    setDroppedCount(0);
    setPacketLogs([]);
    onActivePacketUpdate(null);
  };

  const currentLossRate =
    currentPacketIndex > 0
      ? ((droppedCount / currentPacketIndex) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-4">
      {/* Header and Route Display */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-cyan-400" />
              <span>Module 4: Packet Transmission Simulation</span>
            </h2>
            <p className="text-xs text-slate-400">
              Simulates sending data packets along the shortest path with realistic network jitter and channel loss.
            </p>
          </div>

          {/* Active Route Display */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium">Route:</span>
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan-300">
              {optimalPath.map((node, i) => (
                <React.Fragment key={node}>
                  <span>{node}</span>
                  {i < optimalPath.length - 1 && <span className="text-slate-500">➔</span>}
                </React.Fragment>
              ))}
            </div>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800/50">
              Cost: {pathCost}
            </span>
          </div>
        </div>

        {/* Transmission Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Total Packets
            </label>
            <div className="flex items-center gap-1">
              {[20, 50, 100, 200].map((num) => (
                <button
                  key={num}
                  disabled={isRunning}
                  onClick={() => {
                    setTotalPacketsToTransmit(num);
                    handleReset();
                  }}
                  className={`flex-1 py-1 rounded text-xs font-mono font-bold transition-all ${
                    totalPacketsToTransmit === num
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Channel Loss Rate: <strong className="text-amber-400">{packetLossRatePercent}%</strong>
            </label>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={packetLossRatePercent}
              onChange={(e) => setPacketLossRatePercent(parseInt(e.target.value) || 0)}
              disabled={isRunning}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Simulation Speed
            </label>
            <div className="flex items-center gap-1">
              {(['slow', 'normal', 'fast', 'instant'] as const).map((spd) => (
                <button
                  key={spd}
                  onClick={() => setSimSpeed(spd)}
                  className={`flex-1 py-1 rounded text-[11px] font-medium capitalize transition-all ${
                    simSpeed === spd
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end gap-1.5">
            <button
              onClick={isRunning ? handlePause : handleStart}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95 ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isRunning ? 'Pause' : 'Send Packets'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
              title="Reset simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Live Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block uppercase font-medium">Packets Sent</span>
          <span className="text-xl sm:text-2xl font-mono font-bold text-white">
            {currentPacketIndex}{' '}
            <span className="text-xs font-normal text-slate-500">/ {totalPacketsToTransmit}</span>
          </span>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-emerald-900/40 text-center">
          <span className="text-[11px] text-emerald-400 block uppercase font-medium flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Delivered</span>
          </span>
          <span className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">
            {deliveredCount}
          </span>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-rose-900/40 text-center">
          <span className="text-[11px] text-rose-400 block uppercase font-medium flex items-center justify-center gap-1">
            <XCircle className="w-3 h-3 text-rose-400" />
            <span>Dropped</span>
          </span>
          <span className="text-xl sm:text-2xl font-mono font-bold text-rose-400">
            {droppedCount}
          </span>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-xl border border-amber-900/40 text-center">
          <span className="text-[11px] text-amber-400 block uppercase font-medium">Packet Loss</span>
          <span className="text-xl sm:text-2xl font-mono font-bold text-amber-300">
            {currentLossRate}%
          </span>
        </div>
      </div>

      {/* Real-Time Live Log Window */}
      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Packet Transmission Stream (Syllabus Display Format)</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {isRunning ? '● Transmitting...' : 'Idle'}
          </span>
        </div>

        {/* Syllabus display format: Packet 1 ✓, Packet 2 ✓ ... */}
        <div
          ref={logContainerRef}
          className="h-44 bg-slate-950 p-3 rounded-lg border border-slate-800/90 font-mono text-xs overflow-y-auto space-y-1 select-none"
        >
          {packetLogs.length === 0 ? (
            <div className="text-slate-500 italic py-8 text-center">
              Click &quot;Send Packets&quot; to begin transmitting packets across {optimalPath.join(' ➔ ')}...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-1.5">
              {packetLogs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-center justify-between px-2 py-1 rounded text-xs border ${
                    log.status === 'delivered'
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                      : 'bg-rose-950/40 text-rose-300 border-rose-800/40'
                  }`}
                >
                  <span>Packet {log.id}</span>
                  <span className="font-bold">
                    {log.status === 'delivered' ? '✓' : '✕'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
