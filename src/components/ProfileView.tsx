import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  MessageSquare,
  Check,
  Sparkles,
  LogOut,
  User as UserIcon,
  Database,
  Lock,
  RefreshCw,
  Info,
  ExternalLink,
} from 'lucide-react';
import { UserProfile, Material, CatalogItem, FirestoreUserAccess, ValidModuleId } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  materials: Material[];
  catalogItems: CatalogItem[];
  userAccesses: FirestoreUserAccess[];
  hasAccess: (moduleId: string) => boolean;
  onGrantModuleDev?: (moduleId: ValidModuleId | string, active: boolean) => Promise<void>;
  onOpenFeedback: () => void;
  onSelectMaterial: (material: Material) => void;
  onSelectLockedItem: (item: CatalogItem) => void;
  onLogout?: () => void;
}

const AVAILABLE_MODULES: { id: ValidModuleId; name: string; desc: string; category: string }[] = [
  {
    id: 'BASE',
    name: 'Base Visual da Musculação',
    desc: 'Biblioteca de 149 exercícios, vídeos demonstrativos e guias anatômicos',
    category: 'Módulo Principal',
  },
  {
    id: 'TREINOS30',
    name: 'Treinos de 30 Minutos',
    desc: 'Rotinas compactas e periodizadas de alta intensidade para rotinas corridas',
    category: 'Série Rápida',
  },
  {
    id: 'PACK48',
    name: 'Pack de 48 Treinos',
    desc: 'Acervo estruturado de 48 sessões completas divididas por grupamento',
    category: 'Treinamento Avançado',
  },
  {
    id: 'PROGRAMA8',
    name: 'Programa de 8 Semanas',
    desc: 'Planejamento progressivo de hipertrofia e definição com evolução semanal',
    category: 'Periodização',
  },
  {
    id: 'TREINOSDIA',
    name: 'Treinos por Dia da Semana',
    desc: 'Divisões ABC, ABCD e ABCDE adaptadas à disponibilidade semanal',
    category: 'Divisão de Treino',
  },
  {
    id: 'NUTRICAO',
    name: 'Guia de Nutrição Básica',
    desc: 'Cálculo de macronutrientes, distribuição calórica e orientações essenciais',
    category: 'Nutrição Esportiva',
  },

];

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  materials,
  catalogItems,
  userAccesses,
  hasAccess,
  onGrantModuleDev,
  onOpenFeedback,
  onSelectMaterial,
  onSelectLockedItem,
  onLogout,
}) => {
  const activeModulesCount = AVAILABLE_MODULES.filter((m) => hasAccess(m.id)).length;
  const isAllActive = activeModulesCount === AVAILABLE_MODULES.length;

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
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                hasAccess('BASE')
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}
            >
              {hasAccess('BASE') ? <ShieldCheck size={11} /> : <ShieldAlert size={11} />}
              <span>{user.badge}</span>
            </div>
            {user.uid && (
              <span className="text-[9px] font-mono text-zinc-500 truncate max-w-[120px]" title={user.uid}>
                UID: {user.uid.slice(0, 8)}...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Módulos do Sistema e Permissões Firestore */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Conteúdos incluídos
          </h2>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            {activeModulesCount} de {AVAILABLE_MODULES.length} liberados
          </span>
        </div>
        <p className="text-xs text-zinc-500 px-1">
          Todos os módulos estão incluídos e liberados para sua conta.
        </p>

        <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl divide-y divide-[#2D2421] overflow-hidden shadow-md">
          {AVAILABLE_MODULES.map((mod) => {
            const active = hasAccess(mod.id);
            return (
              <div
                key={mod.id}
                id={`module-status-row-${mod.id}`}
                className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#221a17] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                      active
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-[#120907] border-[#2D2421] text-zinc-600'
                    }`}
                  >
                    {active ? <ShieldCheck size={16} /> : <Lock size={15} />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-white uppercase truncate">
                        {mod.name}
                      </h3>
                      <span className="text-[9px] font-mono text-zinc-500 px-1 py-0.2 bg-[#120907] rounded border border-[#2D2421]">
                        {mod.id}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{mod.desc}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      active
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-[#120907] text-zinc-500 border-[#2D2421]'
                    }`}
                  >
                    {active ? 'Liberado' : 'Bloqueado'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback Section */}
      <div className="space-y-2 pt-1">
        <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider px-1">
          Feedback
        </label>

        <button
          id="btn-open-feedback"
          onClick={onOpenFeedback}
          className="w-full bg-[#1A1412] hover:bg-[#231b18] active:scale-[0.99] border border-[#2D2421] text-zinc-200 text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-between transition-all shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <MessageSquare size={16} className="text-zinc-400" />
            <span>Enviar feedback sobre o app</span>
          </div>
          <span className="text-zinc-500 font-bold">&gt;</span>
        </button>
      </div>

      {/* Logout Action */}
      {onLogout && (
        <div className="pt-2">
          <button
            id="btn-logout"
            onClick={onLogout}
            className="w-full bg-[#1A1412] hover:bg-red-500/10 border border-[#2D2421] hover:border-red-500/40 text-zinc-400 hover:text-red-400 text-xs font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-between transition-all shadow-md"
          >
            <div className="flex items-center gap-2.5">
              <LogOut size={16} />
              <span>Sair da conta</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
