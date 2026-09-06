import React, { useState, useRef } from 'react';
import {
  X,
  Play,
  ExternalLink,
  Maximize2,
  Minimize2,
  Tv,
  Smartphone,
  Check,
  Sparkles,
} from 'lucide-react';
import { Exercise } from '../types';

interface DemonstrationModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  hasAccess?: boolean;
}

type VideoAspectMode = 'fit' | '16:9' | '9:16' | 'window';

export const DemonstrationModal: React.FC<DemonstrationModalProps> = ({
  exercise,
  onClose,
  hasAccess = false,
}) => {
  const [aspectMode, setAspectMode] = useState<VideoAspectMode>('fit');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  if (!exercise) return null;


  const handleToggleFullscreen = () => {
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen?.().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  // Determine container aspect ratio class based on chosen mode
  // 'fit': 4:3 with generous height aligned to the pop-up modal proportions to prevent cuts
  // '16:9': Widescreen horizontal
  // '9:16': Portrait vertical smartphone format
  // 'window': Auto fills available modal height
  const getAspectClass = () => {
    switch (aspectMode) {
      case '16:9':
        return 'aspect-video min-h-[220px] max-h-[50vh]';
      case '9:16':
        return 'aspect-[9/16] min-h-[380px] max-h-[64vh] max-w-[340px] mx-auto';
      case 'window':
        return 'h-[340px] xs:h-[380px] sm:h-[420px] max-h-[60vh]';
      case 'fit':
      default:
        return 'aspect-[4/3] min-h-[270px] xs:min-h-[300px] sm:min-h-[340px] max-h-[56vh]';
    }
  };

  return (
    <div
      id="demonstration-modal-overlay"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
    >
      <div
        id="demonstration-modal"
        className="w-full max-w-lg max-h-[92vh] bg-[#120907] border border-[#2D2421] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col"
      >
        {/* Header */}
        <div className="p-3.5 sm:p-4 flex items-center justify-between border-b border-[#2D2421] bg-[#120907] shrink-0">
          <div className="min-w-0 pr-2">
            <span className="text-[10px] font-bold text-[#CC0000] uppercase tracking-wider block">
              Demonstração · {exercise.categoryName}
            </span>
            <h3 className="text-sm font-bold text-white uppercase truncate mt-0.5">
              {exercise.name}
            </h3>
          </div>
          <button
            id="btn-close-demo-modal"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg shrink-0 transition-colors bg-[#1A1412] border border-[#2D2421]"
            title="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Aspect Ratio / Window Alignment Controls */}
        <div className="px-3.5 py-2 bg-[#170E0B] border-b border-[#2D2421] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider shrink-0 mr-1 hidden xs:inline">
              Formato:
            </span>
            <button
              id="btn-format-fit"
              onClick={() => setAspectMode('fit')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 shrink-0 ${
                aspectMode === 'fit'
                  ? 'bg-[#CC0000] text-white shadow-sm'
                  : 'bg-[#1A1412] text-zinc-400 border border-[#2D2421] hover:text-white'
              }`}
            >
              <span>Ajustado (Sem Cortes)</span>
            </button>

            <button
              id="btn-format-16-9"
              onClick={() => setAspectMode('16:9')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 shrink-0 ${
                aspectMode === '16:9'
                  ? 'bg-[#CC0000] text-white shadow-sm'
                  : 'bg-[#1A1412] text-zinc-400 border border-[#2D2421] hover:text-white'
              }`}
            >
              <Tv size={11} />
              <span>16:9</span>
            </button>

            <button
              id="btn-format-9-16"
              onClick={() => setAspectMode('9:16')}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 shrink-0 ${
                aspectMode === '9:16'
                  ? 'bg-[#CC0000] text-white shadow-sm'
                  : 'bg-[#1A1412] text-zinc-400 border border-[#2D2421] hover:text-white'
              }`}
            >
              <Smartphone size={11} />
              <span>9:16</span>
            </button>
          </div>

          <button
            id="btn-player-fullscreen"
            onClick={handleToggleFullscreen}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-[#1A1412] transition-colors shrink-0"
            title="Tela cheia"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>

        {/* Video Player Container */}
        <div
          ref={playerContainerRef}
          id="video-player-container"
          className={`relative w-full bg-black flex items-center justify-center overflow-hidden transition-all duration-200 ${getAspectClass()}`}
        >
          {hasAccess ? (
            exercise.videoUrl ? (
              exercise.videoUrl.includes('drive.google.com') ? (
                <iframe
                  id="exercise-video-iframe"
                  src={exercise.videoUrl.replace(/\/view(\?.*)?$/, '/preview')}
                  title={exercise.name}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              ) : (
                <video
                  id="exercise-video-player"
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                  src={exercise.videoUrl}
                >
                  Seu navegador não suporta a reprodução deste vídeo.
                </video>
              )
            ) : (
              <div className="text-center p-6 space-y-2 text-zinc-500">
                <Play size={32} className="mx-auto text-zinc-600" />
                <p className="text-xs">Vídeo demonstrativo preparado para streaming</p>
              </div>
            )
          ) : (
            <div className="text-center p-6 space-y-3 text-zinc-400">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
                <Lock size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white uppercase">Vídeo Bloqueado</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  A visualização deste vídeo é exclusiva para membros com a Base Visual liberada.
                </p>
              </div>
            </div>
          )}
        </div>


        {/* Scrollable Details & Footer */}
        <div className="p-3.5 sm:p-4 bg-[#120907] border-t border-[#2D2421] space-y-3 text-xs overflow-y-auto">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[220px]">
              {exercise.name} · Demonstração
            </span>
            <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-wider shrink-0">
              Página {exercise.pageNumber} · Base Oficial
            </span>
          </div>

          {exercise.notes && (
            <p className="text-zinc-300 leading-relaxed bg-[#1A1412] p-2.5 rounded-xl border border-[#2D2421] text-[11px]">
              {exercise.notes}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 bg-[#1A1412] hover:bg-[#251b18] border border-[#2D2421] text-zinc-200 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-colors"
            >
              Fechar
            </button>
            {hasAccess && exercise.videoUrl && (
              <a
                id="btn-open-drive-video"
                href={exercise.videoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="flex-1 px-3 bg-[#CC0000] hover:bg-red-700 text-white flex items-center justify-center gap-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-950/40"
              >
                <span>Abrir no Drive</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
