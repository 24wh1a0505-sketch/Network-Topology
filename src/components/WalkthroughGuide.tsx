import React, { useState } from 'react';
import { ActiveModule } from './Navbar';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Play,
  RotateCcw,
  X,
  ExternalLink,
} from 'lucide-react';

interface WalkthroughGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateModule: (module: ActiveModule) => void;
  onSetSourceAndDest: (src: string, dest: string) => void;
}

interface Step {
  stepNumber: number;
  title: string;
  module: ActiveModule;
  instruction: string;
  vivaTip: string;
  actionLabel?: string;
  action?: () => void;
}

export const WalkthroughGuide: React.FC<WalkthroughGuideProps> = ({
  isOpen,
  onClose,
  onNavigateModule,
  onSetSourceAndDest,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  if (!isOpen) return null;

  const steps: Step[] = [
    {
      stepNumber: 1,
      title: 'Step 1: Open the Project & Verify Technologies',
      module: 'topology',
      instruction:
        'Introduce the project to the external examiner: "This is the Network Routing and Performance Analyzer built using HTML, CSS, JavaScript, XML, and Java with Apache Tomcat architecture."',
      vivaTip:
        'Mention: "No database is required; the network topology is stored and parsed through XML for lightweight portability."',
    },
    {
      stepNumber: 2,
      title: 'Step 2: Show the Network Topology',
      module: 'topology',
      instruction:
        'Point to the interactive canvas showing routers R1, R2, R3, R4 with the exact syllabus costs: R1-R2=4, R1-R3=3, R1-R4=6, R2-R3=2, R3-R4=1. Drag a router to show real-time graph reactivity, or switch to XML tab to show network.xml.',
      vivaTip:
        'Explain that each router represents an autonomous node and each link has a metric cost and bandwidth.',
    },
    {
      stepNumber: 3,
      title: 'Step 3: Select Source = R1, Destination = R4',
      module: 'dijkstra',
      instruction:
        'Navigate to Dijkstra Routing and set Source = R1 and Destination = R4.',
      vivaTip:
        'Explain why R4 was picked: it allows comparing the direct link (cost 6) against the multi-hop route.',
      actionLabel: 'Set Source R1 & Dest R4',
      action: () => onSetSourceAndDest('R1', 'R4'),
    },
    {
      stepNumber: 4,
      title: 'Step 4: Click Find Shortest Path',
      module: 'dijkstra',
      instruction:
        'Click "Compute" or Step-by-Step. Point out the optimal route: R1 ➔ R3 ➔ R4 with Total Cost = 4 (R1-R3=3 plus R3-R4=1). Show that it is cheaper than direct link R1-R4 (cost 6) and alternative R1-R2-R3-R4 (cost 7).',
      vivaTip:
        'Examiner will ask: "What is the time complexity of Dijkstra?" Answer: "O(V^2) with matrix, or O((V+E) log V) with min-heap."',
    },
    {
      stepNumber: 5,
      title: 'Step 5: Open Distance Vector Routing',
      module: 'distance-vector',
      instruction:
        'Switch to Distance Vector module. Show the routing table for Router R1: Destination R1 (Cost 0), R2 (Cost 4 via R2), R3 (Cost 3 via R3), and R4 (Cost 4 via Next Hop R3).',
      vivaTip:
        'Explain: "Distance Vector uses the Bellman-Ford equation Dx(y) = min_v { c(x,v) + Dv(y) } exchanging vectors with direct neighbors until convergence."',
    },
    {
      stepNumber: 6,
      title: 'Step 6: Open Packet Simulation (Packets = 100)',
      module: 'packet-sim',
      instruction:
        'Navigate to Packet Simulation. Enter Packets = 100. Click "Send Packets" and show packets streaming along R1 ➔ R3 ➔ R4 with checkmarks (Packet 1 ✓, Packet 2 ✓) and final Delivered: 94, Dropped: 6, Loss: 6.0%.',
      vivaTip:
        'Explain: "Packets experience channel jitter and buffer loss. 94 delivered out of 100 represents a 6% packet loss rate."',
    },
    {
      stepNumber: 7,
      title: 'Step 7: Open Congestion Control (Run Leaky Bucket)',
      module: 'leaky-bucket',
      instruction:
        'Navigate to Leaky Bucket module. Show the syllabus parameters: Incoming = 20, Bucket Size = 10, Output Rate = 5 pkts/sec. Click "Run Leaky Bucket". Show output: Transmitted = 15, Dropped = 5.',
      vivaTip:
        'Explain: "Leaky Bucket acts as a traffic shaper with a finite buffer. Since burst 20 exceeds bucket capacity 10, excess 5 packets are dropped to prevent network congestion."',
    },
    {
      stepNumber: 8,
      title: 'Step 8: Show the Performance Analysis Page',
      module: 'performance',
      instruction:
        'Open Performance Dashboard. Show the final QoS summary: Packets Sent: 100, Delivered: 94, Dropped: 6, Average Delay: 25 ms, Throughput: 94 packets/sec, and the graphical bar comparison.',
      vivaTip:
        'Click "Export Lab Record Report" to show the complete formatted experiment write-up for your practical exam submission!',
    },
  ];

  const activeStepData = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const nextData = steps[nextStep - 1];
      onNavigateModule(nextData.module);
      if (nextData.action) nextData.action();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      const prevData = steps[prevStep - 1];
      onNavigateModule(prevData.module);
    }
  };

  const handleGoToStep = (num: number) => {
    setCurrentStep(num);
    const stepData = steps[num - 1];
    onNavigateModule(stepData.module);
    if (stepData.action) stepData.action();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                External Lab Demo Walkthrough (8-Step Script)
              </h3>
              <p className="text-[11px] text-slate-400">
                Follow this exact sequence to present your project confidently to the examiner.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Numbers Bar */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto">
          {steps.map((s) => (
            <button
              key={s.stepNumber}
              onClick={() => handleGoToStep(s.stepNumber)}
              className={`w-7 h-7 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0 transition-all ${
                s.stepNumber === currentStep
                  ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400/50'
                  : s.stepNumber < currentStep
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {s.stepNumber}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-4">
          <div>
            <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
              Step {activeStepData.stepNumber} of 8
            </span>
            <h4 className="text-base font-bold text-white mt-0.5">
              {activeStepData.title}
            </h4>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase block">
              What to Show the Examiner:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {activeStepData.instruction}
            </p>
          </div>

          <div className="bg-amber-950/30 p-3.5 rounded-xl border border-amber-800/50 space-y-1">
            <span className="text-[11px] font-bold text-amber-400 uppercase flex items-center gap-1.5">
              💡 Examiner Viva Voce Tip:
            </span>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {activeStepData.vivaTip}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {activeStepData.actionLabel && (
              <button
                onClick={activeStepData.action}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
              >
                {activeStepData.actionLabel}
              </button>
            )}

            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-md active:scale-95"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Walkthrough</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
