import React, { useState } from 'react';
import { JAVA_FILES, JavaCodeFile } from '../data/javaSourceCode';
import {
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  Play,
  FileCode,
  FolderTree,
  Sparkles,
} from 'lucide-react';

export const JavaCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<JavaCodeFile>(JAVA_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [isConsoleRunning, setIsConsoleRunning] = useState<boolean>(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRunJava = () => {
    setIsConsoleRunning(true);
    setConsoleOutput(['$ javac *.java', 'Compiling Dijkstra.java, DistanceVector.java, LeakyBucket.java, Main.java...']);

    setTimeout(() => {
      setConsoleOutput((prev) => [
        ...prev,
        'Compilation successful. Built Main.class [Target: JDK 17 / Apache Tomcat]',
        '$ java Main',
        '',
        '=================================================',
        '   NETWORK ROUTING AND PERFORMANCE ANALYZER      ',
        '         CN Lab External Project Demo           ',
        '=================================================',
        '',
        '>>> MODULE 2: DIJKSTRA\'S SHORTEST PATH',
        'Source: R1, Destination: R4',
        'Optimal Route: R1 ====> R3 ====> R4',
        'Total Shortest Cost: 4',
        '',
        '>>> MODULE 3: DISTANCE VECTOR ROUTING TABLE FOR R1',
        'Destination | Cost | Next Hop',
        '-----------------------------',
        'R1          | 0    | -       ',
        'R2          | 4    | R2      ',
        'R3          | 3    | R3      ',
        'R4          | 4    | R3      ',
        '',
        '>>> MODULE 4: PACKET TRANSMISSION SIMULATION',
        '----------------------------------------',
        '      PACKET TRANSMISSION REPORT        ',
        '----------------------------------------',
        'Packets Sent      : 100',
        'Packets Delivered : 94',
        'Packets Dropped   : 6',
        'Packet Loss       : 6.00%',
        'Average Delay     : 25.00 ms',
        'Throughput        : 94.00 pkts/sec',
        '----------------------------------------',
        '',
        '>>> MODULE 5: LEAKY BUCKET CONGESTION CONTROL',
        'Incoming Packets : 20',
        'Bucket Capacity  : 10',
        'Leak Rate        : 5 pkts/sec',
        'Transmitted      : 15',
        'Dropped          : 5',
        'Remaining Buffer : 0',
        '',
        'All modules executed with return code 0 [JVM Process Terminated].',
      ]);
    }, 700);
  };

  return (
    <div className="space-y-4">
      {/* Header and JVM Console Runner */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Module 7: Java Backend Architecture & Standalone Source Code</span>
            </h2>
            <p className="text-xs text-slate-400">
              Clean, fully commented Java programs implementing all syllabus algorithms with simulated JVM execution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunJava}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-950 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5" />
              <span>▶ Run Java Code in Browser</span>
            </button>
          </div>
        </div>

        {/* File Navigator Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-slate-800/80 no-scrollbar">
          {JAVA_FILES.map((file) => {
            const isSelected = selectedFile.filename === file.filename;
            return (
              <button
                key={file.filename}
                onClick={() => setSelectedFile(file)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-slate-400" />
                <span>{file.filename}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Code Editor & Live Java Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Source Code Viewer */}
        <div className="lg:col-span-7 bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
          {/* File Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white">
                {selectedFile.filename}
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">
                {selectedFile.description}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Syntax Highlighted Code Box */}
          <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto h-[480px] overflow-y-auto selection:bg-cyan-600 selection:text-white">
            <code>{selectedFile.code}</code>
          </pre>
        </div>

        {/* Simulated Java JVM Terminal Console */}
        <div className="lg:col-span-5 bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
          {/* Console Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-slate-200">
                Java Runtime Console (JDK 17)
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
              ● Ready
            </span>
          </div>

          {/* Terminal Window */}
          <div className="p-4 bg-slate-950 text-slate-300 font-mono text-xs leading-relaxed h-[480px] overflow-y-auto space-y-1">
            {consoleOutput.length === 0 ? (
              <div className="text-slate-500 py-16 text-center italic space-y-2">
                <Terminal className="w-8 h-8 text-slate-700 mx-auto" />
                <div>Click &quot;▶ Run Java Code in Browser&quot; above</div>
                <div className="text-[11px] text-slate-600">
                  Executes `javac Main.java` and `java Main` with syllabus test cases
                </div>
              </div>
            ) : (
              consoleOutput.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.startsWith('$')
                      ? 'text-cyan-400 font-bold'
                      : line.startsWith('>>>')
                      ? 'text-amber-400 font-bold'
                      : line.includes('Delivered') || line.includes('Optimal')
                      ? 'text-emerald-400'
                      : line.includes('Dropped')
                      ? 'text-rose-400'
                      : 'text-slate-300'
                  }
                >
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
