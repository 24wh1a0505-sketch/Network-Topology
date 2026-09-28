# Network Routing and Performance Analyzer (CN Lab External Project)

A complete Computer Networks Lab project built with **HTML, CSS, JavaScript, XML, and Java**.

---

## 🚀 Quick Start Guide (How to Run in VS Code)

### Prerequisites:
1. **Node.js** (Version 18+ or 20+ LTS recommended): Download from [nodejs.org](https://nodejs.org)
2. **Visual Studio Code (VS Code)**: Download from [code.visualstudio.com](https://code.visualstudio.com)
3. **Java Development Kit (JDK 11, 17, or 21)** (Optional, for compiling the Java files directly): Download from [adoptium.net](https://adoptium.net)

---

### Step 1: Extract the ZIP file
1. Right-click the downloaded `.zip` file.
2. Select **"Extract All..."** (Windows) or double-click to unzip (Mac/Linux).
3. Open the extracted project folder.

---

### Step 2: Open Project in VS Code
1. Launch **Visual Studio Code**.
2. Click on **File** ➔ **Open Folder...** (or `Ctrl + K, Ctrl + O`).
3. Select the extracted folder where `package.json` is located.

---

### Step 3: Open Terminal in VS Code
Press:
- **Windows/Linux**: `Ctrl + \`` (backtick, key below Esc)
- **Mac**: `Cmd + \``
- Or from top menu: **Terminal** ➔ **New Terminal**.

---

### Step 4: Install Dependencies
In the VS Code terminal, run:
```bash
npm install
```
*(This downloads packages like React, Vite, Tailwind CSS, Lucide icons, etc.)*

---

### Step 5: Start the Development Server
In the VS Code terminal, run:
```bash
npm run dev
```

You will see output like:
```bash
  VITE v8.3.0  ready in 250 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

---

### Step 6: Open the App in Your Browser
- Open Chrome, Edge, or Firefox.
- Navigate to: **`http://localhost:3000`**
- The full application with interactive Network Topology, Dijkstra, Distance Vector, Packet Simulation, Leaky Bucket, and Java Code viewer will be live!

---

## ☕ How to Compile & Run the Java Backend Code in VS Code

The project includes standalone Java implementations for your CN lab external exam:
- `Dijkstra.java`
- `DistanceVector.java`
- `PacketSimulation.java`
- `LeakyBucket.java`
- `NetworkGraph.java`
- `Main.java`

You can either:
1. **View & Run in Browser**: Click the **"Java Backend"** tab (Tab 07) in the web app and click **"▶ Run Java Code in Browser"**.
2. **Run in VS Code Terminal**:
   Create a folder `backend/` or download the `.java` files from the Java Backend tab:
   ```bash
   # Compile all Java files:
   javac Dijkstra.java DistanceVector.java PacketSimulation.java LeakyBucket.java Main.java

   # Run the driver program:
   java Main
   ```

---

## 📁 Project Architecture & Directory Structure

```text
NetworkRoutingAnalyzer/
├── index.html                 # Main HTML5 entry point
├── package.json               # Node.js project dependencies & scripts
├── vite.config.ts             # Vite build configuration
├── src/
│   ├── main.tsx               # React application mounting
│   ├── App.tsx                # Master container and layout
│   ├── index.css              # Tailwind CSS styling
│   ├── types/
│   │   └── network.ts         # TypeScript data structures (Routers, Edges, Packets)
│   ├── data/
│   │   ├── defaultTopology.ts    # Syllabus R1-R4 & enterprise presets
│   │   ├── topologyExports.ts    # XML, JSON, CSV, Graphviz DOT, NS-2 TCL, Cisco IOS
│   │   ├── javaSourceCode.ts     # Standalone Java classes
│   │   ├── technologiesStack.ts  # Complete technologies mapping & details
│   │   ├── vivaQuestions.ts      # High-scoring viva voce Q&A
│   │   └── presentationSlides.ts # 12-Slide external exam presentation
│   ├── algorithms/
│   │   ├── dijkstra.ts        # Dijkstra Shortest Path algorithm
│   │   ├── distanceVector.ts  # Bellman-Ford Distance Vector routing
│   │   └── leakyBucket.ts     # Leaky Bucket congestion control simulation
│   └── components/
│       ├── Navbar.tsx                  # Global navigation bar
│       ├── NetworkCanvas.tsx           # Interactive draggable SVG canvas
│       ├── TopologyModule.tsx          # Module 1: Topology & XML configuration
│       ├── DijkstraModule.tsx          # Module 2: Dijkstra Shortest Path
│       ├── DistanceVectorModule.tsx    # Module 3: Distance Vector tables
│       ├── PacketSimulationModule.tsx  # Module 4: 100-packet transmission
│       ├── LeakyBucketModule.tsx       # Module 5: Leaky bucket traffic shaper
│       ├── PerformanceDashboard.tsx    # Module 6: Delay, Loss & Throughput
│       ├── JavaCodeViewer.tsx          # Module 7: Java backend & in-browser JVM
│       ├── TechnologiesStackModule.tsx # Module 8: Full technologies stack
│       ├── ExportTopologyModal.tsx     # Multi-format export dialog
│       ├── WalkthroughGuide.tsx        # 8-Step external demonstration script
│       ├── VivaVoceModal.tsx           # External viva voce preparation flashcards
│       └── PresentationModal.tsx       # External PPT slide deck presentation
```

---

## 💡 External Exam Demonstration Checklist (8-Step Script)
1. Open the project in browser (`http://localhost:3000`).
2. Show **Network Topology** (Routers R1, R2, R3, R4 and XML representation).
3. Select **Source = R1**, **Destination = R4**.
4. Click **Compute Shortest Path** (Route: `R1 ➔ R3 ➔ R4`, Cost = `4`).
5. Open **Distance Vector** and show routing table for Router R1.
6. Open **Packet Simulation** (Packets = `100`, Delivered = `94`, Dropped = `6`, Loss = `6%`).
7. Open **Congestion Control** (Incoming = `20`, Capacity = `10`, Leak = `5` $\implies$ Transmitted = `15`, Dropped = `5`).
8. Open **Performance Analysis** and show QoS metrics & export the printable lab record report.
