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
} from 'lucide-react';
import { UserProfile, Material } from '../types';

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

  // Filtrar apenas materiais que o usuário possui acesso ativo
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
    if (!isVisible || !isActive) return false;

    const modId = m.ModuloID || m.moduleId;
    return hasAccess(modId);
  });

  const hasBaseAccess = hasAccess('BASE');

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
    if (type === 'Planilha') return <FileSpreadsheet size={16} className="text-emerald-400" />;
    if (type === 'Imagem') return <ImageIcon size={16} className="text-amber-400" />;
    return <BookOpen size={16} className="text-zinc-400" />;
  };

  return (
    <div id="profile-view" className="space-y-5 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pt-1">
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Meu Perfil</h1>
      </div>

      {/* User Information Card */}
      <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-4 flex items-center gap-3.5 shadow-md">
        {user.photoURL ? (
          <img
            id="profile-user-avatar"
            src={user.photoURL}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full object-cover border border-[#2D2421] shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-zinc-800 border border-[#2D2421] flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user.initials || <UserIcon size={18} />}
          </div>
        )}

        <div className="space-y-1 min-w-0 flex-1">
          <h2 className="text-sm font-bold text-white uppercase tracking-tight truncate">
            {user.name}
          </h2>
          <p className="text-xs text-zinc-400 truncate">{user.email}</p>
          <div className="pt-0.5">
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                hasBaseAccess
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}
            >
              {hasBaseAccess ? <ShieldCheck size={11} /> : <ShieldAlert size={11} />}
              <span>{hasBaseAccess ? 'Acesso Ativo' : 'Acesso Pendente'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meus Conteúdos */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Meus Conteúdos
          </h2>
          <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">
            {myUnlockedMaterials.length} disponíveis
          </span>
        </div>

        {myUnlockedMaterials.length > 0 ? (
          <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl divide-y divide-[#2D2421] overflow-hidden shadow-md">
            {myUnlockedMaterials.map((material) => {
              const matId = material.ID || material.id;
              return (
                <div
                  key={matId}
                  id={`my-content-${matId}`}
                  onClick={() => onSelectMaterial(material)}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#221a17] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#120907] border border-[#2D2421] flex items-center justify-center shrink-0">
                      {getItemIcon(material)}
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
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                      Disponível
                    </span>
                    <ChevronRight size={14} className="text-zinc-500" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-4 text-xs text-zinc-400 space-y-1 shadow-md">
            <p className="font-semibold text-zinc-300">Nenhum conteúdo liberado no momento</p>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Caso tenha acabado de confirmar seu pagamento, toque em "Atualizar acesso" abaixo para sincronizar seus conteúdos.
            </p>
          </div>
        )}
      </div>

      {/* Ações: Atualizar Acesso e Suporte */}
      <div className="space-y-2.5 pt-1">
        <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider px-1">
          Acesso e Suporte
        </label>

        {/* Botão Atualizar Acesso */}
        <button
          id="btn-refresh-access"
          type="button"
          disabled={isRefreshing}
          onClick={handleRefresh}
          className="w-full bg-[#1A1412] hover:bg-[#231b18] active:scale-[0.99] border border-[#2D2421] hover:border-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-between transition-all shadow-md disabled:opacity-50 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <RefreshCw
              size={16}
              className={`text-[#CC0000] ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>{isRefreshing ? 'Atualizando acesso...' : 'Atualizar acesso'}</span>
          </div>
          {refreshSuccess ? (
            <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 size={13} />
              <span>Sincronizado</span>
            </span>
          ) : (
            <span className="text-zinc-500 text-xs font-bold">&gt;</span>
          )}
        </button>

        {/* Botão Ajuda / Suporte */}
        <button
          id="btn-help-support"
          type="button"
          onClick={onOpenHelp}
          className="w-full bg-[#1A1412] hover:bg-[#231b18] active:scale-[0.99] border border-[#2D2421] hover:border-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-between transition-all shadow-md cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle size={16} className="text-zinc-400" />
            <span>Ajuda / Suporte</span>
          </div>
          <span className="text-zinc-500 text-xs font-bold">&gt;</span>
        </button>
      </div>

      {/* Logout Action */}
      {onLogout && (
        <div className="pt-2">
          <button
            id="btn-logout"
            type="button"
            onClick={onLogout}
            className="w-full bg-[#1A1412] hover:bg-red-500/10 border border-[#2D2421] hover:border-red-500/40 text-zinc-400 hover:text-red-400 text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-between transition-all shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <LogOut size={16} />
              <span>Sair</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
