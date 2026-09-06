import React from 'react';
import { ArrowLeft, Lock, ShieldAlert, ShieldCheck, ExternalLink, FileSpreadsheet, BookOpen, Image as ImageIcon } from 'lucide-react';
import { Material } from '../types';

interface ContentDetailViewProps {
  material: Material;
  isUnlocked: boolean;
  onBack: () => void;
  onAccessMaterial: (material: Material) => void;
  onUnlockContent?: (material: Material) => void;
}

export const ContentDetailView: React.FC<ContentDetailViewProps> = ({
  material,
  isUnlocked,
  onBack,
  onAccessMaterial,
  onUnlockContent,
}) => {
  const materialTitle = material.Titulo || material.title;
  const materialDesc = material.descricaoCurta || material.subtitle || material.Categoria || material.category || '';
  const isSpreadsheet = material.Tipo === 'Planilha' || material.type === 'Planilha';
  const isImage = material.Tipo === 'Imagem' || material.type === 'Imagem';

  return (
    <div id="content-detail-view" className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Botão voltar */}
      <div>
        <button
          id="btn-back-content"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-[11px] font-bold uppercase tracking-wider py-1 mb-2 transition-colors active:scale-95"
        >
          <ArrowLeft size={14} />
          <span>Voltar para Conteúdos</span>
        </button>
      </div>

      {isUnlocked ? (
        /* ==================================================
           CONTEÚDOS LIBERADOS
           ================================================== */
        <div className="space-y-4">
          {/* Header Card */}
          <div className="bg-[#120907] border border-[#2D2421] rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded flex items-center gap-1.5">
                <ShieldCheck size={12} />
                <span>Disponível no seu acesso</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-500 font-bold">
                {material.ID || material.id}
              </span>
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-white uppercase leading-tight">
                {materialTitle}
              </h1>
              {materialDesc && (
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {materialDesc}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-[#2D2421] flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="text-zinc-500">Módulo:</span>
              <span className="font-bold text-[#CC0000] font-mono">
                {material.ModuloID || material.moduleId}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-500">Formato:</span>
              <span className="font-medium text-zinc-300">
                {material.Tipo || material.type}
              </span>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-4 shadow-md space-y-3">
            {isSpreadsheet ? (
              /* PLANILHA - MAT005 */
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase">
                      Planilha Interativa
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Controle de RIR, RPE e volume de treino
                    </p>
                  </div>
                </div>

                <button
                  id="btn-abrir-planilha"
                  type="button"
                  onClick={() => onAccessMaterial(material)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
                >
                  <ExternalLink size={15} />
                  <span>Abrir planilha</span>
                </button>
              </div>
            ) : (
              /* PDF OU IMAGEM */
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${
                      isImage
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-green-500/10 border-green-500/20 text-green-400'
                    }`}
                  >
                    {isImage ? <ImageIcon size={20} /> : <BookOpen size={20} />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase">
                      {isImage ? 'Visualização Ilustrada' : 'Leitura e Visualização'}
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Visualizador interno integrado no aplicativo
                    </p>
                  </div>
                </div>

                <button
                  id={isImage ? 'btn-visualizar-material' : 'btn-acessar-material'}
                  type="button"
                  onClick={() => onAccessMaterial(material)}
                  className="w-full bg-[#CC0000] hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 cursor-pointer"
                >
                  {isImage ? <ImageIcon size={15} /> : <BookOpen size={15} />}
                  <span>{isImage ? 'Visualizar material' : 'Acessar material'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ==================================================
           CONTEÚDOS BLOQUEADOS
           Quando o usuário não possuir o moduleId:
           não carregar preview, iframe, URL, PDF, imagem, arquivo.
           Mostrar apenas:
           Nome do conteúdo
           Descrição
           "Conteúdo adicional"
           "Este conteúdo não está incluso no seu acesso."
           Botão: "Desbloquear conteúdo"
           ================================================== */
        <div className="space-y-4">
          <div className="bg-[#120907] border border-[#2D2421] rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-[#1A1412] border border-[#2D2421] px-2.5 py-1 rounded">
                Conteúdo adicional
              </span>
              <span className="text-[10px] font-mono text-zinc-600 font-bold">
                {material.ID || material.id}
              </span>
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-white uppercase leading-tight">
                {materialTitle}
              </h1>
              {materialDesc && (
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {materialDesc}
                </p>
              )}
            </div>
          </div>

          <div className="bg-[#1A1412] border border-red-500/20 rounded-xl p-5 shadow-md space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                <Lock size={18} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white uppercase">
                  Conteúdo Adicional
                </p>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Este material faz parte dos conteúdos complementares da Base Visual da Musculação. Desbloqueie para ter acesso completo.
                </p>
              </div>
            </div>

            <button
              id="btn-desbloquear-conteudo"
              type="button"
              onClick={() => onUnlockContent?.(material)}
              className="w-full bg-[#CC0000] hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 cursor-pointer"
            >
              <ShieldAlert size={15} />
              <span>Desbloquear conteúdo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
