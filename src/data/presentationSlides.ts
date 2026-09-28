export interface PresentationSlide {
  id: number;
  title: string;
  subtitle?: string;
  points: { title: string; desc: string; icon?: string }[];
  codeOrDiagram?: string;
  footerNote?: string;
}

export const PRESENTATION_SLIDES: PresentationSlide[] = [
  {
    id: 1,
    title: 'NETWORK ROUTING & PERFORMANCE ANALYZER',
    subtitle: 'Computer Networks Laboratory External Project Demonstration',
    points: [
      {
        title: 'Project Domain',
        desc: 'Computer Networks (Routing Algorithms, Packet Simulation & Congestion Control)',
      },
      {
        title: 'Technologies Stack',
        desc: 'HTML5, CSS3, JavaScript (ES6+), XML, Java (JDK), Apache Tomcat Architecture',
      },
      {
        title: 'Core Algorithms Implemented',
        desc: "Dijkstra's Shortest Path Algorithm, Distance Vector Routing (Bellman-Ford), Leaky Bucket Traffic Shaper",
      },
      {
        title: 'Key Advantage',
        desc: 'Interactive, real-time visual simulation with zero external database dependencies',
      },
    ],
    footerNote: 'Computer Networks Lab External Project • Prepared for Viva Voce & Practical Exam',
  },
  {
    id: 2,
    title: 'Problem Statement & Motivation',
    subtitle: 'Why build this simulation platform?',
    points: [
      {
        title: 'Theoretical Complexity',
        desc: 'Understanding algorithmic routing table updates and congestion mechanisms solely through textbook equations is difficult.',
      },
      {
        title: 'Dynamic Behavior Missing',
        desc: 'Traditional static lab exercises do not illustrate packet drops, link delays, or buffer overflow in real-time.',
      },
      {
        title: 'Proposed Solution',
        desc: 'A comprehensive interactive analyzer simulating router discovery, shortest paths, packet delivery, and traffic shaping.',
      },
    ],
    codeOrDiagram: `[Network Topology: XML] ──▶ [Routing Engine: Dijkstra & DV] ──▶ [Packet Sim & Leaky Bucket] ──▶ [Dashboard]`,
    footerNote: 'Syllabus Topic Alignment: Dijkstra, Distance Vector, Leaky Bucket, Delay, Throughput',
  },
  {
    id: 3,
    title: 'Project Objectives',
    subtitle: 'Measurable academic and practical goals',
    points: [
      {
        title: '1. Implement Shortest Path Routing',
        desc: "Determine lowest-cost routes between any two routers using Dijkstra's Greedy Algorithm.",
      },
      {
        title: '2. Generate Distance Vector Routing Tables',
        desc: 'Simulate iterative Bellman-Ford exchanges among neighboring routers until convergence.',
      },
      {
        title: '3. Real-Time Packet Simulation',
        desc: 'Transmit packets along selected routes and measure packet delivery, drops, and latency.',
      },
      {
        title: '4. Traffic Shaping via Leaky Bucket',
        desc: 'Demonstrate buffer queues, leak rates, and drop mitigation under bursty traffic conditions.',
      },
      {
        title: '5. XML Topology Persistence',
        desc: 'Store and load arbitrary network topologies seamlessly via standardized XML schemas.',
      },
    ],
    footerNote: 'Complete mapping with university CN lab syllabus experiments',
  },
  {
    id: 4,
    title: 'Technologies Used & Architecture',
    subtitle: 'Role of each technology in the system',
    points: [
      {
        title: 'HTML & CSS',
        desc: 'Provides modern responsive user interface, dark-mode dashboard styling, and modular layout panels.',
      },
      {
        title: 'JavaScript (ES6+ / React 19)',
        desc: 'Drives dynamic network canvas visualizer, animated packet movement, interactive charts, and real-time state.',
      },
      {
        title: 'Java (JDK / Servlets)',
        desc: 'Contains backend core algorithms (Dijkstra.java, DistanceVector.java, LeakyBucket.java, PacketSimulation.java).',
      },
      {
        title: 'XML & Multi-Format Exporter',
        desc: 'Persists network topology in XML without databases, with exports to JSON, CSV matrix, NS-2 TCL, Graphviz DOT, and Cisco IOS.',
      },
      {
        title: 'Apache Tomcat & Tooling',
        desc: 'Web application servlet container hosting Java HTTP routing servlets with NS-2/Wireshark telemetry alignment.',
      },
    ],
    footerNote: 'Pure Web + Java architecture adhering strictly to lab guidelines and syllabus',
  },
  {
    id: 5,
    title: 'Module 1: Network Topology & Multi-Format Export',
    subtitle: 'Interactive Router Graph with XML, JSON, CSV, DOT, NS-2 TCL & Cisco IOS Exports',
    points: [
      {
        title: 'Default Syllabus Graph',
        desc: '4 Routers: R1, R2, R3, R4. Costs: R1-R2=4, R1-R3=3, R1-R4=6, R2-R3=2, R3-R4=1.',
      },
      {
        title: 'Interactive Graph Features',
        desc: 'Drag & drop router repositioning, dynamic addition/deletion of links and cost adjustments.',
      },
      {
        title: 'Multi-Format Export Engine',
        desc: 'Export current topology seamlessly to XML, JSON, CSV Adjacency Matrix, Graphviz DOT, NS-2 Simulator TCL, and Cisco IOS CLI.',
      },
      {
        title: 'XML Live Parser',
        desc: 'Binds SVG canvas directly with <network><router .../><connection .../></network> XML representations.',
      },
    ],
    codeOrDiagram: `<network>
  <router id="R1" name="Router 1"/>
  <connection>
    <source>R1</source><destination>R3</destination><cost>3</cost>
  </connection>
</network>
Exports: XML | JSON | CSV Matrix | Graphviz DOT | NS-2 TCL | Cisco IOS`,
    footerNote: 'Supports 4-node syllabus, 6-node enterprise mesh, and custom user topologies',
  },
  {
    id: 6,
    title: "Module 2: Dijkstra's Shortest Path Algorithm",
    subtitle: 'Single-source shortest path calculation with visual step-by-step trace',
    points: [
      {
        title: 'Syllabus Example Query',
        desc: 'Source = R1, Destination = R4.',
      },
      {
        title: 'Calculated Optimal Route',
        desc: 'R1 ➔ R3 ➔ R4 with Total Cost = 3 + 1 = 4 (compared to direct link R1-R4 cost 6).',
      },
      {
        title: 'Step-by-Step Educational Trace',
        desc: 'Displays tentative distances array dist[v], parent pointers, and relaxation step comparisons.',
      },
      {
        title: 'Time & Space Complexity',
        desc: 'O(V^2) using adjacency matrix; O((V+E) log V) using priority queue min-heap.',
      },
    ],
    codeOrDiagram: `Relaxation Rule:
if (dist[u] + cost(u,v) < dist[v]) {
    dist[v] = dist[u] + cost(u,v);
    parent[v] = u;
}`,
    footerNote: 'Primary viva question during CN Lab External Exam',
  },
  {
    id: 7,
    title: 'Module 3: Distance Vector Routing (Bellman-Ford)',
    subtitle: 'Decentralized routing table exchange and convergence',
    points: [
      {
        title: 'Bellman-Ford Equation',
        desc: 'Dx(y) = min_v { c(x,v) + Dv(y) } where v represents direct neighbors.',
      },
      {
        title: 'Routing Table Outputs',
        desc: 'Generates Destination, Metric Cost, and Next Hop for every router in the network.',
      },
      {
        title: 'Convergence Trace',
        desc: 'Shows step-by-step iteration rounds until distance vectors stabilize.',
      },
      {
        title: 'Viva Concepts Covered',
        desc: 'RIP protocol, Count-to-Infinity problem, Split Horizon, and Poison Reverse.',
      },
    ],
    footerNote: 'Provides simulated router table outputs for R1, R2, R3, R4',
  },
  {
    id: 8,
    title: 'Module 4: Packet Simulation Engine',
    subtitle: 'Simulating discrete packet hops, packet loss, and jitter',
    points: [
      {
        title: 'Packet Transmission Pipeline',
        desc: 'Sends configurable packet batches (e.g. 100 packets) along the computed shortest path.',
      },
      {
        title: 'Visual Representation',
        desc: 'Animated packet markers traveling between routers with real-time arrival and drop status.',
      },
      {
        title: 'Numerical Metrics Tracked',
        desc: 'Total Packets Sent, Packets Delivered, Packets Dropped, and Packet Loss %.',
      },
    ],
    codeOrDiagram: `Packets: 100 ──▶ [R1] ──(3)──▶ [R3] ──(1)──▶ [R4]
Delivered: 94  |  Dropped: 6  |  Loss: 6.0%`,
    footerNote: 'Demonstrates end-to-end packet delivery and real-time loss tracking',
  },
  {
    id: 9,
    title: 'Module 5: Congestion Control (Leaky Bucket)',
    subtitle: 'Traffic policing and shaping with finite buffer queue',
    points: [
      {
        title: 'Core Concept',
        desc: 'Smoothes bursty input arrivals into a smooth, constant output transmission stream.',
      },
      {
        title: 'Mathematical Model',
        desc: 'Dropped = max(0, CurrentPackets + Incoming - BucketSize); Transmitted = min(LeakRate, Buffer).',
      },
      {
        title: 'Standard Lab Example',
        desc: 'Incoming = 20 packets, Bucket Size = 10, Output Rate = 5 pkts/sec ➔ Transmitted = 15, Dropped = 5.',
      },
      {
        title: 'Physical Animation',
        desc: 'Visual animated bucket with incoming funnel, rising liquid/packet level, and bottom leak faucet.',
      },
    ],
    footerNote: 'Directly solves: "Write a program for congestion control using Leaky Bucket algorithm"',
  },
  {
    id: 10,
    title: 'Module 6: Performance Analysis Dashboard',
    subtitle: 'Comprehensive network telemetry and QoS metrics',
    points: [
      {
        title: 'Performance KPI Dashboard',
        desc: 'Tracks Throughput (pkts/sec & Mbps), Average Delay (ms), Packet Loss Rate (%), and Jitter.',
      },
      {
        title: 'Interactive Visual Charts',
        desc: 'Sent vs Delivered vs Dropped distribution, Delay distribution, and Traffic load comparisons.',
      },
      {
        title: 'Lab Notebook Export',
        desc: 'Generates clean, printable experiment summary report for CN lab record book submission.',
      },
    ],
    footerNote: 'Complete analytical validation of simulated networking behavior',
  },
  {
    id: 11,
    title: 'Key Advantages of the System',
    subtitle: 'Why this project excels for CN Lab external evaluation',
    points: [
      {
        title: '1. Exact Syllabus Alignment',
        desc: "Directly covers Dijkstra, Distance Vector, Leaky Bucket, and QoS metrics from the CN syllabus.",
      },
      {
        title: '2. Zero Database Hassle',
        desc: 'Uses lightweight XML files for data persistence, avoiding database configuration errors.',
      },
      {
        title: '3. Full Java Backend Code Included',
        desc: 'Provides fully documented, standalone compilable Java classes with simulated JVM execution.',
      },
      {
        title: '4. High Visual Clarity',
        desc: 'Interactive visual canvas makes complex network dynamics intuitively obvious to examiners.',
      },
    ],
    footerNote: 'Proven ideal structure for Computer Networks external project presentation',
  },
  {
    id: 12,
    title: 'Future Scope & Conclusion',
    subtitle: 'Extensions and closing remarks',
    points: [
      {
        title: 'Future Scope',
        desc: 'Integration with Wireshark packet capture PCAP files, TCP vs UDP flow comparisons, NS2/NS3 trace imports, and OSPF Link-State advertisement simulation.',
      },
      {
        title: 'Conclusion',
        desc: 'The Network Routing and Performance Analyzer bridges abstract networking theory and practical observation, providing an interactive testbed for routing and congestion control.',
      },
      {
        title: 'Ready for Viva Voce & Demonstration',
        desc: 'Thank you! Open for questions and live algorithm demonstration.',
      },
    ],
    footerNote: 'Network Routing and Performance Analyzer • End of Presentation',
  },
];
