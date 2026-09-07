import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Sparkles, RefreshCw, X } from 'lucide-react';

export const PWAUpdateToast: React.FC = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // Check for SW updates periodically (e.g. every hour)
        setInterval(() => {
          r.update().catch(() => {});
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.warn('SW registration error', error);
    },
  });

  if (!needRefresh) {
    return null;
  }

  return (
    <aside
      id="pwa-update-toast"
      aria-label="Atualização disponível"
      className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 bg-[#121218]/95 backdrop-blur-xl border border-red-500/30 rounded-2xl p-3.5 shadow-2xl shadow-black/80 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0 text-[#e50914]">
          <Sparkles size={16} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white tracking-tight leading-tight">
            Nova versão disponível
          </p>
          <p className="text-[10px] text-zinc-400 truncate mt-0.5">
            Uma nova versão da Base Visual está pronta.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          id="btn-update-pwa-now"
          type="button"
          onClick={() => updateServiceWorker(true)}
          className="bg-[#e50914] hover:bg-[#ff1e27] active:scale-95 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-red-950/30 cursor-pointer"
        >
          <RefreshCw size={12} />
          <span>Atualizar agora</span>
        </button>

        <button
          id="btn-dismiss-pwa-update"
          type="button"
          onClick={() => setNeedRefresh(false)}
          className="w-7 h-7 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-[#1a1a24] flex items-center justify-center transition-colors cursor-pointer"
          title="Fechar"
        >
          <X size={14} />
        </button>
      </div>
    </aside>
  );
};
