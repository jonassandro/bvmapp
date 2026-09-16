import React, { useState } from 'react';
import {
  ArrowLeft,
  Dumbbell,
  PlayCircle,
  FileText,
  Lock,
  ShieldCheck,
  ShieldAlert,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseDetailViewProps {
  exercise: Exercise;
  hasBaseAccess: boolean;
  onBack: () => void;
  onOpenVideo?: (exercise: Exercise) => void;
  onOpenMaterialRef: (exercise: Exercise) => void;
}

export const ExerciseDetailView: React.FC<ExerciseDetailViewProps> = ({
  exercise,
  hasBaseAccess,
  onBack,
  onOpenVideo,
  onOpenMaterialRef,
}) => {
  const [isVideoExpanded, setIsVideoExpanded] = useState<boolean>(false);

  return (
    <div id="exercise-detail-view" className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Botão voltar */}
      <div>
        <button
          id="btn-back-exercise"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-[11px] font-bold uppercase tracking-wider py-1 mb-2 transition-colors active:scale-95"
        >
          <ArrowLeft size={14} />
          <span>Voltar para Exercícios</span>
        </button>
      </div>

      {/* Header Card */}
      <div className="bg-[#120907] border border-[#2D2421] rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000] bg-[#CC0000]/10 border border-[#CC0000]/20 px-2.5 py-1 rounded flex items-center gap-1.5">
            <Dumbbell size={12} />
            <span>{exercise.categoryName}</span>
          </span>
          <span className="text-[10px] font-mono text-zinc-400 font-bold bg-[#1A1412] border border-[#2D2421] px-2 py-0.5 rounded">
            Pág. {exercise.pageNumber}
          </span>
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase leading-tight">
            {exercise.name}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Exercício cadastrado no Guia Base Visual da Musculação
          </p>
        </div>

        <div className="pt-2 border-t border-[#2D2421] flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Módulo:</span>
            <span className="font-bold text-[#CC0000] font-mono">
              {exercise.moduleId || 'BASE'}
            </span>
          </div>
          <span className="text-zinc-500 font-mono text-[10px]">{exercise.id}</span>
        </div>
      </div>

      {/* Card de Vídeo Demonstrativo */}
      {exercise.hasVideo && (
        <div
          id="card-video-demonstration"
          className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-4 shadow-md space-y-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-[#CC0000]/10 text-[#CC0000] border border-[#CC0000]/20">
                <PlayCircle size={20} />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase text-white">
                  Vídeo de Execução
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Demonstração técnica em vídeo
                </p>
              </div>
            </div>

            <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded border bg-green-500/10 text-green-400 border-green-500/20">
              Liberado
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <button
              id="btn-ver-demonstracao"
              type="button"
              onClick={() => setIsVideoExpanded(!isVideoExpanded)}
              className="w-full py-2.5 px-4 bg-[#CC0000] hover:bg-[#b30000] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>{isVideoExpanded ? 'Ocultar Vídeo' : 'Assistir Vídeo'}</span>
              {isVideoExpanded ? <ChevronUp size={15} /> : <PlayCircle size={15} />}
            </button>

            {isVideoExpanded && exercise.videoUrl && (
              <div
                id="inline-video-container"
                className="w-full rounded-lg overflow-hidden bg-black border border-[#2D2421] shadow-lg animate-in fade-in duration-200"
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
              </div>
            )}
          </div>
        </div>
      )}

      {/* Card de Acesso ao Guia PDF Oficial */}
      <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#120907] border border-[#2D2421] flex items-center justify-center text-[#CC0000]">
              <FileText size={16} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase text-white">
                Guia Ilustrado (PDF)
              </h3>
              <p className="text-[11px] text-zinc-400">
                Página {exercise.pageNumber} no material oficial
              </p>
            </div>
          </div>
        </div>

        <button
          id="btn-open-material-ref"
          type="button"
          onClick={() => onOpenMaterialRef(exercise)}
          className="w-full py-2.5 px-4 bg-[#120907] hover:bg-[#1a0e0b] active:scale-[0.99] border border-[#2D2421] hover:border-[#CC0000]/50 text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <FileText size={14} className="text-[#CC0000]" />
          <span>Abrir Guia na Página</span>
        </button>
      </div>
    </div>
  );
};
