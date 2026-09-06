import React from 'react';
import { X, Lock, ExternalLink, ArrowLeft, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { CatalogItem } from '../types';
import { getMaterialMeta, getCheckoutUrl } from '../data/contentCovers';

interface LockedContentModalProps {
  item: (CatalogItem & { isBaseRef?: boolean }) | null;
  onClose: () => void;
  onGoToProfile?: () => void;
}

export const LockedContentModal: React.FC<LockedContentModalProps> = ({
  item,
  onClose,
  onGoToProfile,
}) => {
  if (!item) return null;

  const modId = item.moduleId;
  const meta = getMaterialMeta(item.id.replace('LOCKED_', ''), modId);
  const checkoutUrl = item.id === 'LOCKED_BASE_REF' || modId === 'BASE'
    ? undefined
    : (meta.checkoutUrl || getCheckoutUrl(modId));

  return (
    <div
      id="locked-content-modal-overlay"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        id="locked-content-modal"
        className="w-full max-w-md bg-[#0f0f14] border border-[#262632] rounded-t-3xl sm:rounded-2xl p-5 space-y-4 max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom duration-250 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#23232d] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[#e50914]">
              <Lock size={13} />
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Conteúdo Adicional
            </h2>
          </div>
          <button
            id="btn-close-locked-modal"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-[#1a1a24] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Thumbnail Showcase */}
        {meta.coverUrl && (
          <div className="relative rounded-xl overflow-hidden border border-[#262632] aspect-[16/9] shadow-lg bg-black">
            <img
              src={meta.coverUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f14] via-transparent to-black/30" />
            <div className="absolute top-2.5 right-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md border border-red-500/30 text-red-400">
                <Lock size={10} />
                <span>Módulo Exclusivo</span>
              </span>
            </div>
          </div>
        )}

        {/* Content Details */}
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-bold text-[#e50914] uppercase tracking-wider block">
              {item.category || meta.badge}
            </span>
            <h3 className="text-base font-bold text-white uppercase tracking-tight mt-0.5">
              {item.title}
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed mt-1.5">
              {meta.description}
            </p>
          </div>

          {/* Highlights */}
          {meta.valueHighlights && meta.valueHighlights.length > 0 && (
            <div className="bg-[#14141c] border border-[#23232d] rounded-xl p-3.5 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                O que você recebe:
              </p>
              <div className="space-y-1.5">
                {meta.valueHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-zinc-200">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guarantee info */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-300">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Liberado automaticamente na sua conta assim que o pagamento for confirmado pela Yampi.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2 pt-2 border-t border-[#23232d]">
          {checkoutUrl ? (
            <a
              id="btn-buy-checkout-modal"
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#e50914] hover:bg-red-600 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 cursor-pointer text-center"
            >
              <Sparkles size={14} />
              <span>Garantir Acesso Agora</span>
              <ExternalLink size={14} className="ml-0.5" />
            </a>
          ) : (
            <div className="w-full bg-[#1e1e28] text-zinc-300 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl text-center border border-[#2b2b38]">
              Consulte seu plano para liberação
            </div>
          )}

          {onGoToProfile && (
            <button
              id="btn-goto-profile-modal"
              type="button"
              onClick={() => {
                onClose();
                onGoToProfile();
              }}
              className="w-full bg-[#14141c] hover:bg-[#1b1b24] border border-[#23232d] text-zinc-300 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft size={13} />
              <span>Ver meus acessos no Perfil</span>
            </button>
          )}

          <button
            id="btn-cancel-locked-modal"
            type="button"
            onClick={onClose}
            className="w-full text-zinc-500 hover:text-zinc-300 text-xs font-bold uppercase tracking-wider py-2 transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
