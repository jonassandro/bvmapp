import React, { useState } from 'react';
import { ArrowLeft, Dumbbell, PlayCircle, FileText, ExternalLink, Sparkles, ChevronUp } from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseDetailViewProps {
  exercise: Exercise;
  hasBaseAccess?: boolean;
  onBack: () => void;
  onOpenVideo?: (exercise: Exercise) => void;
  onOpenMaterialRef: (exercise: Exercise) => void;
  onUnlockContent?: (exercise: Exercise) => void;
}

export const ExerciseDetailView: React.FC<ExerciseDetailViewProps> = ({
  exercise,
  onBack,
  onOpenMaterialRef,
}) => {
  const [isVideoExpanded, setIsVideoExpanded] = useState<boolean>(false);

  return (
    <div id="exercise-detail-view" className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Back button and title */}
      <div>
        <button
          id="btn-back-exercise"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-[11px] font-bold uppercase tracking-wider py-1.5 mb-2 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Voltar para Exercícios</span>
        </button>

        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-extrabold tracking-tight text-white uppercase leading-tight">
            {exercise.name}
          </h1>
        </div>
      </div>

      {/* Metadata card */}
      <div className="bg-[#111116] border border-[#23232d] rounded-2xl p-4 flex items-center gap-3.5 shadow-xl">
        <div className="w-10 h-10 rounded-xl bg-[#161622] border border-[#262634] flex items-center justify-center text-[#e50914] shrink-0">
          <Dumbbell size={18} />
        </div>
        <div className="space-y-0.5 min-w-0">
          <span className="text-[10px] font-bold tracking-wider text-[#e50914] uppercase block">
            {exercise.categoryName}
          </span>
          <p className="text-xs text-zinc-300">
            Registro {exercise.id} · Página {exercise.pageNumber}
          </p>
        </div>
      </div>

      {/* Video Demonstration Card */}
      {exercise.hasVideo && (
        <div
          id="card-video-demonstration"
          className="bg-[#111116] border border-[#23232d] rounded-2xl p-4.5 space-y-3.5 shadow-xl"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#161622] border border-[#262634] flex items-center justify-center shrink-0 mt-0.5 text-[#e50914]">
              <PlayCircle size={22} />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Demonstração disponível
              </h3>
              <p className="text-[10px] text-zinc-400 mt-0.5 font-mono truncate">
                {exercise.videoFileName || `${exercise.name.toUpperCase().replace(/\s+/g, '_')}.mp4`}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              id="btn-ver-demonstracao"
              onClick={() => setIsVideoExpanded(!isVideoExpanded)}
              className="w-full bg-[#e50914] hover:bg-red-600 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 cursor-pointer"
            >
              <span>{isVideoExpanded ? 'Recolher demonstração' : 'Ver demonstração em vídeo'}</span>
              {isVideoExpanded ? <ChevronUp size={15} /> : <PlayCircle size={15} />}
            </button>

            {isVideoExpanded && exercise.videoUrl && (
              <div
                id="inline-video-container"
                className="w-full rounded-xl overflow-hidden bg-black border border-[#262634] shadow-lg animate-in fade-in duration-200"
              >
                <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                  <iframe
                    id="inline-exercise-video-iframe"
                    src={exercise.videoUrl.replace(/\/view(\?.*)?$/, '/preview')}
                    title={exercise.name}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                </div>
                <div className="p-3 bg-[#0d0d12] border-t border-[#23232d] flex items-center justify-between text-[10px] text-zinc-400">
                  <span className="font-mono text-[10px] text-zinc-400 truncate max-w-[200px]">
                    {exercise.videoFileName || `${exercise.name.toUpperCase().replace(/\s+/g, '_')}.mp4`}
                  </span>
                  <a
                    id="btn-open-drive-video-inline"
                    href={exercise.videoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-zinc-400 hover:text-white flex items-center gap-1 font-bold uppercase tracking-wider transition-colors ml-auto"
                  >
                    <span>Abrir no Drive</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Referência na Base Visual card */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Referência na Base Visual
          </label>
        </div>

        <div className="bg-[#111116] border border-[#23232d] rounded-2xl p-4 space-y-3 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#161622] border border-[#262634] flex items-center justify-center text-zinc-400 shrink-0 mt-0.5">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Base Visual da Musculação
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Página {exercise.pageNumber} · Módulo {exercise.moduleId}
              </p>
            </div>
          </div>

          <button
            id="btn-abrir-base-visual"
            onClick={() => onOpenMaterialRef(exercise)}
            className="w-full bg-[#161620] hover:bg-[#1e1e2c] border border-[#262634] hover:border-[#e50914]/60 text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Abrir na Base Visual</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* Execution notes if present */}
      {exercise.notes && (
        <div className="bg-[#111116] border border-[#23232d] rounded-2xl p-4 space-y-1.5 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Sparkles size={14} />
            <span>Ponto de atenção postural</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {exercise.notes}
          </p>
        </div>
      )}
    </div>
  );
};
