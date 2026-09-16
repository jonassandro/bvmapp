import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  LogOut,
  User as UserIcon,
  RefreshCw,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileSpreadsheet,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  Smartphone,
} from 'lucide-react';
import { UserProfile, Material } from '../types';
import { getMaterialMeta } from '../data/contentCovers';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { IOSInstallModal } from './IOSInstallModal';

interface ProfileViewProps {
  user: UserProfile;
  materials: Material[];
  hasAccess: (moduleId: string) => boolean;
  onRefreshAccesses?: () => Promise<void>;
  onOpenHelp: () => void;
  onSelectMaterial: (material: Material) => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  materials,
  hasAccess,
  onRefreshAccesses,
  onOpenHelp,
  onSelectMaterial,
  onLogout,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [isIOSModalOpen, setIsIOSModalOpen] = useState(false);
  const [androidNotice, setAndroidNotice] = useState<string | null>(null);

  const { isStandalone, isIOS, canInstallNative, install } = usePWAInstall();

  const handleInstallClick = async () => {
    if (isIOS) {
      setIsIOSModalOpen(true);
      return;
    }

    if (canInstallNative) {
      await install();
    } else {
      setAndroidNotice('No menu do navegador (⋮), toque em "Instalar aplicativo" ou "Adicionar à tela inicial".');
      setTimeout(() => setAndroidNotice(null), 5000);
    }
  };


  // Todos os materiais ativos do catálogo ficam liberados para qualquer usuário logado
  const myUnlockedMaterials = materials.filter((m) => {
    const isVisible =
      m.Visivel_Catalogo === true ||
      m.Visivel_Catalogo === 'SIM' ||
      m.Visivel_Catalogo === 'sim' ||
      m.visibleInCatalog === true;
    const isActive =
      m.Ativo === true ||
      m.Ativo === 'SIM' ||
      m.Ativo === 'sim' ||
      m.active === true;
    return isVisible && isActive;
  });

  const hasBaseAccess = hasAccess('BASE');
  const allModulesList = ['BASE', 'TREINOS30', 'PACK48', 'PROGRAMA8', 'TREINOSDIA', 'NUTRICAO'];
  const activeCount = allModulesList.filter((m) => hasAccess(m)).length;
  const hasAll = activeCount === allModulesList.length;

  const handleRefresh = async () => {
    if (!onRefreshAccesses || isRefreshing) return;
    try {
      setIsRefreshing(true);
      setRefreshSuccess(false);
      await onRefreshAccesses();
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao sincronizar acessos:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getItemIcon = (material: Material) => {
    const type = material.Tipo || material.type;
    if (type === 'Planilha') return <FileSpreadsheet size={15} className="text-emerald-400" />;
    if (type === 'Imagem') return <ImageIcon size={15} className="text-amber-400" />;
    return <BookOpen size={15} className="text-zinc-400" />;
  };

  return (
    <div id="profile-view" className="space-y-5 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pt-1">
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Meu Perfil</h1>
      </div>

      {/* User Information Card */}
      <div className="bg-[#0f0f14] border border-[#23232d] rounded-2xl p-4.5 flex items-center gap-3.5 shadow-xl">
        {user.photoURL ? (
          <img
            id="profile-user-avatar"
            src={user.photoURL}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-13 h-13 rounded-full object-cover border-2 border-red-500/30 shrink-0 shadow-md"
          />
        ) : (
          <div className="w-13 h-13 rounded-full bg-gradient-to-br from-[#1c1c28] to-[#121218] border border-[#2e2e3e] flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-md">
            {user.initials || <UserIcon size={20} />}
          </div>
        )}

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-tight truncate">
              {user.name}
            </h2>
          </div>
          <p className="text-xs text-zinc-400 truncate">{user.email}</p>
          <div className="pt-0.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck size={11} />
              <span>Acesso Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meus Conteúdos Liberados */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Meus Conteúdos Liberados
          </h2>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            {myUnlockedMaterials.length} disponíveis
          </span>
        </div>

        {myUnlockedMaterials.length > 0 ? (
          <div className="bg-[#111116] border border-[#23232d] rounded-2xl divide-y divide-[#23232d] overflow-hidden shadow-xl">
            {myUnlockedMaterials.map((material) => {
              const matId = material.ID || material.id;
              const meta = getMaterialMeta(matId, material.ModuloID || material.moduleId);

              return (
                <div
                  key={matId}
                  id={`my-content-${matId}`}
                  onClick={() => onSelectMaterial(material)}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#181822] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-black/50 border border-[#262634] shrink-0">
                      <img
                        src={meta.coverUrl}
                        alt={material.Titulo || material.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-white uppercase truncate">
                        {material.Titulo || material.title}
                      </h3>
                      <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                        {material.descricaoCurta || material.subtitle || material.Tipo || material.type}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 text-zinc-400">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Disponível
                    </span>
                    <ChevronRight size={14} className="text-zinc-500" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#111116] border border-[#23232d] rounded-2xl p-4 text-xs text-zinc-400 space-y-1 shadow-md">
            <p className="font-semibold text-zinc-300">Nenhum conteúdo liberado no momento</p>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Caso tenha acabado de confirmar seu pagamento, toque em "Atualizar acesso" abaixo para sincronizar seus conteúdos.
            </p>
          </div>
        )}
      </div>

      {/* Ações: Atualizar Acesso e Suporte */}
      <div className="space-y-2.5 pt-1">
        <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider px-1">
          Acesso e Suporte
        </label>

        {/* Botão Instalar Base Visual (apenas quando não estiver instalado em modo standalone) */}
        {!isStandalone && (
          <div className="space-y-1.5">
            <button
              id="btn-install-pwa"
              type="button"
              onClick={handleInstallClick}
              className="w-full bg-[#111116] hover:bg-[#181822] active:scale-[0.99] border border-[#2e2e3e] hover:border-red-500/50 text-zinc-100 text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-between transition-all shadow-md cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-[#e50914] group-hover:bg-[#e50914] group-hover:text-white transition-colors">
                  <Smartphone size={14} />
                </div>
                <span>Instalar Base Visual</span>
              </div>
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1 group-hover:text-red-300">
                <span>Instalar</span>
                <ChevronRight size={14} />
              </span>
            </button>

            {androidNotice && (
              <p className="text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 leading-tight">
                {androidNotice}
              </p>
            )}
          </div>
        )}

        {/* Botão Atualizar Acesso */}
        <button
          id="btn-refresh-access"
          type="button"
          disabled={isRefreshing}
          onClick={handleRefresh}
          className="w-full bg-[#111116] hover:bg-[#16161d] active:scale-[0.99] border border-[#23232d] hover:border-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-between transition-all shadow-md disabled:opacity-50 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <RefreshCw
              size={16}
              className={`text-[#e50914] ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>{isRefreshing ? 'Atualizando acesso...' : 'Atualizar acesso'}</span>
          </div>
          {refreshSuccess ? (
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 size={13} />
              <span>Sincronizado</span>
            </span>
          ) : (
            <ChevronRight size={14} className="text-zinc-500" />
          )}
        </button>

        {/* Botão Ajuda / Suporte */}
        <button
          id="btn-help-support"
          type="button"
          onClick={onOpenHelp}
          className="w-full bg-[#111116] hover:bg-[#16161d] active:scale-[0.99] border border-[#23232d] hover:border-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-between transition-all shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle size={16} className="text-zinc-400" />
            <span>Ajuda / Suporte</span>
          </div>
          <ChevronRight size={14} className="text-zinc-500" />
        </button>
      </div>

      {/* iOS Installation Instructions Modal */}
      <IOSInstallModal
        isOpen={isIOSModalOpen}
        onClose={() => setIsIOSModalOpen(false)}
      />

      {/* Logout Action */}
      {onLogout && (
        <div className="pt-2">
          <button
            id="btn-logout"
            type="button"
            onClick={onLogout}
            className="w-full bg-[#111116] hover:bg-red-500/10 border border-[#23232d] hover:border-red-500/40 text-zinc-400 hover:text-red-400 text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-between transition-all shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <LogOut size={16} />
              <span>Sair da conta</span>
            </div>
            <ChevronRight size={14} className="text-zinc-600" />
          </button>
        </div>
      )}
    </div>
  );
};
