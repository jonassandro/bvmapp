import React from 'react';
import { X, Lock, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';
import { CatalogItem } from '../types';

interface LockedContentModalProps {
  item: (CatalogItem & { isBaseRef?: boolean }) | null;
  onClose: () => void;
  onGoToProfile?: () => void;
  onGrantDev?: (moduleId: string) => Promise<void>;
}

export const LockedContentModal: React.FC<LockedContentModalProps> = ({
  item,
  onClose,
  onGoToProfile,
  onGrantDev,
}) => {
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
        <div className="flex items-center justify-between border-b border-[#2D2421] pb-3">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-[#CC0000]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Acesso Bloqueado
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

        {/* Catalog and Permission Details */}
        <div className="space-y-3">
          <div>
            <span className="text-[10px] font-bold text-[#CC0000] uppercase tracking-wider block">
              {item.category || 'Módulo Protegido'}
            </span>
            <h3 className="text-base font-bold text-white uppercase mt-0.5">{item.title}</h3>
          </div>

          <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-3.5 divide-y divide-[#2D2421] text-xs space-y-2">
            <div className="flex justify-between items-center pt-0">
              <span className="text-zinc-500">Módulo Requerido:</span>
              <span className="text-[#CC0000] font-mono font-bold">{item.moduleId}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-zinc-500">Formato:</span>
              <span className="text-zinc-200 font-medium">{item.type || 'Digital'}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-zinc-500">Status Firestore:</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                <ShieldAlert size={11} />
                <span>Bloqueado</span>
              </span>
            </div>
          </div>

          <div className="bg-[#120907] border border-[#2D2421] rounded-xl p-3 text-xs text-zinc-400 leading-relaxed space-y-1">
            <p className="font-semibold text-zinc-300">Regra de Liberação:</p>
            <p className="text-[11px] text-zinc-500">
              Este conteúdo só é liberado se houver um documento ativo na coleção <code className="text-[#CC0000] font-mono">user_access</code> do Firestore com o seu <code className="text-zinc-300 font-mono">userId</code> e <code className="text-zinc-300 font-mono">moduleId: "{item.moduleId}"</code>.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2 pt-2 border-t border-[#2D2421]">
          {onGrantDev && (
            <button
              id="btn-grant-dev-modal"
              onClick={async () => {
                await onGrantDev(item.moduleId);
                onClose();
              }}
              className="w-full bg-[#CC0000] hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40"
            >
              <ShieldCheck size={14} />
              <span>Liberar Módulo {item.moduleId} (Modo Dev)</span>
            </button>
          )}

          {onGoToProfile && (
            <button
              id="btn-goto-profile-modal"
              onClick={() => {
                onClose();
                onGoToProfile();
              }}
              className="w-full bg-[#1A1412] hover:bg-[#221a17] border border-[#2D2421] text-zinc-300 font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <span>Ver meus acessos no Perfil</span>
              <ArrowRight size={13} />
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 py-1 transition-colors uppercase font-bold text-[10px] tracking-wider"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
