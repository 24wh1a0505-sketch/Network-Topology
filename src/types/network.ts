export interface NetworkNode {
  id: string;
  name: string;
  x: number;
  y: number;
  isGateway?: boolean;
}

export interface NetworkEdge {
  id: string;
  source: string;
  destination: string;
  cost: number;
  bandwidthMbps?: number;
  delayMs?: number;
}

export interface NetworkTopology {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export interface DijkstraStep {
  step: number;
  currentNode: string | null;
  visitedNodes: string[];
  unvisitedNodes: string[];
  distances: Record<string, number>;
  predecessors: Record<string, string | null>;
  explanation: string;
}

export interface DijkstraResult {
  path: string[];
  totalCost: number;
  steps: DijkstraStep[];
  distances: Record<string, number>;
  predecessors: Record<string, string | null>;
  segments: { from: string; to: string; cost: number }[];
}

export interface RoutingTableRow {
  destination: string;
  cost: number;
  nextHop: string;
}

export interface DistanceVectorIteration {
  iteration: number;
  tables: Record<string, RoutingTableRow[]>;
  changes: string[];
}

export interface SimulatedPacket {
  id: number;
  source: string;
  destination: string;
  status: 'in-flight' | 'delivered' | 'dropped';
  currentHopIndex: number;
  path: string[];
  delayMs: number;
  sizeBytes: number;
  timestamp: number;
}

export interface LeakyBucketLogEntry {
  timeStep: number;
  incoming: number;
  beforeLeak: number;
  transmitted: number;
  dropped: number;
  remainingInBucket: number;
}

export interface PerformanceStats {
  packetsSent: number;
  packetsDelivered: number;
  packetsDropped: number;
  packetLossRate: number; // percentage
  averageDelayMs: number;
  throughputPacketsPerSec: number;
  throughputMbps: number;
  jitterMs: number;
}
