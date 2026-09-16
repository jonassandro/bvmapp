import React, { useState } from 'react';
import { X, BookOpen, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { Material, Exercise } from '../types';

interface MaterialReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  material?: Material | null;
  exerciseRef?: Exercise | null;
  hasAccess?: boolean;
}

export const MaterialReaderModal: React.FC<MaterialReaderModalProps> = ({
  isOpen,
  onClose,
  material,
  exerciseRef,
}) => {
  const [opening, setOpening] = useState(false);

  if (!isOpen) return null;

  const title = material ? material.title : 'Base Visual da Musculação';
  const subtitle = exerciseRef
    ? `Página ${exerciseRef.pageNumber} · Exercício ${exerciseRef.name}`
    : material
    ? `${material.tag} · ${material.type}`
    : 'Guia Oficial de Treinamento';

  const handleOpenPdf = () => {
    setOpening(true);
    const targetUrl = material
      ? (material.URL || material.url || material.directLink)
      : (exerciseRef ? 'https://drive.google.com/file/d/1m7GaV-M3p4zC15NtmMZL22x1PujaNsqQ/view?usp=drivesdk' : '');
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
    setTimeout(() => {
      setOpening(false);
    }, 2000);
  };

  return (
    <div
      id="material-reader-overlay"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="material-reader-modal"
        className="w-full max-w-md bg-[#120907] border border-[#2D2421] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-[#2D2421] bg-[#120907]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#1A1412] border border-[#2D2421] flex items-center justify-center text-zinc-300 shrink-0">
              <BookOpen size={16} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white uppercase truncate">{title}</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider truncate">{subtitle}</p>
            </div>
          </div>
          <button
            id="btn-close-reader-modal"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content area */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Unlocked State */}
          <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-wider">
              <CheckCircle2 size={16} />
              <span>Documento oficial liberado</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              O arquivo PDF oficial está sincronizado e pronto para visualização completa com ilustrações anatômicas e biomecânica.
            </p>
            {exerciseRef && (
              <div className="bg-[#120907] p-2.5 rounded-lg border border-[#2D2421] text-[11px] text-zinc-300 flex items-center gap-2">
                <FileText size={14} className="text-[#CC0000] shrink-0" />
                <span>Exercício localizado na <strong>Página {exerciseRef.pageNumber}</strong></span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <button
              id="btn-confirm-open-pdf"
              onClick={handleOpenPdf}
              disabled={opening}
              className="w-full bg-[#CC0000] hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 disabled:opacity-75"
            >
              <ExternalLink size={15} />
              <span>{opening ? 'Abrindo leitor...' : 'Abrir no Google Drive Oficial'}</span>
            </button>
            <p className="text-[10px] text-zinc-500 text-center">
              O documento será aberto em uma nova aba com zoom e navegação por páginas.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#120907] border-t border-[#2D2421] text-center">
          <button
            onClick={onClose}
            className="text-xs text-zinc-500 hover:text-zinc-300 font-bold uppercase tracking-wider"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
