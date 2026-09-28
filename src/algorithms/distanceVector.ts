import { NetworkTopology, RoutingTableRow, DistanceVectorIteration } from '../types/network';

/**
 * Computes Distance Vector Routing tables for all routers in the topology.
 * Simulates iterative asynchronous/synchronous distance vector exchange (Bellman-Ford)
 * until convergence.
 */
export function computeDistanceVector(topology: NetworkTopology): {
  iterations: DistanceVectorIteration[];
  finalTables: Record<string, RoutingTableRow[]>;
  convergedAtIteration: number;
} {
  const nodes = topology.nodes.map((n) => n.id);
  const n = nodes.length;

  // Build direct link cost matrix
  const directCost: Record<string, Record<string, number>> = {};
  nodes.forEach((u) => {
    directCost[u] = {};
    nodes.forEach((v) => {
      directCost[u][v] = u === v ? 0 : Infinity;
    });
  });

  topology.edges.forEach((edge) => {
    if (directCost[edge.source] && directCost[edge.destination]) {
      directCost[edge.source][edge.destination] = edge.cost;
      directCost[edge.destination][edge.source] = edge.cost;
    }
  });

  // Current distance tables: D[u][v] = cost from u to v
  // and NextHop[u][v] = next hop from u to v
  const D: Record<string, Record<string, number>> = {};
  const nextHop: Record<string, Record<string, string>> = {};

  // Iteration 0: Initial state (routers know only their direct neighbors)
  nodes.forEach((u) => {
    D[u] = {};
    nextHop[u] = {};
    nodes.forEach((v) => {
      D[u][v] = directCost[u][v];
      nextHop[u][v] = directCost[u][v] < Infinity ? (u === v ? '-' : v) : '-';
    });
  });

  const iterations: DistanceVectorIteration[] = [];

  const captureTables = (): Record<string, RoutingTableRow[]> => {
    const res: Record<string, RoutingTableRow[]> = {};
    nodes.forEach((u) => {
      res[u] = nodes.map((v) => ({
        destination: v,
        cost: D[u][v],
        nextHop: nextHop[u][v],
      }));
    });
    return res;
  };

  iterations.push({
    iteration: 0,
    tables: captureTables(),
    changes: ['Initial state: Routers configure routing tables with direct neighbor costs only.'],
  });

  let converged = false;
  let iter = 1;
  const maxIterations = 20;

  while (!converged && iter <= maxIterations) {
    let anyChange = false;
    const currentChanges: string[] = [];

    // Clone current distances for this round
    const nextD: Record<string, Record<string, number>> = {};
    const nextHopRound: Record<string, Record<string, string>> = {};

    nodes.forEach((u) => {
      nextD[u] = { ...D[u] };
      nextHopRound[u] = { ...nextHop[u] };
    });

    // Bellman-Ford update for each router u towards every destination y
    for (const u of nodes) {
      for (const y of nodes) {
        if (u === y) continue;

        let minCost = nextD[u][y];
        let bestHop = nextHopRound[u][y];

        // Check through all neighbors v of u
        for (const v of nodes) {
          if (directCost[u][v] < Infinity && u !== v) {
            const costViaNeighbor = directCost[u][v] + D[v][y];
            if (costViaNeighbor < minCost) {
              minCost = costViaNeighbor;
              bestHop = v;
            }
          }
        }

        if (minCost < D[u][y]) {
          anyChange = true;
          currentChanges.push(
            `Router ${u} discovered shorter path to ${y} via ${bestHop}: Cost ${
              D[u][y] === Infinity ? '∞' : D[u][y]
            } ➔ ${minCost}`
          );
          nextD[u][y] = minCost;
          nextHopRound[u][y] = bestHop;
        }
      }
    }

    // Apply round updates
    nodes.forEach((u) => {
      D[u] = { ...nextD[u] };
      nextHop[u] = { ...nextHopRound[u] };
    });

    if (anyChange) {
      iterations.push({
        iteration: iter,
        tables: captureTables(),
        changes: currentChanges,
      });
      iter++;
    } else {
      converged = true;
      iterations.push({
        iteration: iter,
        tables: captureTables(),
        changes: ['Network Converged: All routing tables have reached steady state with optimal shortest paths.'],
      });
    }
  }

  return {
    iterations,
    finalTables: captureTables(),
    convergedAtIteration: iter,
  };
}
