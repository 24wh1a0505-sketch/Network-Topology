export interface VivaQuestion {
  id: number;
  category: 'Dijkstra' | 'Distance Vector' | 'Congestion' | 'General CN' | 'Project Architecture';
  question: string;
  answer: string;
  keyPoints: string[];
}

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 1,
    category: 'Dijkstra',
    question: "What is Dijkstra's algorithm and what is its time complexity?",
    answer:
      "Dijkstra's algorithm is a greedy single-source shortest path algorithm that finds the shortest path from a starting node to all other nodes in a weighted graph with non-negative edge weights. Time complexity with an adjacency matrix is O(V^2), and with a min-priority queue (binary heap) using adjacency list it is O((V + E) log V).",
    keyPoints: [
      'Greedy algorithm',
      'Requires non-negative edge weights',
      'Used in Link State Routing (OSPF protocol)',
      'O(V^2) or O((V + E) log V)',
    ],
  },
  {
    id: 2,
    category: 'Dijkstra',
    question: "Why does Dijkstra's algorithm fail with negative edge weights?",
    answer:
      "Dijkstra assumes that once a node is marked as visited, its shortest distance from the source is finalized. A negative edge weight later could provide a shorter path to an already finalized node, which violates the greedy assumption. For graphs with negative weights, the Bellman-Ford algorithm must be used instead.",
    keyPoints: [
      'Greedy choice property is violated',
      'Once marked visited, distance is considered final',
      'Use Bellman-Ford for negative weights',
    ],
  },
  {
    id: 3,
    category: 'Distance Vector',
    question: 'Explain the Bellman-Ford equation used in Distance Vector Routing.',
    answer:
      "The equation is Dx(y) = min_v { c(x,v) + Dv(y) }, where Dx(y) is the minimum cost from router x to destination y, c(x,v) is the cost from x to its direct neighbor v, and Dv(y) is neighbor v's estimated cost to y. Router x periodically exchanges distance vectors with direct neighbors and updates its routing table.",
    keyPoints: [
      'Formula: Dx(y) = min_v { c(x,v) + Dv(y) }',
      'Exchanges information only with directly connected neighbors',
      'Iterative, distributed, and asynchronous',
      'Used in RIP (Routing Information Protocol)',
    ],
  },
  {
    id: 4,
    category: 'Distance Vector',
    question: 'What is the Count-to-Infinity problem in Distance Vector routing, and how is it solved?',
    answer:
      'When a link fails, routers may believe a route still exists via a neighbor that was actually routing through the failed link, causing routing loops where metric costs increment step-by-step up to infinity (or 16 in RIP). Solutions include Split Horizon (never advertise a route back to the neighbor from which it was learned) and Poison Reverse (advertise cost as infinity).',
    keyPoints: [
      'Slow convergence on link failures',
      'Routing loops and metric incrementing',
      'Solution 1: Split Horizon',
      'Solution 2: Poison Reverse (cost = 16)',
      'Solution 3: Holddown timers',
    ],
  },
  {
    id: 5,
    category: 'Congestion',
    question: 'How does the Leaky Bucket algorithm control congestion?',
    answer:
      'The Leaky Bucket algorithm acts as a traffic shaping mechanism. Incoming bursty traffic enters a finite-capacity buffer (the bucket). If the buffer overflows, excess packets are dropped. Regardless of the burstiness of incoming packets, they are transmitted into the network at a constant, uniform output leak rate.',
    keyPoints: [
      'Traffic shaping and policing',
      'Finite buffer = bucket capacity',
      'Constant output rate = leak rate',
      'Drops packets when bucket overflows',
    ],
  },
  {
    id: 6,
    category: 'Congestion',
    question: 'What is the difference between Leaky Bucket and Token Bucket algorithms?',
    answer:
      'Leaky Bucket enforces a rigid constant output rate and does not allow bursty transmission into the network. Token Bucket generates tokens at a constant rate and allows bursts of packets to be transmitted instantly if enough tokens are accumulated in the bucket.',
    keyPoints: [
      'Leaky Bucket: Steady, constant output (discards burstiness)',
      'Token Bucket: Allows controlled bursts while limiting average rate',
      'Token Bucket is more flexible for web/interactive traffic',
    ],
  },
  {
    id: 7,
    category: 'General CN',
    question: 'What is the difference between Throughput, Bandwidth, and Latency?',
    answer:
      'Bandwidth is the maximum theoretical capacity of a channel (e.g. 100 Mbps). Throughput is the actual rate of successfully delivered data in a given time (e.g. 94 pkts/sec). Latency (or Delay) is the time required for a packet to travel from source to destination across links and router processing buffers.',
    keyPoints: [
      'Bandwidth = theoretical maximum capacity',
      'Throughput = actual delivered data rate',
      'Latency = propagation + transmission + queuing + processing delay',
    ],
  },
  {
    id: 8,
    category: 'Project Architecture',
    question: 'Why did you use XML for storing the network topology in this project?',
    answer:
      'XML provides a standardized, human-readable, and machine-parsable hierarchical format to define network nodes (routers) and edges (connections with costs and bandwidth). It separates network topology data from business logic, allowing easy export, import, and configuration without modifying code.',
    keyPoints: [
      'Separation of data and presentation',
      'Standardized structured format',
      'Parsable in Java (DOM/SAX) and JavaScript (DOMParser)',
      'No complex database needed',
    ],
  },
  {
    id: 9,
    category: 'Project Architecture',
    question: 'What other topology export formats does your project support, and why are they relevant?',
    answer:
      'In addition to XML (network.xml), our project exports to JSON (for web REST APIs), CSV (Adjacency Cost Matrix for lab manuals and spreadsheets), Graphviz DOT (for vector network diagrams in research papers), NS-2 TCL scripts (for executing discrete-event simulation in Network Simulator 2/NAM), and Cisco IOS configuration files (with interface IPs and OSPF costs for enterprise routers).',
    keyPoints: [
      'XML: Standard syllabus configuration persistence',
      'JSON & CSV: REST serialization & tabular records',
      'Graphviz DOT: Publication-grade network diagrams',
      'NS-2 TCL: Discrete-event simulation scripts',
      'Cisco IOS: Enterprise router CLI syntax',
    ],
  },
  {
    id: 10,
    category: 'General CN',
    question: 'How do Dijkstra and Distance Vector algorithms correspond to real-world routing protocols?',
    answer:
      'Dijkstra is the algorithmic core of Link-State routing protocols like OSPF (Open Shortest Path First) and IS-IS, where routers flood link states and compute shortest path trees independently. Distance Vector implements the Bellman-Ford algorithm used in RIP (Routing Information Protocol) and BGP (Border Gateway Protocol, path vector variant), where routers share routing tables periodically with neighbors.',
    keyPoints: [
      'Dijkstra -> OSPF & IS-IS (Link State)',
      'Distance Vector -> RIP (Routing Information Protocol)',
      'Path Vector -> BGP (Internet Inter-domain routing)',
      'OSPF converges faster and avoids loops unlike basic Distance Vector',
    ],
  },
];
