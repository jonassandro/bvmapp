import React from 'react';
import { ArrowLeft, ExternalLink, FileText, Image as ImageIcon } from 'lucide-react';
import { Material } from '../types';

interface MaterialViewerProps {
  material: Material;
  onBack: () => void;
}

export const MaterialViewer: React.FC<MaterialViewerProps> = ({ material, onBack }) => {
  const title = material.Titulo || material.title || 'Visualizar Material';
  const category = material.Categoria || material.category || material.tag || 'Material';
  const type = material.Tipo || material.type || 'PDF';
  const isImage = type === 'Imagem';
  const previewUrl =
    material.previewUrl ||
    material.URL ||
    material.url ||
    material.directLink ||
    '';
  const directLink =
    material.URL ||
    material.url ||
    material.directLink ||
    material.previewUrl ||
    '#';

  return (
    <div id="material-viewer-screen" className="flex flex-col h-full space-y-4 pb-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          id="btn-viewer-back"
          onClick={onBack}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-xs font-semibold py-1.5 px-2.5 rounded-lg bg-[#14141c] border border-[#23232d] cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>Voltar</span>
        </button>

        <a
          id="btn-viewer-open-external"
          href={directLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white transition-colors py-1.5 px-3 rounded-lg bg-[#14141c] hover:bg-[#1a1a24] border border-[#23232d] cursor-pointer"
        >
          <span>Abrir no Drive</span>
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Info Card */}
      <div className="bg-[#121218] border border-[#23232d] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#1c1c28] border border-[#2e2e3e] flex items-center justify-center text-[#e50914] shrink-0">
            {isImage ? <ImageIcon size={20} /> : <FileText size={20} />}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white uppercase tracking-tight truncate">
              {title}
            </h2>
            <p className="text-[11px] text-zinc-400 truncate">{category}</p>
          </div>
        </div>

        <span className="text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-[#1c1c28] border border-[#2e2e3e] text-zinc-300 shrink-0">
          {type}
        </span>
      </div>

      {/* Viewer Frame */}
      <div className="flex-1 w-full bg-[#0c0c10] border border-[#23232d] rounded-2xl overflow-hidden shadow-2xl relative min-h-[500px] flex items-center justify-center">
        {isImage ? (
          <img
            src={previewUrl}
            alt={title}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <iframe
            src={previewUrl}
            title={title}
            className="w-full h-full min-h-[500px] border-none"
            allow="autoplay"
          />
        )}
      </div>
    </div>
  );
};
