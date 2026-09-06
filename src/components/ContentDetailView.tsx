import React from 'react';
import {
  ArrowLeft,
  Lock,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  FileSpreadsheet,
  BookOpen,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Material } from '../types';
import { getMaterialMeta, getCheckoutUrl } from '../data/contentCovers';

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
  const matId = material.ID || material.id;
  const modId = material.ModuloID || material.moduleId;
  const meta = getMaterialMeta(matId, modId);
  const checkoutUrl = meta.checkoutUrl || getCheckoutUrl(modId);

  const materialTitle = material.Titulo || material.title;
  const materialDesc = meta.description || material.descricaoCurta || material.subtitle || material.Categoria || material.category || '';
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
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-[11px] font-bold uppercase tracking-wider py-1.5 mb-2 transition-colors cursor-pointer"
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
          {/* Cover Showcase */}
          {meta.coverUrl && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#262634] shadow-xl bg-black">
              <img
                src={meta.coverUrl}
                alt={materialTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f14] via-transparent to-black/30" />
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/90 text-white shadow-lg">
                  <ShieldCheck size={12} />
                  <span>Liberado</span>
                </span>
              </div>
            </div>
          )}

          {/* Header Card */}
          <div className="bg-[#0f0f14] border border-[#23232d] rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck size={12} />
                <span>Disponível no seu acesso</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400 font-bold">
                {matId}
              </span>
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white uppercase leading-tight">
                {materialTitle}
              </h1>
              {materialDesc && (
                <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                  {materialDesc}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-[#23232d] flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="text-zinc-500">Módulo:</span>
              <span className="font-bold text-[#e50914] font-mono">
                {modId}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-500">Formato:</span>
              <span className="font-medium text-zinc-300">
                {material.Tipo || material.type}
              </span>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-[#111116] border border-[#23232d] rounded-2xl p-4.5 shadow-xl space-y-3.5">
            {isSpreadsheet ? (
              /* PLANILHA - MAT005 */
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
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
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                      isImage
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
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
                  className="w-full bg-[#e50914] hover:bg-red-600 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 cursor-pointer"
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
           ================================================== */
        <div className="space-y-4">
          {/* Cover Showcase */}
          {meta.coverUrl && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#262634] shadow-xl bg-black">
              <img
                src={meta.coverUrl}
                alt={materialTitle}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f14] via-transparent to-black/30" />
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/85 backdrop-blur-md border border-red-500/40 text-red-400 shadow-lg">
                  <Lock size={12} className="text-[#e50914]" />
                  <span>Módulo Adicional</span>
                </span>
              </div>
            </div>
          )}

          <div className="bg-[#0f0f14] border border-[#23232d] rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#e50914] bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                Conteúdo adicional
              </span>
              <span className="text-[10px] font-mono text-zinc-500 font-bold">
                {matId}
              </span>
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white uppercase leading-tight">
                {materialTitle}
              </h1>
              {materialDesc && (
                <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                  {materialDesc}
                </p>
              )}
            </div>
          </div>

          {/* Value highlights */}
          {meta.valueHighlights && meta.valueHighlights.length > 0 && (
            <div className="bg-[#111116] border border-[#23232d] rounded-2xl p-4 space-y-2 shadow-md">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                O que você recebe:
              </p>
              <div className="space-y-1.5">
                {meta.valueHighlights.map((hl, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-zinc-200">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Checkout CTA Card */}
          <div className="bg-[#111116] border border-red-500/30 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#e50914] shrink-0 mt-0.5">
                <Lock size={18} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white uppercase">
                  Adicione este módulo à sua conta
                </p>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Liberado de forma totalmente automática no app após a confirmação do pagamento.
                </p>
              </div>
            </div>

            {checkoutUrl ? (
              <a
                id="btn-comprar-detalhe"
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#e50914] hover:bg-red-600 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 text-center cursor-pointer"
              >
                <Sparkles size={14} />
                <span>Desbloquear Agora</span>
                <ExternalLink size={14} />
              </a>
            ) : (
              <button
                id="btn-desbloquear-conteudo"
                type="button"
                onClick={() => onUnlockContent?.(material)}
                className="w-full bg-[#e50914] hover:bg-red-600 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 cursor-pointer"
              >
                <ShieldAlert size={15} />
                <span>Desbloquear conteúdo</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
