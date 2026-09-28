import React, { useState } from 'react';
import { VIVA_QUESTIONS, VivaQuestion } from '../data/vivaQuestions';
import {
  HelpCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface VivaVoceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VivaVoceModal: React.FC<VivaVoceModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'flashcard' | 'list'>('flashcard');

  if (!isOpen) return null;

  const categories = ['All', 'Dijkstra', 'Distance Vector', 'Congestion', 'General CN', 'Project Architecture'];

  const filteredQuestions =
    selectedCategory === 'All'
      ? VIVA_QUESTIONS
      : VIVA_QUESTIONS.filter((q) => q.category === selectedCategory);

  const currentQ: VivaQuestion | undefined = filteredQuestions[activeQuestionIndex] || filteredQuestions[0];

  const handleNext = () => {
    setShowAnswer(false);
    setActiveQuestionIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  const handlePrev = () => {
    setShowAnswer(false);
    setActiveQuestionIndex((prev) =>
      prev === 0 ? filteredQuestions.length - 1 : prev - 1
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col my-6">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                CN Lab External Viva Voce Preparation
              </h3>
              <p className="text-xs text-slate-400">
                Frequently asked external examination questions with high-scoring answers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'flashcard' ? 'list' : 'flashcard')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              {viewMode === 'flashcard' ? 'Show All Q&A List' : 'Flashcard Mode'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveQuestionIndex(0);
                setShowAnswer(false);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Mode: Flashcard */}
        {viewMode === 'flashcard' && currentQ && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">
                {currentQ.category}
              </span>
              <span>
                Card {activeQuestionIndex + 1} of {filteredQuestions.length}
              </span>
            </div>

            {/* Flashcard Body */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 min-h-[220px] flex flex-col justify-between space-y-4 shadow-inner">
              <div>
                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Question:
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {showAnswer ? (
                <div className="space-y-3 pt-3 border-t border-slate-800/80 animate-in fade-in duration-300">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                      Ideal Viva Answer:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                      {currentQ.answer}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                      Key Points to Tell Examiner:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentQ.keyPoints.map((pt, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 px-2 py-0.5 rounded-md"
                        >
                          ✓ {pt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center text-slate-500">
                  <button
                    onClick={() => setShowAnswer(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
                  >
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>Click to Reveal Answer & Key Points</span>
                  </button>
                </div>
              )}
            </div>

            {/* Flashcard Navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Question</span>
              </button>

              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="text-xs text-cyan-400 hover:underline font-medium"
              >
                {showAnswer ? 'Hide Answer' : 'Show Answer'}
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* View Mode: Full List */}
        {viewMode === 'list' && (
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="text-amber-400 font-mono">Q{idx + 1}.</span>
                    <span>{q.question}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 shrink-0">
                    {q.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{q.answer}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {q.keyPoints.map((pt, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 px-1.5 py-0.5 rounded"
                    >
                      ✓ {pt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
