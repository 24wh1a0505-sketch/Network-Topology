export interface TechnologyItem {
  id: string;
  name: string;
  category: 'Frontend & UI' | 'Backend & Algorithms' | 'Configuration & Data' | 'Server & Runtime' | 'Tooling & Protocols';
  badge: string;
  version?: string;
  roleInProject: string;
  syllabusAlignment: string;
  keyFeatures: string[];
  codeSamplePreview?: string;
}

export const TECHNOLOGIES_STACK: TechnologyItem[] = [
  {
    id: 'html5',
    name: 'HTML5',
    category: 'Frontend & UI',
    badge: 'Structure / UI',
    version: 'HTML 5.3',
    roleInProject: 'Provides semantic structure, document hierarchy, forms for parameters, canvas containers, and modular tab layouts.',
    syllabusAlignment: 'Required for web dashboard layout and browser testing in CN Lab evaluation.',
    keyFeatures: [
      'Semantic document markup (<header>, <main>, <nav>, <section>)',
      'HTML5 SVG Graphics Layer for interactive router node vector drawing',
      'Native input validation for router parameters and packet burst ranges',
      'Accessible form controls for source & destination router selection',
    ],
    codeSamplePreview: `<div id="topology-canvas" class="network-viewport">\n  <svg class="graph-layer"><!-- Router nodes & links --></svg>\n</div>`,
  },
  {
    id: 'css3',
    name: 'CSS3 / Tailwind',
    category: 'Frontend & UI',
    badge: 'Styling & Design',
    version: 'CSS3 / Tailwind v4',
    roleInProject: 'Styles the dark-mode dashboard, fluid grids, glowing link paths, animated packet markers, and responsive tables.',
    syllabusAlignment: 'Required for user interface aesthetic, status indicators, and professional viva presentation.',
    keyFeatures: [
      'Gradients and glowing drop-shadow filters on shortest path links',
      'CSS keyframe animations for packet flight and leaky bucket fill gauge',
      'Responsive flexbox & grid design for laptop and projector views',
      'Strict color coding (Emerald = Delivered, Rose = Dropped, Cyan = Optimal)',
    ],
    codeSamplePreview: `.packet-stream {\n  animation: flowAlongRoute 1.2s ease-in-out infinite;\n  box-shadow: 0 0 12px #22d3ee;\n}`,
  },
  {
    id: 'javascript',
    name: 'JavaScript (ES6+ / TypeScript)',
    category: 'Frontend & UI',
    badge: 'Interactivity & Logic',
    version: 'ES2022 / React 19',
    roleInProject: 'Drives node dragging, dynamic SVG updates, real-time packet animation clock, chart rendering, and XML parsing.',
    syllabusAlignment: 'Required for user interaction, network visualization, and dynamic algorithm execution in the browser.',
    keyFeatures: [
      'Client-side execution of Dijkstra and Distance Vector Bellman-Ford algorithms',
      'DOMParser API for XML syntax validation and bi-directional graph conversion',
      'High-resolution requestAnimationFrame and timer loop for packet burst simulator',
      'Real-time QoS metrics calculations (loss %, delay ms, throughput pkts/sec)',
    ],
    codeSamplePreview: `const path = computeDijkstra(topology, "R1", "R4");\nconsole.log("Shortest Cost:", path.totalCost); // 4`,
  },
  {
    id: 'xml',
    name: 'XML (Extensible Markup Language)',
    category: 'Configuration & Data',
    badge: 'Topology Persistence',
    version: 'XML 1.0 (UTF-8)',
    roleInProject: 'Stores network topology (routers, connections, link costs, bandwidth) in a standardized hierarchical file format.',
    syllabusAlignment: 'Specifically mandated in CN Lab syllabus to persist network configuration without external databases.',
    keyFeatures: [
      'Clean schema: <network><router id="R1".../><connection><cost>4</cost>...</connection></network>',
      'No complex database driver or server setup needed',
      'Easily parsed by both Java (DOM/SAX/JAXB) and JavaScript (DOMParser)',
      'Exportable as network.xml for lab manual records and cross-system testing',
    ],
    codeSamplePreview: `<network>\n  <router id="R1" name="Router 1"/>\n  <connection>\n    <source>R1</source><destination>R3</destination><cost>3</cost>\n  </connection>\n</network>`,
  },
  {
    id: 'java',
    name: 'Java (JDK)',
    category: 'Backend & Algorithms',
    badge: 'Core Networking Engine',
    version: 'JDK 17 / 21 LTS',
    roleInProject: 'Implements algorithmic logic: Dijkstra.java, DistanceVector.java, PacketSimulation.java, and LeakyBucket.java.',
    syllabusAlignment: 'Core programming language of Computer Networks laboratory practical curriculum.',
    keyFeatures: [
      'Dijkstra Single-Source Shortest Path using adjacency matrices and greedy relaxation',
      'Bellman-Ford equation: D_x(y) = min_v { c(x,v) + D_v(y) } for distance vector tables',
      'Leaky Bucket class modelling constant leak rates and overflow packet drops',
      'Includes simulated in-browser JVM runner to demonstrate execution to the examiner',
    ],
    codeSamplePreview: `public class Dijkstra {\n  public static Result findShortestPath(int[][] graph, int src, int dest, int n) {\n    // Relaxation loop\n  }\n}`,
  },
  {
    id: 'tomcat',
    name: 'Apache Tomcat',
    category: 'Server & Runtime',
    badge: 'Java Web Server',
    version: 'Tomcat 10 / 9',
    roleInProject: 'Serves as the Java servlet container hosting RoutingServlet.java to bridge HTTP frontend calls to Java algorithms.',
    syllabusAlignment: 'Standard enterprise Java servlet engine taught in university curriculum.',
    keyFeatures: [
      'Java Servlet API handling GET/POST requests from frontend JavaScript fetch()',
      'JSON response serializer sending calculated routes and costs back to web UI',
      'Decoupled client-server architecture mimicking production networking appliances',
      'web.xml descriptor mapping servlet URL patterns like /api/routing',
    ],
    codeSamplePreview: `@WebServlet("/api/routing")\npublic class RoutingServlet extends HttpServlet {\n  protected void doGet(...) { /* JSON response */ }\n}`,
  },
  {
    id: 'ns2',
    name: 'NS-2 / NS-3 Network Simulator',
    category: 'Tooling & Protocols',
    badge: 'Network Simulation TCL',
    version: 'NS-2.35 / NS-3',
    roleInProject: 'Generates OTcl / TCL simulation scripts to run trace file simulations in NS-2 Network Animator (NAM).',
    syllabusAlignment: 'Directly aligns with university CN Lab NS-2 simulation experiments (UDP/CBR/DropTail).',
    keyFeatures: [
      'Generates duplex-link statements with exact costs and delays',
      'Sets routing protocol to rtproto DV (Distance Vector) or rtproto LS (Link State)',
      'Attaches UDP agents and CBR traffic generators to measure throughput',
      'Exportable .tcl script ready to run with `ns network.tcl`',
    ],
    codeSamplePreview: `$ns duplex-link $n(R1) $n(R3) 100Mb 10ms DropTail\n$ns cost $n(R1) $n(R3) 3`,
  },
  {
    id: 'cisco_ios',
    name: 'Cisco IOS & Routing Protocols',
    category: 'Tooling & Protocols',
    badge: 'Router CLI Syntax',
    version: 'IOS 15.x / OSPF / RIPv2',
    roleInProject: 'Exports realistic Cisco router configuration scripts with OSPF link costs and RIP version 2 commands.',
    syllabusAlignment: 'Demonstrates industry-grade networking application of syllabus algorithms during viva.',
    keyFeatures: [
      'Maps Dijkstra costs to Cisco `ip ospf cost <cost>` commands',
      'Maps Distance Vector to `router rip` and `version 2` neighbor advertisements',
      'Includes interface IP assignments, Loopback0 addresses, and subnets',
      'Proves practical understanding beyond academic textbook formulas',
    ],
    codeSamplePreview: `interface GigabitEthernet0/1\n ip address 192.168.1.1 255.255.255.0\n ip ospf cost 3\n no shutdown`,
  },
  {
    id: 'wireshark',
    name: 'Wireshark Packet Analysis',
    category: 'Tooling & Protocols',
    badge: 'Packet Telemetry',
    version: 'Wireshark v4.x',
    roleInProject: 'Provides packet header structures (IPv4 header, TTL, sequence numbers) matching Wireshark packet captures.',
    syllabusAlignment: 'Aligns with packet tracing and protocol analysis viva questions.',
    keyFeatures: [
      'Illustrates TTL decrements at each router hop (R1 -> R3 -> R4)',
      'Simulates ICMP time exceeded and packet drop capture traces',
      'Calculates TCP window sizing and packet retransmission statistics',
    ],
    codeSamplePreview: `Frame 1: 1514 bytes on wire | IP 192.168.1.1 -> 192.168.4.1 | TTL: 64 -> 63`,
  },
];
