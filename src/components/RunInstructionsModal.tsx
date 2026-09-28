import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  X,
  Play,
  Code,
  Laptop,
  ExternalLink,
  HelpCircle,
  FileCode,
  Server,
  AlertTriangle,
  FolderGit2,
  CheckCircle2,
  Coffee,
  Globe,
} from 'lucide-react';

interface RunInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RunInstructionsModal: React.FC<RunInstructionsModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'vscode' | 'java' | 'tomcat' | 'troubleshoot'>('vscode');

  if (!isOpen) return null;

  const copyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col my-6 overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>How to Run Project ZIP in Visual Studio Code</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  Lab External Guide
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Complete instructions for running the Web UI, standalone Java files, or Apache Tomcat.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-5 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('vscode')}
            className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'vscode'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>1. VS Code Web App (Vite/Node)</span>
          </button>

          <button
            onClick={() => setActiveTab('java')}
            className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'java'
                ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>2. Java Backend Only (javac/java)</span>
          </button>

          <button
            onClick={() => setActiveTab('tomcat')}
            className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'tomcat'
                ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3. Apache Tomcat Deployment</span>
          </button>

          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`flex items-center gap-2 px-3 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'troubleshoot'
                ? 'border-rose-400 text-rose-300 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>4. Troubleshooting & FAQ</span>
          </button>
        </div>

        {/* Tab 1: VS Code Web App */}
        {activeTab === 'vscode' && (
          <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh] bg-slate-900 text-slate-300 text-xs">
            <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-cyan-200">Prerequisites Check:</strong> Make sure you have installed{' '}
                <a href="https://nodejs.org" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-semibold">Node.js (v18 or v20 LTS)</a> and{' '}
                <a href="https://code.visualstudio.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-semibold">Visual Studio Code</a>.
              </div>
            </div>

            {/* Step 1 */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono">1</span>
                <span>Extract the ZIP Archive</span>
              </div>
              <p className="ml-7 leading-relaxed">
                Right-click the downloaded <code>project.zip</code> ➔ click <strong>&quot;Extract All...&quot;</strong> (on Windows) or double click to extract.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono">2</span>
                <span>Open Folder in Visual Studio Code</span>
              </div>
              <p className="ml-7 leading-relaxed">
                Open <strong>VS Code</strong> ➔ Click <strong>File</strong> ➔ <strong>Open Folder...</strong> (or press <kbd className="px-1.5 py-0.5 bg-slate-950 rounded border border-slate-700 font-mono">Ctrl+K Ctrl+O</kbd>) ➔ select the unzipped project directory that contains <code className="text-cyan-300 font-mono">package.json</code>.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono">3</span>
                <span>Open Terminal in VS Code</span>
              </div>
              <p className="ml-7 leading-relaxed">
                Press <kbd className="px-1.5 py-0.5 bg-slate-950 rounded border border-slate-700 font-mono text-cyan-300">Ctrl + `</kbd> (Windows/Linux) or <kbd className="px-1.5 py-0.5 bg-slate-950 rounded border border-slate-700 font-mono text-cyan-300">Cmd + `</kbd> (Mac), or navigate to top menu: <strong>Terminal ➔ New Terminal</strong>.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono">4</span>
                <span>Install Dependencies</span>
              </div>
              <div className="ml-7 space-y-1.5">
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400">
                  <code>npm install</code>
                  <button
                    onClick={() => copyCode('npm install', 1)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Copy command"
                  >
                    {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  This installs all required packages (React, Vite, Tailwind CSS, Lucide Icons).
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono">5</span>
                <span>Start the Local Development Server</span>
              </div>
              <div className="ml-7 space-y-1.5">
                <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400">
                  <code>npm run dev</code>
                  <button
                    onClick={() => copyCode('npm run dev', 2)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Copy command"
                  >
                    {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono">6</span>
                <span>View Network Routing Analyzer in Browser</span>
              </div>
              <p className="ml-7 leading-relaxed">
                Open Google Chrome, Edge, or Firefox and go to:{' '}
                <code className="text-cyan-300 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  http://localhost:3000
                </code>
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Java Backend */}
        {activeTab === 'java' && (
          <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh] bg-slate-900 text-slate-300 text-xs">
            <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl flex items-start gap-3">
              <Coffee className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200">Standalone Java Execution:</strong> The backend Java source files are available in the <code>Java Backend</code> tab. You can compile and run them directly with standard JDK (Java 8, 11, 17, or 21) in VS Code Terminal or Command Prompt.
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs">Step 1: Verify Java is installed</h4>
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-amber-400">
                <code>java -version</code>
                <button
                  onClick={() => copyCode('java -version', 10)}
                  className="p-1 rounded bg-slate-800 text-slate-300"
                >
                  {copiedIndex === 10 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs">Step 2: Save the Java files in a folder (or copy from Java Backend tab)</h4>
              <p className="text-slate-400">
                Files needed: <code>Dijkstra.java</code>, <code>DistanceVector.java</code>, <code>LeakyBucket.java</code>, <code>PacketSimulation.java</code>, and <code>Main.java</code>.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs">Step 3: Compile all Java classes</h4>
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-amber-400">
                <code>javac Dijkstra.java DistanceVector.java LeakyBucket.java PacketSimulation.java Main.java</code>
                <button
                  onClick={() => copyCode('javac Dijkstra.java DistanceVector.java LeakyBucket.java PacketSimulation.java Main.java', 11)}
                  className="p-1 rounded bg-slate-800 text-slate-300"
                >
                  {copiedIndex === 11 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs">Step 4: Execute the Main Class</h4>
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400">
                <code>java Main</code>
                <button
                  onClick={() => copyCode('java Main', 12)}
                  className="p-1 rounded bg-slate-800 text-slate-300"
                >
                  {copiedIndex === 12 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                This prints Dijkstra shortest paths, Distance Vector routing tables, packet delivery simulation, and Leaky Bucket congestion control metrics directly to the console.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Apache Tomcat */}
        {activeTab === 'tomcat' && (
          <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh] bg-slate-900 text-slate-300 text-xs">
            <div className="p-3 bg-indigo-950/30 border border-indigo-800/40 rounded-xl flex items-start gap-3">
              <Server className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-indigo-200">Apache Tomcat Server Architecture:</strong> If your CN lab examiner asks how to host the project on Apache Tomcat with Java Servlets:
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs">1. Web Application Directory Structure</h4>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                <div>apache-tomcat/webapps/NetworkRoutingAnalyzer/</div>
                <div className="pl-4">├── index.html (Frontend UI)</div>
                <div className="pl-4">├── css/style.css</div>
                <div className="pl-4">├── js/script.js</div>
                <div className="pl-4">├── data/network.xml (Topology XML)</div>
                <div className="pl-4">└── WEB-INF/</div>
                <div className="pl-8">├── web.xml (Servlet mappings)</div>
                <div className="pl-8">└── classes/</div>
                <div className="pl-12">├── RoutingServlet.class</div>
                <div className="pl-12">├── SimulationServlet.class</div>
                <div className="pl-12">└── CongestionServlet.class</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs">2. Compile Servlets with servlet-api.jar</h4>
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-indigo-400">
                <code>javac -cp &quot;%CATALINA_HOME%/lib/servlet-api.jar&quot; RoutingServlet.java</code>
                <button
                  onClick={() => copyCode('javac -cp "%CATALINA_HOME%/lib/servlet-api.jar" RoutingServlet.java', 20)}
                  className="p-1 rounded bg-slate-800 text-slate-300"
                >
                  {copiedIndex === 20 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs">3. Start Apache Tomcat</h4>
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-xs text-indigo-400">
                <code>catalina.bat start (Windows) or ./catalina.sh start (Linux/Mac)</code>
                <button
                  onClick={() => copyCode('catalina.bat start', 21)}
                  className="p-1 rounded bg-slate-800 text-slate-300"
                >
                  {copiedIndex === 21 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Access application at: <code className="text-indigo-300">http://localhost:8080/NetworkRoutingAnalyzer</code>
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Troubleshooting */}
        {activeTab === 'troubleshoot' && (
          <div className="p-6 space-y-4 overflow-y-auto max-h-[65vh] bg-slate-900 text-slate-300 text-xs">
            <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl space-y-1.5">
              <h4 className="font-bold text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Issue 1: &quot;running scripts is disabled on this system&quot; in PowerShell</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                If Windows blocks <code>npm</code>, open PowerShell as Administrator and run:
              </p>
              <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800 font-mono text-emerald-400">
                <code>Set-ExecutionPolicy RemoteSigned -Scope CurrentUser</code>
                <button
                  onClick={() => copyCode('Set-ExecutionPolicy RemoteSigned -Scope CurrentUser', 30)}
                  className="p-1 rounded bg-slate-800 text-slate-300"
                >
                  {copiedIndex === 30 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl space-y-1.5">
              <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Issue 2: &quot;Port 3000 is already in use&quot;</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                Vite will automatically offer another port (e.g. <code>3001</code>). Or specify a port manually:
              </p>
              <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800 font-mono text-emerald-400">
                <code>npm run dev -- --port 3005</code>
                <button
                  onClick={() => copyCode('npm run dev -- --port 3005', 31)}
                  className="p-1 rounded bg-slate-800 text-slate-300"
                >
                  {copiedIndex === 31 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl space-y-1.5">
              <h4 className="font-bold text-cyan-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-cyan-400" />
                <span>Issue 3: &quot;javac is not recognized as an internal or external command&quot;</span>
              </h4>
              <p className="text-slate-300 leading-relaxed">
                You need to install JDK and add Java&apos;s <code>bin</code> folder (e.g. <code>C:\Program Files\Java\jdk-21\bin</code>) to your Windows Environment Variables <code>Path</code>.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Complete guide also in <strong className="text-slate-200 font-mono">README.md</strong></span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
