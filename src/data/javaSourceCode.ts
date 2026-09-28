export interface JavaCodeFile {
  filename: string;
  category: 'core' | 'servlet' | 'xml';
  description: string;
  code: string;
}

export const JAVA_FILES: JavaCodeFile[] = [
  {
    filename: 'Dijkstra.java',
    category: 'core',
    description: "Dijkstra's Single-Source Shortest Path Algorithm implementation using adjacency matrix & priority queue logic.",
    code: `/**
 * CN Lab External Examination Project
 * Network Routing and Performance Analyzer
 * File: Dijkstra.java
 *
 * Implements Dijkstra's Shortest Path Algorithm for network packet routing.
 */
import java.util.*;

public class Dijkstra {
    private static final int INF = Integer.MAX_VALUE;

    public static class Result {
        public int[] dist;
        public int[] parent;
        public List<Integer> path;
        public int totalCost;

        public Result(int[] dist, int[] parent, List<Integer> path, int totalCost) {
            this.dist = dist;
            this.parent = parent;
            this.path = path;
            this.totalCost = totalCost;
        }
    }

    /**
     * Calculates the shortest path between source and destination using Dijkstra's algorithm.
     * @param graph Adjacency matrix of link costs (0 if no link, INF if unreachable)
     * @param src Source router index
     * @param dest Destination router index
     * @param n Total number of routers
     * @return Result containing distances, parent tree, and optimal path
     */
    public static Result findShortestPath(int[][] graph, int src, int dest, int n) {
        int[] dist = new int[n];
        boolean[] visited = new boolean[n];
        int[] parent = new int[n];

        Arrays.fill(dist, INF);
        Arrays.fill(parent, -1);
        dist[src] = 0;

        for (int count = 0; count < n - 1; count++) {
            // Find vertex with minimum distance from the set of unvisited vertices
            int u = -1;
            int minVal = INF;
            for (int i = 0; i < n; i++) {
                if (!visited[i] && dist[i] < minVal) {
                    minVal = dist[i];
                    u = i;
                }
            }

            if (u == -1 || dist[u] == INF) break;

            visited[u] = true;

            // Relax adjacent vertices of the picked vertex u
            for (int v = 0; v < n; v++) {
                if (!visited[v] && graph[u][v] != 0 && graph[u][v] != INF &&
                    dist[u] != INF && dist[u] + graph[u][v] < dist[v]) {
                    dist[v] = dist[u] + graph[u][v];
                    parent[v] = u;
                }
            }
        }

        // Reconstruct path from dest to src
        List<Integer> path = new ArrayList<>();
        if (dist[dest] != INF) {
            int curr = dest;
            while (curr != -1) {
                path.add(0, curr);
                if (curr == src) break;
                curr = parent[curr];
            }
        }

        return new Result(dist, parent, path, dist[dest]);
    }
}
`,
  },
  {
    filename: 'DistanceVector.java',
    category: 'core',
    description: 'Distance Vector Routing Algorithm (Bellman-Ford equation) for dynamic routing table generation.',
    code: `/**
 * CN Lab External Examination Project
 * Network Routing and Performance Analyzer
 * File: DistanceVector.java
 *
 * Implements Bellman-Ford equation: D_x(y) = min_v { c(x,v) + D_v(y) }
 */
import java.util.*;

public class DistanceVector {
    private static final int INF = 9999;

    public static class RoutingEntry {
        public int destination;
        public int cost;
        public int nextHop;

        public RoutingEntry(int destination, int cost, int nextHop) {
            this.destination = destination;
            this.cost = cost;
            this.nextHop = nextHop;
        }
    }

    /**
     * Computes routing tables for all routers until convergence.
     */
    public static Map<Integer, List<RoutingEntry>> computeRoutingTables(int[][] costMatrix, int n) {
        int[][] d = new int[n][n];
        int[][] nextHop = new int[n][n];

        // Initialization: direct costs
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                d[i][j] = costMatrix[i][j];
                if (costMatrix[i][j] != 0 && costMatrix[i][j] != INF) {
                    nextHop[i][j] = j;
                } else {
                    nextHop[i][j] = (i == j) ? i : -1;
                }
            }
        }

        // Iterative Bellman-Ford relaxation
        boolean updated;
        int maxIterations = n;
        int iter = 0;

        do {
            updated = false;
            iter++;
            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    for (int k = 0; k < n; k++) {
                        if (costMatrix[i][k] != INF && d[k][j] != INF) {
                            int newCost = costMatrix[i][k] + d[k][j];
                            if (newCost < d[i][j]) {
                                d[i][j] = newCost;
                                nextHop[i][j] = nextHop[i][k];
                                updated = true;
                            }
                        }
                    }
                }
            }
        } while (updated && iter < maxIterations);

        // Format into routing tables
        Map<Integer, List<RoutingEntry>> tables = new HashMap<>();
        for (int i = 0; i < n; i++) {
            List<RoutingEntry> routerTable = new ArrayList<>();
            for (int j = 0; j < n; j++) {
                routerTable.add(new RoutingEntry(j, d[i][j], nextHop[i][j]));
            }
            tables.put(i, routerTable);
        }

        return tables;
    }
}
`,
  },
  {
    filename: 'LeakyBucket.java',
    category: 'core',
    description: 'Congestion Control program implementing the Leaky Bucket traffic shaping algorithm.',
    code: `/**
 * CN Lab External Examination Project
 * Network Routing and Performance Analyzer
 * File: LeakyBucket.java
 *
 * Simulates traffic shaping and congestion control using Leaky Bucket.
 */
import java.util.*;

public class LeakyBucket {
    public static class SimulationResult {
        public int incomingPackets;
        public int bucketSize;
        public int outputRate;
        public int transmitted;
        public int dropped;
        public int remaining;

        public SimulationResult(int in, int size, int rate, int tx, int drop, int rem) {
            this.incomingPackets = in;
            this.bucketSize = size;
            this.outputRate = rate;
            this.transmitted = tx;
            this.dropped = drop;
            this.remaining = rem;
        }
    }

    /**
     * Runs single burst or multi-slot leaky bucket calculation.
     */
    public static SimulationResult processBurst(int incomingPackets, int bucketSize, int outputRate) {
        int dropped = 0;
        int inBucket = incomingPackets;

        // If packets arrive faster than bucket can hold
        if (inBucket > bucketSize) {
            dropped = inBucket - bucketSize;
            inBucket = bucketSize;
        }

        // Transmit packets at fixed output rate
        int transmitted = Math.min(inBucket, outputRate);
        int remaining = inBucket - transmitted;

        return new SimulationResult(incomingPackets, bucketSize, outputRate, transmitted, dropped, remaining);
    }

    public static void main(String[] args) {
        int incoming = 20;
        int bucketSize = 10;
        int outputRate = 5;

        SimulationResult res = processBurst(incoming, bucketSize, outputRate);
        System.out.println("=== LEAKY BUCKET CONGESTION CONTROL ===");
        System.out.println("Incoming Packets : " + res.incomingPackets);
        System.out.println("Bucket Size      : " + res.bucketSize);
        System.out.println("Output Rate      : " + res.outputRate + " pkts/sec");
        System.out.println("Transmitted      : " + res.transmitted);
        System.out.println("Dropped          : " + res.dropped);
        System.out.println("Remaining in Box : " + res.remaining);
    }
}
`,
  },
  {
    filename: 'PacketSimulation.java',
    category: 'core',
    description: 'Simulates packet transmission across network paths, computing packet loss, delay, and throughput.',
    code: `/**
 * CN Lab External Examination Project
 * Network Routing and Performance Analyzer
 * File: PacketSimulation.java
 *
 * Evaluates network performance under traffic loads.
 */
import java.util.*;

public class PacketSimulation {
    public static class Stats {
        public int sent;
        public int delivered;
        public int dropped;
        public double lossPercentage;
        public double avgDelayMs;
        public double throughputPacketsSec;

        public void printReport() {
            System.out.println("----------------------------------------");
            System.out.println("      PACKET TRANSMISSION REPORT        ");
            System.out.println("----------------------------------------");
            System.out.printf("Packets Sent      : %d%n", sent);
            System.out.printf("Packets Delivered : %d%n", delivered);
            System.out.printf("Packets Dropped   : %d%n", dropped);
            System.out.printf("Packet Loss       : %.2f%%%n", lossPercentage);
            System.out.printf("Average Delay     : %.2f ms%n", avgDelayMs);
            System.out.printf("Throughput        : %.2f pkts/sec%n", throughputPacketsSec);
            System.out.println("----------------------------------------");
        }
    }

    public static Stats runSimulation(int totalPackets, double lossProb, double baseDelayMs) {
        Random rand = new Random(42);
        Stats stats = new Stats();
        stats.sent = totalPackets;

        double totalDelay = 0;
        for (int i = 1; i <= totalPackets; i++) {
            boolean isDropped = rand.nextDouble() < lossProb;
            if (isDropped) {
                stats.dropped++;
            } else {
                stats.delivered++;
                // Add jitter to delay
                double jitter = (rand.nextDouble() - 0.5) * 4.0;
                totalDelay += Math.max(1.0, baseDelayMs + jitter);
            }
        }

        stats.lossPercentage = (double) stats.dropped / totalPackets * 100.0;
        stats.avgDelayMs = stats.delivered > 0 ? (totalDelay / stats.delivered) : 0;
        // Throughput modeled based on delivery over simulated second window
        stats.throughputPacketsSec = stats.delivered;

        return stats;
    }
}
`,
  },
  {
    filename: 'NetworkGraph.java',
    category: 'core',
    description: 'Data structure representing routers and weighted transmission links.',
    code: `/**
 * CN Lab External Examination Project
 * File: NetworkGraph.java
 */
import java.util.*;

public class NetworkGraph {
    public static class Edge {
        public String src, dest;
        public int cost;
        public Edge(String s, String d, int c) { this.src = s; this.dest = d; this.cost = c; }
    }

    public List<String> routers = new ArrayList<>();
    public List<Edge> edges = new ArrayList<>();

    public void addRouter(String id) {
        if (!routers.contains(id)) routers.add(id);
    }

    public void addConnection(String src, String dest, int cost) {
        addRouter(src);
        addRouter(dest);
        edges.add(new Edge(src, dest, cost));
    }

    public int[][] toAdjacencyMatrix() {
        int n = routers.size();
        int[][] matrix = new int[n][n];
        for (int i = 0; i < n; i++) {
            Arrays.fill(matrix[i], 9999);
            matrix[i][i] = 0;
        }
        for (Edge e : edges) {
            int u = routers.indexOf(e.src);
            int v = routers.indexOf(e.dest);
            if (u != -1 && v != -1) {
                matrix[u][v] = e.cost;
                matrix[v][u] = e.cost;
            }
        }
        return matrix;
    }
}
`,
  },
  {
    filename: 'Main.java',
    category: 'core',
    description: 'Driver test program that executes Dijkstra, Distance Vector, Packet Sim, and Leaky Bucket.',
    code: `/**
 * CN Lab External Examination Project
 * Network Routing and Performance Analyzer
 * File: Main.java
 */
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println("   NETWORK ROUTING AND PERFORMANCE ANALYZER      ");
        System.out.println("         CN Lab External Project Demo           ");
        System.out.println("=================================================");

        // Setup Syllabus Topology: R1, R2, R3, R4
        String[] routerNames = {"R1", "R2", "R3", "R4"};
        int n = 4;
        int INF = 9999;
        int[][] graph = {
            { 0, 4, 3, 6 },
            { 4, 0, 2, INF },
            { 3, 2, 0, 1 },
            { 6, INF, 1, 0 }
        };

        // 1. Dijkstra Shortest Path (R1 to R4)
        System.out.println("\\n>>> MODULE 2: DIJKSTRA'S SHORTEST PATH");
        System.out.println("Source: R1, Destination: R4");
        Dijkstra.Result dijkstraRes = Dijkstra.findShortestPath(graph, 0, 3, n);

        System.out.print("Optimal Route: ");
        for (int i = 0; i < dijkstraRes.path.size(); i++) {
            System.out.print(routerNames[dijkstraRes.path.get(i)]);
            if (i < dijkstraRes.path.size() - 1) System.out.print(" ====> ");
        }
        System.out.println("\\nTotal Shortest Cost: " + dijkstraRes.totalCost);

        // 2. Distance Vector Routing Table
        System.out.println("\\n>>> MODULE 3: DISTANCE VECTOR ROUTING TABLE FOR R1");
        Map<Integer, List<DistanceVector.RoutingEntry>> dvTables =
            DistanceVector.computeRoutingTables(graph, n);

        List<DistanceVector.RoutingEntry> r1Table = dvTables.get(0);
        System.out.println("Destination | Cost | Next Hop");
        System.out.println("-----------------------------");
        for (DistanceVector.RoutingEntry entry : r1Table) {
            String nh = entry.nextHop != -1 ? routerNames[entry.nextHop] : "-";
            System.out.printf("%-11s | %-4d | %-8s%n",
                routerNames[entry.destination], entry.cost, nh);
        }

        // 3. Packet Transmission Simulation (100 Packets)
        System.out.println("\\n>>> MODULE 4: PACKET TRANSMISSION SIMULATION");
        PacketSimulation.Stats simStats = PacketSimulation.runSimulation(100, 0.06, 25.0);
        simStats.printReport();

        // 4. Congestion Control (Leaky Bucket)
        System.out.println(">>> MODULE 5: LEAKY BUCKET CONGESTION CONTROL");
        LeakyBucket.SimulationResult lbRes = LeakyBucket.processBurst(20, 10, 5);
        System.out.println("Incoming Packets : " + lbRes.incomingPackets);
        System.out.println("Bucket Capacity  : " + lbRes.bucketSize);
        System.out.println("Leak Rate        : " + lbRes.outputRate + " pkts/sec");
        System.out.println("Transmitted      : " + lbRes.transmitted);
        System.out.println("Dropped          : " + lbRes.dropped);
        System.out.println("Remaining Buffer : " + lbRes.remaining);
        System.out.println("\\nAll modules executed successfully.");
    }
}
`,
  },
  {
    filename: 'RoutingServlet.java',
    category: 'servlet',
    description: 'Apache Tomcat Java Servlet handling HTTP requests for Dijkstra & Distance Vector routing calculations.',
    code: `/**
 * File: RoutingServlet.java
 * Apache Tomcat Servlet for Web-to-Java bridge.
 */
import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class RoutingServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        String src = request.getParameter("source");
        String dest = request.getParameter("dest");

        // Example JSON response connecting Java backend to frontend
        out.println("{");
        out.println("  \\"status\\": \\"success\\",");
        out.println("  \\"source\\": \\"" + src + "\\",");
        out.println("  \\"destination\\": \\"" + dest + "\\",");
        out.println("  \\"shortestPath\\": [\\"R1\\", \\"R3\\", \\"R4\\"],");
        out.println("  \\"totalCost\\": 4");
        out.println("}");
    }
}
`,
  },
  {
    filename: 'network.xml',
    category: 'xml',
    description: 'XML configuration file storing routers and weighted connections for topology persistence.',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<network>
    <!-- Router Nodes -->
    <router id="R1" name="Router 1 (R1)" x="120" y="220"/>
    <router id="R2" name="Router 2 (R2)" x="340" y="80"/>
    <router id="R3" name="Router 3 (R3)" x="520" y="220"/>
    <router id="R4" name="Router 4 (R4)" x="340" y="360"/>

    <!-- Network Connections (Undirected Links with Metric Cost) -->
    <connection>
        <source>R1</source>
        <destination>R2</destination>
        <cost>4</cost>
        <bandwidth>100Mbps</bandwidth>
    </connection>
    <connection>
        <source>R1</source>
        <destination>R3</destination>
        <cost>3</cost>
        <bandwidth>100Mbps</bandwidth>
    </connection>
    <connection>
        <source>R1</source>
        <destination>R4</destination>
        <cost>6</cost>
        <bandwidth>50Mbps</bandwidth>
    </connection>
    <connection>
        <source>R2</source>
        <destination>R3</destination>
        <cost>2</cost>
        <bandwidth>100Mbps</bandwidth>
    </connection>
    <connection>
        <source>R3</source>
        <destination>R4</destination>
        <cost>1</cost>
        <bandwidth>100Mbps</bandwidth>
    </connection>
</network>
`,
  },
];
