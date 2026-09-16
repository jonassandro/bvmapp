import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, ZoomIn, ZoomOut, RotateCcw, FileText, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { Material } from '../types';

interface MaterialViewerProps {
  material: Material;
  pageRef?: number;
  onBack: () => void;
}

/**
 * Extracts the Google Drive FILE_ID and converts to the embedded preview URL:
 * https://drive.google.com/file/d/FILE_ID/preview
 */
export function getDrivePreviewUrl(url: string): string {
  if (!url) return '';
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  }
  return url;
}

export const MaterialViewer: React.FC<MaterialViewerProps> = ({
  material,
  pageRef,
  onBack,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const isImage = material.Tipo === 'Imagem' || material.type === 'Imagem';
  const originalUrl = material.url || material.URL || material.directLink;
  
  // Para visualização interna, PRIORIZE o asset local existente para MAT003
  const imageSrc =
    material.id === 'MAT003' || material.ID === 'MAT003' || material.materialId === 'MAT003'
      ? '/assets/guia_melhores_exercicios.jpg'
      : material.previewUrl || material.url || material.URL || '/assets/guia_melhores_exercicios.jpg';

  const previewUrl = isImage ? imageSrc : material.previewUrl || getDrivePreviewUrl(originalUrl);
  const materialTitle = material.Titulo || material.title;
  const fileName = material.arquivo;

  const handleOpenExternal = () => {
    if (originalUrl) {
      window.open(originalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 60));
  const handleZoomReset = () => setZoomLevel(100);

  return (
    <div id="material-viewer-screen" className="flex flex-col h-full space-y-3 pb-8 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="bg-[#120907] border border-[#2D2421] rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <button
            id="btn-viewer-back"
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors active:scale-95"
          >
            <ArrowLeft size={16} />
            <span>Voltar</span>
          </button>

          <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded flex items-center gap-1">
            <ShieldCheck size={12} />
            <span>Disponível no seu acesso</span>
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#CC0000] uppercase tracking-widest">
              Visualizador de material
            </span>
            {isImage && (
              <span className="text-[9px] font-bold bg-[#1A1412] text-zinc-400 border border-[#2D2421] px-1.5 py-0.2 rounded">
                Imagem
              </span>
            )}
            {!isImage && (
              <span className="text-[9px] font-bold bg-[#1A1412] text-zinc-400 border border-[#2D2421] px-1.5 py-0.2 rounded">
                PDF
              </span>
            )}
          </div>
          <h1 className="text-lg font-bold text-white uppercase tracking-tight mt-0.5 leading-snug">
            {materialTitle}
          </h1>
          {fileName && (
            <p className="text-[11px] text-zinc-500 font-mono mt-0.5 truncate">
              Arquivo: {fileName}
            </p>
          )}
        </div>

        {/* Toolbar & Secondary External Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#2D2421]">
          {/* Page or Zoom indicator */}
          <div className="flex items-center gap-2">
            {pageRef !== undefined && (
              <span className="text-[11px] font-semibold text-zinc-300 bg-[#1A1412] border border-[#2D2421] px-2.5 py-1 rounded-lg">
                Página: <strong className="text-white">{pageRef}</strong>
              </span>
            )}

            {isImage && (
              <div className="flex items-center gap-1 bg-[#1A1412] border border-[#2D2421] rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  title="Diminuir zoom"
                  className="p-1 text-zinc-400 hover:text-white rounded hover:bg-[#2D2421] transition-colors"
                >
                  <ZoomOut size={14} />
                </button>
                <span className="text-[10px] font-mono font-bold text-zinc-300 px-1.5">
                  {zoomLevel}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  title="Aumentar zoom"
                  className="p-1 text-zinc-400 hover:text-white rounded hover:bg-[#2D2421] transition-colors"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleZoomReset}
                  title="Redefinir zoom"
                  className="p-1 text-zinc-400 hover:text-white rounded hover:bg-[#2D2421] transition-colors"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Secondary Action: Abrir externamente */}
          <button
            id="btn-viewer-open-external"
            type="button"
            onClick={handleOpenExternal}
            className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-[#1A1412] border border-[#2D2421] hover:border-zinc-500 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors active:scale-95 ml-auto"
          >
            <span>Abrir externamente</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {/* Main Viewer Area */}
      {isImage ? (
        <div className="bg-[#120907] border border-[#2D2421] rounded-2xl overflow-hidden shadow-2xl flex flex-col flex-1 min-h-[500px]">
          <div className="p-2 border-b border-[#2D2421] bg-[#1A1412] flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ImageIcon size={14} className="text-[#CC0000]" />
              <span>Guia Visual em Alta Resolução</span>
            </span>
            <span className="text-[10px] text-zinc-500">Role para navegar</span>
          </div>

          <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#0d0706]">
            <div
              style={{
                width: `${zoomLevel}%`,
                transition: 'width 0.15s ease-out',
                maxWidth: zoomLevel <= 100 ? '100%' : 'none',
              }}
              className="flex justify-center"
            >
              <img
                src={previewUrl}
                alt={materialTitle}
                referrerPolicy="no-referrer"
                className="max-w-none w-full h-auto rounded-xl shadow-2xl border border-[#2D2421] object-contain select-none"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#120907] border border-[#2D2421] rounded-2xl overflow-hidden shadow-2xl flex flex-col flex-1 min-h-[600px] h-[calc(100vh-210px)]">
          <div className="p-2.5 border-b border-[#2D2421] bg-[#1A1412] flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
            <span className="flex items-center gap-1.5">
              <FileText size={14} className="text-[#CC0000]" />
              <span>Visualizador Oficial Integrado</span>
            </span>
            <span className="text-[10px] text-zinc-500">Google Drive Preview</span>
          </div>

          <div className="flex-1 w-full h-full bg-[#0a0504] relative">
            <iframe
              id="material-pdf-iframe"
              src={previewUrl}
              title={materialTitle}
              className="w-full h-full border-0"
              allow="autoplay; encrypted-media; fullscreen"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </div>
  );
};
