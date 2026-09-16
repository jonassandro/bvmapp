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
  FileText,
  Mail,
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
    return <FileText size={16} className="text-[#CC0000]" />;
  };

  const modulesList = [
    { id: 'BASE', name: 'Base Visual (149 Exercícios)', desc: 'Guia oficial e vídeos' },
    { id: 'TREINOS30', name: 'Treinos de 30 Minutos', desc: 'Rotinas express eficientes' },
    { id: 'PACK48', name: 'Pack de 48 Fichas Prontas', desc: 'Treinos para cada objetivo' },
    { id: 'PROGRAMA8', name: 'Programa de 8 Semanas', desc: 'Periodização completa' },
    { id: 'TREINOSDIA', name: 'Treinos por Dia da Semana', desc: 'Divisões de 3 a 6 dias' },
    { id: 'NUTRICAO', name: 'Módulo Nutrição Esportiva', desc: 'Estratégias nutricionais' },
  ];

  return (
    <div id="profile-view" className="space-y-4 pb-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white uppercase leading-none">
          Perfil do Aluno
        </h1>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Gerenciamento de conta e permissões de acesso
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-[#120907] border border-[#2D2421] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-3.5">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-13 h-13 rounded-xl object-cover border border-[#2D2421]"
            />
          ) : (
            <div className="w-13 h-13 rounded-xl bg-[#CC0000] flex items-center justify-center font-extrabold text-white text-lg shadow-sm">
              {user.initials}
            </div>
          )}

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase truncate">
                {user.name}
              </h2>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider bg-green-500/10 border-green-500/20 text-green-400">
                {user.badge || 'Acesso Total'}
              </span>
            </div>

            <p className="text-xs text-zinc-400 flex items-center gap-1.5 truncate">
              <Mail size={12} className="text-zinc-500 shrink-0" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        {/* Action: Sincronizar Perfil */}
        {onRefreshAccesses && (
          <div className="pt-2 border-t border-[#2D2421] flex items-center justify-between">
            <span className="text-[11px] text-zinc-400">
              Sincronizar dados da sua conta?
            </span>
            <button
              id="btn-sync-access"
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CC0000] hover:text-[#ff3333] uppercase tracking-wider disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
              <span>{isRefreshing ? 'Sincronizando...' : 'Atualizar Dados'}</span>
            </button>
          </div>
        )}

        {refreshSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center text-xs text-green-400 font-bold">
            Dados sincronizados com sucesso!
          </div>
        )}
      </div>

      {/* Módulos do Sistema e Permissões */}
      <div className="bg-[#120907] border border-[#2D2421] rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Status dos Módulos
          </h3>
          <span className="text-[10px] text-green-400 font-bold uppercase font-mono">
            Todos os Módulos Liberados
          </span>
        </div>

        <div className="space-y-2">
          {modulesList.map((mod) => (
            <div
              key={mod.id}
              className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-3 flex items-center justify-between gap-3"
            >
              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#CC0000]">
                    {mod.id}
                  </span>
                  <span className="text-xs font-bold text-white uppercase truncate">
                    {mod.name}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">{mod.desc}</p>
              </div>

              <div className="shrink-0">
                <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  <CheckCircle2 size={11} />
                  <span>Liberado</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meus Materiais Disponíveis */}
      {myUnlockedMaterials.length > 0 && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Meus Materiais ({myUnlockedMaterials.length})
          </h3>

          <div className="space-y-2">
            {myUnlockedMaterials.map((mat) => (
              <div
                key={mat.ID || mat.id}
                onClick={() => onSelectMaterial(mat)}
                className="bg-[#1A1412] border border-[#2D2421] hover:border-[#CC0000]/60 rounded-xl p-3 flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99] group"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-7 h-7 rounded-lg bg-[#120907] border border-[#2D2421] flex items-center justify-center shrink-0">
                    {getItemIcon(mat)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-white uppercase truncate block group-hover:text-red-300">
                      {mat.Titulo || mat.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {mat.Tipo || mat.type} · {mat.ModuloID || mat.moduleId}
                    </span>
                  </div>
                </div>

                <ChevronRight size={15} className="text-zinc-500 group-hover:text-white shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opções de Conta / Suporte e Logout */}
      <div className="space-y-2 pt-1">
        <button
          id="btn-suporte-ajuda"
          type="button"
          onClick={onOpenHelp}
          className="w-full bg-[#1A1412] hover:bg-[#221a17] active:scale-[0.99] border border-[#2D2421] text-zinc-300 hover:text-white p-3.5 rounded-xl flex items-center justify-between text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle size={16} className="text-[#CC0000]" />
            <span>Suporte e Dúvidas Frequentes</span>
          </div>
          <ChevronRight size={15} className="text-zinc-500" />
        </button>

        {onLogout && (
          <button
            id="btn-sair-conta"
            type="button"
            onClick={onLogout}
            className="w-full bg-[#1A1412] hover:bg-red-950/20 active:scale-[0.99] border border-red-500/20 text-red-400 p-3.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogOut size={15} />
            <span>Sair da Conta</span>
          </button>
        )}
      </div>
    </div>
  );
};
