import React, { useState, useEffect } from 'react';
import { PRESENTATION_SLIDES, PresentationSlide } from '../data/presentationSlides';
import {
  Tv,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({ isOpen, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlideIndex((prev) => Math.min(PRESENTATION_SLIDES.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const slide: PresentationSlide = PRESENTATION_SLIDES[currentSlideIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4">
      <div
        className={`bg-slate-950 border border-slate-700 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
          isFullscreen
            ? 'w-full h-full'
            : 'w-full max-w-4xl h-[620px]'
        }`}
      >
        {/* Top Presenter Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Project Presentation (17. PPT Structure)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-2">
              Slide {currentSlideIndex + 1} of {PRESENTATION_SLIDES.length}
            </span>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Canvas */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          {/* Header */}
          <div className="space-y-1 border-b border-slate-800 pb-4">
            <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Slide {slide.id} • CN Lab External Project
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-xs sm:text-sm text-slate-400">{slide.subtitle}</p>
            )}
          </div>

          {/* Points & Diagram */}
          <div className="my-auto py-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {slide.points.map((pt, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800/90 space-y-1 hover:border-slate-700 transition-colors"
                >
                  <h4 className="text-xs sm:text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>{pt.title}</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {pt.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Optional Code or Flow Diagram */}
            {slide.codeOrDiagram && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {slide.codeOrDiagram}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>{slide.footerNote}</span>
            <span>Use Left / Right arrow keys to navigate</span>
          </div>
        </div>

        {/* Bottom Slide Controller */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-900 border-t border-slate-800">
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentSlideIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev Slide</span>
          </button>

          {/* Slide selector pill track */}
          <div className="hidden sm:flex items-center gap-1.5">
            {PRESENTATION_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentSlideIndex
                    ? 'w-6 bg-cyan-400 rounded-lg'
                    : 'bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() =>
              setCurrentSlideIndex((prev) => Math.min(PRESENTATION_SLIDES.length - 1, prev + 1))
            }
            disabled={currentSlideIndex === PRESENTATION_SLIDES.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 transition-colors"
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
