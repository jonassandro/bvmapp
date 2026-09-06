import React, { useState } from 'react';
import { X, Lock, ExternalLink, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { CatalogItem } from '../types';

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
  const [showCheckoutInfo, setShowCheckoutInfo] = useState(false);

  if (!item) return null;

  return (
    <div
      id="locked-content-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
    >
      <div
        id="locked-content-modal"
        className="w-full max-w-md bg-[#120907] border border-[#2D2421] rounded-t-3xl sm:rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2D2421] pb-3">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-[#CC0000]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Conteúdo Adicional
            </h2>
          </div>
          <button
            id="btn-close-locked-modal"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Details */}
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-bold text-[#CC0000] uppercase tracking-wider block">
              {item.category || 'Módulo Complementar'}
            </span>
            <h3 className="text-base font-bold text-white uppercase mt-0.5">{item.title}</h3>
          </div>

          <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-3.5 divide-y divide-[#2D2421] text-xs space-y-2">
            <div className="flex justify-between items-center pt-0">
              <span className="text-zinc-500">Formato:</span>
              <span className="text-zinc-200 font-medium">{item.type || 'Guia Digital'}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-zinc-500">Status do Conteúdo:</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#241916] text-[#CC0000] border border-red-500/20">
                <Lock size={10} />
                <span>Conteúdo Adicional</span>
              </span>
            </div>
          </div>

          <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-4 text-xs text-zinc-400 leading-relaxed space-y-2">
            <p className="text-zinc-300 font-medium">
              Este material faz parte dos conteúdos complementares da Base Visual da Musculação.
            </p>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Após a confirmação do pagamento, seu acesso é liberado de forma totalmente automática no aplicativo.
            </p>
          </div>

          {showCheckoutInfo && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3.5 space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 text-green-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 size={14} />
                <span>Liberação Automática</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Adquira este conteúdo utilizando o mesmo e-mail da sua conta para que o acesso seja liberado instantaneamente.
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="space-y-2 pt-2 border-t border-[#2D2421]">
          {!showCheckoutInfo ? (
            <button
              id="btn-desbloquear-modal"
              type="button"
              onClick={() => setShowCheckoutInfo(true)}
              className="w-full bg-[#CC0000] hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 cursor-pointer"
            >
              <ExternalLink size={14} />
              <span>Desbloquear Conteúdo</span>
            </button>
          ) : (
            <button
              id="btn-voltar-desbloquear-modal"
              type="button"
              onClick={onClose}
              className="w-full bg-[#CC0000] hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 cursor-pointer"
            >
              <span>Entendido</span>
            </button>
          )}

          {onGoToProfile && (
            <button
              id="btn-goto-profile-modal"
              type="button"
              onClick={() => {
                onClose();
                onGoToProfile();
              }}
              className="w-full bg-[#1A1412] hover:bg-[#221a17] border border-[#2D2421] text-zinc-300 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
