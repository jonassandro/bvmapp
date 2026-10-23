import React from 'react';
import { ArrowLeft, Dumbbell, PlayCircle, FileText, ExternalLink, Sparkles, Lock, ShieldAlert } from 'lucide-react';
import { Exercise } from '../types';

import { MuscleIllustration } from './MuscleIllustration';

interface ExerciseDetailViewProps {
  exercise: Exercise;
  hasBaseAccess: boolean;
  onBack: () => void;
  onOpenVideo: (exercise: Exercise) => void;
  onOpenMaterialRef: (exercise: Exercise) => void;
}

export const ExerciseDetailView: React.FC<ExerciseDetailViewProps> = ({
  exercise,
  hasBaseAccess,
  onBack,
  onOpenVideo,
  onOpenMaterialRef,
}) => {
  return (
    <div id="exercise-detail-view" className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Back button and title */}
      <div>
        <button
          id="btn-back-exercise"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-[11px] font-bold uppercase tracking-wider py-1 mb-2 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Voltar para Exercícios</span>
        </button>

        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold tracking-tight text-white uppercase leading-tight">
            {exercise.name}
          </h1>

          {!hasBaseAccess && (
            <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 mt-1">
              <ShieldAlert size={12} />
              <span>BASE Bloqueado</span>
            </span>
          )}
        </div>
      </div>

      {/* Metadata card with muscle illustration */}
      <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-4 flex items-center gap-3.5 shadow-md">
        <div className="w-12 h-12 rounded-xl bg-[#120907] border border-[#2D2421] flex items-center justify-center p-1 shrink-0 shadow-inner">
          <MuscleIllustration
            category={exercise.categoryId}
            isActive={true}
            size={36}
            className="w-9 h-9"
          />
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold tracking-wider text-[#CC0000] uppercase block">
            {exercise.categoryName}
          </span>
          <p className="text-xs text-zinc-300 font-medium">
            Registro <span className="font-mono text-white">{exercise.id}</span> · Página <span className="font-mono text-white">{exercise.pageNumber}</span> do Guia
          </p>
        </div>
      </div>

      {/* Video Demonstration Card */}
      {exercise.hasVideo && (
        <div
          id="card-video-demonstration"
          className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-4 space-y-3.5 shadow-md"
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg bg-[#120907] border border-[#2D2421] flex items-center justify-center shrink-0 mt-0.5 ${hasBaseAccess ? 'text-[#CC0000]' : 'text-zinc-600'}`}>
              {hasBaseAccess ? <PlayCircle size={20} /> : <Lock size={18} />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {hasBaseAccess ? 'Demonstração disponível' : 'Vídeo Demonstrativo'}
                </h3>
                {!hasBaseAccess && (
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#120907] text-zinc-500 border border-[#2D2421]">
                    Bloqueado
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5 font-mono truncate">
                {hasBaseAccess
                  ? (exercise.videoFileName || `${exercise.name.toUpperCase().replace(/\s+/g, '_')}.mp4`)
                  : 'Arquivo protegido · Requer Módulo BASE'}
              </p>
            </div>
          </div>

          {hasBaseAccess ? (
            <button
              id="btn-ver-demonstracao"
              onClick={() => onOpenVideo(exercise)}
              className="w-full bg-[#CC0000] hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40"
            >
              <span>Ver demonstração</span>
              <ExternalLink size={14} />
            </button>
          ) : (
            <button
              id="btn-ver-demonstracao-locked"
              onClick={() => onOpenVideo(exercise)}
              className="w-full bg-[#120907] hover:bg-[#1c1210] border border-red-500/20 text-zinc-400 hover:text-red-400 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Lock size={14} className="text-[#CC0000]" />
              <span>Vídeo Bloqueado · Liberar Módulo BASE</span>
            </button>
          )}
        </div>
      )}

      {/* Referência na Base Visual card */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Referência na Base Visual
          </label>
          {!hasBaseAccess && (
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
              Bloqueado
            </span>
          )}
        </div>

        <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-4 space-y-3 shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#120907] border border-[#2D2421] flex items-center justify-center text-zinc-400 shrink-0 mt-0.5">
              {hasBaseAccess ? <FileText size={18} /> : <Lock size={18} className="text-zinc-600" />}
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Base Visual da Musculação
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Página {exercise.pageNumber} · Módulo {exercise.moduleId}
              </p>
            </div>
          </div>

          {hasBaseAccess ? (
            <button
              id="btn-abrir-base-visual"
              onClick={() => onOpenMaterialRef(exercise)}
              className="w-full bg-[#120907] hover:bg-[#201715] border border-[#2D2421] hover:border-[#CC0000]/60 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <span>Abrir na Base Visual</span>
              <ExternalLink size={14} />
            </button>
          ) : (
            <button
              id="btn-abrir-base-visual-locked"
              onClick={() => onOpenMaterialRef(exercise)}
              className="w-full bg-[#120907] hover:bg-[#1a1210] border border-[#2D2421] text-zinc-500 hover:text-zinc-400 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Lock size={13} />
              <span>Material Bloqueado</span>
            </button>
          )}
        </div>
      </div>

      {/* Execution notes if present */}
      {exercise.notes && (
        <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-4 space-y-1.5 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-500">
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
