import React, { useState } from 'react';
import { TECHNOLOGIES_STACK, TechnologyItem } from '../data/technologiesStack';
import {
  Cpu,
  Layers,
  Server,
  FileCode,
  Network,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Code,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const TechnologiesStackModule: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTech, setSelectedTech] = useState<TechnologyItem>(TECHNOLOGIES_STACK[0]);

  const categories = [
    'All',
    'Frontend & UI',
    'Backend & Algorithms',
    'Configuration & Data',
    'Server & Runtime',
    'Tooling & Protocols',
  ];

  const filteredTech =
    selectedCategory === 'All'
      ? TECHNOLOGIES_STACK
      : TECHNOLOGIES_STACK.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Project Technologies & Architecture Stack</span>
            </h2>
            <p className="text-xs text-slate-400">
              Detailed mapping of all technologies relevant to the CN Lab External Examination project.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300">
            <span>Tech Count: {TECHNOLOGIES_STACK.length} Technologies</span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-800/80 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Technology Cards & Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Technology Cards List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
          {filteredTech.map((tech) => {
            const isSelected = selectedTech.id === tech.id;
            return (
              <div
                key={tech.id}
                onClick={() => setSelectedTech(tech)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/70 shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>{tech.name}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                    {tech.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {tech.roleInProject}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                  <span>{tech.category}</span>
                  {tech.version && <span>{tech.version}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Technology Full Inspector */}
        <div className="lg:col-span-7 bg-slate-900/50 p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{selectedTech.name}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/60">
                  {selectedTech.badge}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                Category: {selectedTech.category} {selectedTech.version ? `• ${selectedTech.version}` : ''}
              </span>
            </div>
          </div>

          {/* Role in Project */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
              1. Exact Role in Project Architecture:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
              {selectedTech.roleInProject}
            </p>
          </div>

          {/* Syllabus & Viva Alignment */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              2. Lab Syllabus & External Viva Alignment:
            </span>
            <p className="text-xs text-amber-200/90 leading-relaxed bg-amber-950/30 p-3 rounded-xl border border-amber-900/40">
              {selectedTech.syllabusAlignment}
            </p>
          </div>

          {/* Key Features Bullet List */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              3. Implementation Highlights:
            </span>
            <div className="space-y-1.5">
              {selectedTech.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Code Preview / Syntax Snippet */}
          {selectedTech.codeSamplePreview && (
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                4. Code / Configuration Preview:
              </span>
              <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 overflow-x-auto leading-relaxed">
                <code>{selectedTech.codeSamplePreview}</code>
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Comparison & Architecture Summary Table */}
      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Technologies Summary Table for Lab Record & Viva</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-800 text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-mono">
                <th className="p-2.5 border border-slate-800">Technology</th>
                <th className="p-2.5 border border-slate-800">Category</th>
                <th className="p-2.5 border border-slate-800">Purpose in CN Lab Project</th>
                <th className="p-2.5 border border-slate-800">Examiner Talking Point</th>
              </tr>
            </thead>
            <tbody>
              {TECHNOLOGIES_STACK.map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/70 border-b border-slate-800/80">
                  <td className="p-2.5 border border-slate-800 font-bold text-cyan-400 font-mono">
                    {t.name}
                  </td>
                  <td className="p-2.5 border border-slate-800 text-slate-400">
                    {t.category}
                  </td>
                  <td className="p-2.5 border border-slate-800 text-slate-300">
                    {t.roleInProject}
                  </td>
                  <td className="p-2.5 border border-slate-800 text-amber-300 text-[11px]">
                    {t.badge}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
