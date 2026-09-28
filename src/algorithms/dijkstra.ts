import { NetworkTopology, DijkstraResult, DijkstraStep } from '../types/network';

/**
 * Executes Dijkstra's algorithm on the given network topology with detailed step-by-step
 * educational traces for CN Lab viva and visual demonstration.
 */
export function computeDijkstra(
  topology: NetworkTopology,
  sourceId: string,
  destinationId: string
): DijkstraResult {
  const nodes = topology.nodes.map((n) => n.id);
  const distances: Record<string, number> = {};
  const predecessors: Record<string, string | null> = {};
  const visited = new Set<string>();
  const steps: DijkstraStep[] = [];

  // Build adjacency graph (undirected)
  const adjacency: Record<string, { neighbor: string; cost: number }[]> = {};
  nodes.forEach((n) => {
    adjacency[n] = [];
    distances[n] = Infinity;
    predecessors[n] = null;
  });

  topology.edges.forEach((edge) => {
    if (adjacency[edge.source] && adjacency[edge.destination]) {
      adjacency[edge.source].push({ neighbor: edge.destination, cost: edge.cost });
      adjacency[edge.destination].push({ neighbor: edge.source, cost: edge.cost });
    }
  });

  // Source initialization
  distances[sourceId] = 0;

  // Step 0: Initial state
  steps.push({
    step: 0,
    currentNode: null,
    visitedNodes: [],
    unvisitedNodes: [...nodes],
    distances: { ...distances },
    predecessors: { ...predecessors },
    explanation: `Initialization: Set distance to source ${sourceId} = 0, all other nodes = ∞. Visited set is empty.`,
  });

  let stepCount = 1;

  while (visited.size < nodes.length) {
    // Pick the unvisited node with minimum tentative distance
    let minDistance = Infinity;
    let u: string | null = null;

    nodes.forEach((node) => {
      if (!visited.has(node) && distances[node] < minDistance) {
        minDistance = distances[node];
        u = node;
      }
    });

    // If remaining nodes are unreachable
    if (u === null || minDistance === Infinity) {
      break;
    }

    // Mark u as visited
    visited.add(u);

    const neighborUpdates: string[] = [];

    // Relax all edges from u
    const neighbors = adjacency[u] || [];
    for (const { neighbor: v, cost } of neighbors) {
      if (!visited.has(v)) {
        const altDistance = distances[u] + cost;
        if (altDistance < distances[v]) {
          const oldDist = distances[v] === Infinity ? '∞' : distances[v];
          distances[v] = altDistance;
          predecessors[v] = u;
          neighborUpdates.push(`Updated ${v}: ${oldDist} ➔ ${altDistance} (via ${u})`);
        }
      }
    }

    const explanation =
      neighborUpdates.length > 0
        ? `Selected node ${u} (min tentative dist = ${minDistance}). Relaxed outgoing links: ${neighborUpdates.join(
            ', '
          )}.`
        : `Selected node ${u} (min tentative dist = ${minDistance}). No shorter paths found to neighbors.`;

    steps.push({
      step: stepCount++,
      currentNode: u,
      visitedNodes: Array.from(visited),
      unvisitedNodes: nodes.filter((n) => !visited.has(n)),
      distances: { ...distances },
      predecessors: { ...predecessors },
      explanation,
    });

    if (u === destinationId) {
      // Reached destination
      break;
    }
  }

  // Reconstruct path from destination to source
  const path: string[] = [];
  let curr: string | null = destinationId;

  if (distances[destinationId] !== Infinity) {
    while (curr !== null) {
      path.unshift(curr);
      if (curr === sourceId) break;
      curr = predecessors[curr];
    }
  }

  const segments: { from: string; to: string; cost: number }[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];
    const edge = topology.edges.find(
      (e) => (e.source === from && e.destination === to) || (e.source === to && e.destination === from)
    );
    segments.push({
      from,
      to,
      cost: edge ? edge.cost : 0,
    });
  }

  return {
    path,
    totalCost: distances[destinationId] === Infinity ? -1 : distances[destinationId],
    steps,
    distances,
    predecessors,
    segments,
  };
}
