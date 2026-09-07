import React from 'react';
import { Share, PlusSquare, Compass, Check, X } from 'lucide-react';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallModal: React.FC<IOSInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="ios-install-modal-overlay"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="ios-install-modal"
        className="w-full sm:max-w-md bg-[#0f0f14] border border-[#23232d] rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#23232d] pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#171722] border border-[#2a2a3a] shrink-0 p-1">
              <img
                src="/apple-touch-icon.png"
                alt="Base Visual"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">
                Instalar no iPhone / iPad
              </span>
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                Base Visual da Musculação
              </h3>
            </div>
          </div>

          <button
            id="btn-close-ios-modal"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#181822] hover:bg-[#222230] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Instructions Body */}
        <div className="space-y-3 pt-1 text-xs text-zinc-300">
          <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
            Siga os passos abaixo no navegador Safari para adicionar o app à sua tela de início sem ocupar memória do aparelho:
          </p>

          <ol className="space-y-2.5">
            {/* Step 1 */}
            <li className="flex items-start gap-3 p-2.5 rounded-xl bg-[#14141c] border border-[#23232d]">
              <div className="w-6 h-6 rounded-full bg-[#1e1e2c] border border-[#2e2e42] flex items-center justify-center text-[11px] font-bold text-white shrink-0 mt-0.5">
                1
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Compass size={14} className="text-sky-400" />
                  <span>Abra a Base Visual pelo Safari</span>
                </p>
                <p className="text-[10px] text-zinc-400 leading-normal">
                  Se você estiver dentro de outro aplicativo (como WhatsApp ou Instagram), abra o link diretamente no Safari.
                </p>
              </div>
            </li>

            {/* Step 2 */}
            <li className="flex items-start gap-3 p-2.5 rounded-xl bg-[#14141c] border border-[#23232d]">
              <div className="w-6 h-6 rounded-full bg-[#1e1e2c] border border-[#2e2e42] flex items-center justify-center text-[11px] font-bold text-white shrink-0 mt-0.5">
                2
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Share size={14} className="text-sky-400" />
                  <span>Toque no botão Compartilhar</span>
                </p>
                <p className="text-[10px] text-zinc-400 leading-normal">
                  É o ícone quadrado com uma seta para cima, localizado na barra inferior do Safari.
                </p>
              </div>
            </li>

            {/* Step 3 */}
            <li className="flex items-start gap-3 p-2.5 rounded-xl bg-[#14141c] border border-[#23232d]">
              <div className="w-6 h-6 rounded-full bg-[#1e1e2c] border border-[#2e2e42] flex items-center justify-center text-[11px] font-bold text-white shrink-0 mt-0.5">
                3
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <PlusSquare size={14} className="text-emerald-400" />
                  <span>Escolha ‘Adicionar à Tela de Início’</span>
                </p>
                <p className="text-[10px] text-zinc-400 leading-normal">
                  Role o menu de opções para baixo até encontrar esta opção.
                </p>
              </div>
            </li>

            {/* Step 4 */}
            <li className="flex items-start gap-3 p-2.5 rounded-xl bg-[#14141c] border border-[#23232d]">
              <div className="w-6 h-6 rounded-full bg-[#1e1e2c] border border-[#2e2e42] flex items-center justify-center text-[11px] font-bold text-white shrink-0 mt-0.5">
                4
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Check size={14} className="text-[#e50914]" />
                  <span>Toque em ‘Adicionar’</span>
                </p>
                <p className="text-[10px] text-zinc-400 leading-normal">
                  No canto superior direito da tela. O ícone da Base Visual aparecerá imediatamente no seu celular!
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Footer Button */}
        <div className="pt-2">
          <button
            id="btn-understand-ios"
            type="button"
            onClick={onClose}
            className="w-full bg-[#e50914] hover:bg-[#ff1e27] active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl transition-all shadow-lg shadow-red-950/40 cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
