import React, { useState } from 'react';
import {
  Lock,
  RefreshCw,
  LogOut,
  HelpCircle,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface AppUpgradeRequiredViewProps {
  userEmail: string;
  userName?: string;
  onRefreshAccesses: () => Promise<void>;
  onLogout: () => Promise<void>;
  onOpenHelp?: () => void;
}

export const AppUpgradeRequiredView: React.FC<AppUpgradeRequiredViewProps> = ({
  userEmail,
  userName,
  onRefreshAccesses,
  onLogout,
  onOpenHelp,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshSuccess(false);
    try {
      await onRefreshAccesses();
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 4000);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 flex justify-center font-sans antialiased selection:bg-[#e50914] selection:text-white p-4">
      <main
        id="app-upgrade-lock-screen"
        className="w-full max-w-md bg-[#0c0c10] border border-[#1e1e28] rounded-3xl p-6 shadow-2xl flex flex-col justify-between my-auto space-y-6"
      >
        {/* Top Branding */}
        <div className="space-y-4 text-center">
          <div className="relative inline-flex items-center justify-center mx-auto">
            <div className="w-16 h-16 bg-[#161620] border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 shadow-xl shadow-amber-950/20">
              <Smartphone size={32} className="text-amber-400" />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-[#0c0c10] border border-[#2a2a38] rounded-full flex items-center justify-center shadow">
              <Lock size={14} className="text-amber-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              <span>Upgrade do App Necessário</span>
            </div>
            <h1 className="text-lg font-extrabold text-white tracking-tight uppercase">
              Acesso à Versão Aplicativo
            </h1>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
              Sua conta está conectada com sucesso, mas ainda não possui a permissão de acesso à versão aplicativo.
            </p>
          </div>
        </div>

        {/* Informações da Conta Conectada */}
        <div className="bg-[#12121a] border border-[#20202c] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-[#1e1e2a] pb-2.5">
            <span className="text-zinc-500 font-medium">Conta Conectada</span>
            <span className="text-zinc-200 font-semibold truncate max-w-[200px]" title={userEmail}>
              {userEmail}
            </span>
          </div>

          <div className="space-y-2 text-xs text-zinc-400 leading-relaxed pt-1">
            <p>
              O <strong className="text-zinc-200">Aplicativo Base Visual</strong> é um upgrade exclusivo para consultar os treinos, ilustrações biomecânicas e vídeos diretamente no seu celular ou navegador.
            </p>
            <p className="text-[11px] text-zinc-500">
              Caso você tenha acabado de adquirir o Upgrade App, pode levar alguns instantes para a confirmação da compra ser processada.
            </p>
          </div>
        </div>

        {/* Feedback visual de atualização */}
        {refreshSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>Acessos consultados! Se o pedido foi aprovado, sua liberação atualizará automaticamente.</span>
          </div>
        )}

        {/* Ações */}
        <div className="space-y-2.5 pt-1">
          <button
            id="btn-refresh-app-access"
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-full bg-[#e50914] hover:bg-[#ff1e27] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Verificando...' : 'Atualizar Meus Acessos'}</span>
          </button>

          {onOpenHelp && (
            <button
              id="btn-upgrade-help"
              type="button"
              onClick={onOpenHelp}
              className="w-full bg-[#15151f] hover:bg-[#1a1a28] active:scale-[0.99] border border-[#262638] text-zinc-300 hover:text-white font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <HelpCircle size={15} className="text-zinc-400" />
              <span>Dúvidas ou Ajuda com Pedido</span>
            </button>
          )}

          <button
            id="btn-upgrade-logout"
            type="button"
            onClick={onLogout}
            className="w-full bg-transparent hover:bg-[#14141d] active:scale-[0.99] text-zinc-500 hover:text-zinc-300 font-medium text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Entrar com Outro E-mail</span>
          </button>
        </div>

        {/* Rodapé de Segurança */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 pt-2 border-t border-[#181822]">
          <ShieldCheck size={13} className="text-zinc-500" />
          <span>Seus acessos a materiais adquiridos anteriormente continuam seguros</span>
        </div>
      </main>
    </div>
  );
};
