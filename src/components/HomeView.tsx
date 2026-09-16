import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { Material, TabType } from '../types';
import { getMaterialMeta } from '../data/contentCovers';

interface HomeViewProps {
  totalExercises?: number;
  totalVideos?: number;
  totalMaterials?: number;
  userBadge?: string;
  hasBaseAccess?: boolean;
  materials?: Material[];
  hasAccess?: (moduleId: string) => boolean;
  onSelectMaterial?: (material: Material) => void;
  onSearch: (query: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onViewAllExercises: () => void;
  onNavigateTab?: (tab: TabType) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  totalExercises,
  totalVideos,
  totalMaterials,
  userBadge,
  hasBaseAccess = true,
  materials = [],
  hasAccess,
  onSelectMaterial,
  onSearch,
  onSelectCategory,
  onViewAllExercises,
  onNavigateTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    } else {
      onViewAllExercises();
    }
  };

  const muscleGroups = CATEGORIES.filter((c) => c.id !== 'todos');

  // Todos os materiais ativos do catálogo ficam liberados para exibição na Home
  const unlockedMaterials = materials.filter((m) => {
    const isVis =
      m.Visivel_Catalogo === true ||
      m.Visivel_Catalogo === 'SIM' ||
      m.Visivel_Catalogo === 'sim' ||
      m.visibleInCatalog === true;
    const isAct =
      m.Ativo === true ||
      m.Ativo === 'SIM' ||
      m.Ativo === 'sim' ||
      m.active === true;
    return isVis && isAct;
  });

  const popularSearches = ['Supino', 'Agachamento', 'Elevação lateral', 'Remada'];

  return (
    <div id="home-view" className="space-y-5 pb-8 animate-in fade-in duration-200">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0f0f14] border border-[#23232d] p-5 shadow-xl">
        <div className="absolute top-0 right-0 w-44 h-44 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e50914] animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#e50914]">
              Base Visual da Musculação
            </h2>
          </div>

          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck size={12} />
            <span>{userBadge || 'Acesso Total'}</span>
          </span>
        </div>

        <h1 className="text-xl font-extrabold tracking-tight text-white">
          Guia Biomecânico & Fichas de Treino
        </h1>

        <p className="text-xs text-zinc-300 leading-relaxed mt-1.5">
          Consulte demonstrações em vídeo, técnica precisa dos exercícios e seus materiais oficiais.
        </p>
      </div>

      {/* Section Busca rápida */}
      <div className="bg-[#0f0f14] rounded-2xl border border-[#23232d] p-5 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search size={14} className="text-[#e50914]" />
            <label className="text-[10px] uppercase font-bold text-zinc-300 tracking-wider">
              Busca Rápida de Exercícios
            </label>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-2.5">
          <div className="relative">
            <input
              id="home-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Qual exercício você procura hoje?"
              className="w-full bg-[#15151c] border border-[#282834] rounded-xl py-3.5 px-4 pr-16 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914]/40 transition-all shadow-inner"
            />
            <button
              id="home-search-button"
              type="submit"
              className="absolute right-2 top-2 bg-[#e50914] hover:bg-red-600 text-white font-bold p-1.5 px-3.5 rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-red-950/40 cursor-pointer"
            >
              <span>Buscar</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Quick search tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider shrink-0">
              Sugestões:
            </span>
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearchTerm(term);
                  onSearch(term);
                }}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[#16161f] hover:bg-[#20202c] text-zinc-300 hover:text-white border border-[#262632] transition-colors shrink-0 cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* ========================================================
          SEUS CONTEÚDOS LIBERADOS (EM DESTAQUE NA HOME)
         ======================================================== */}
      {unlockedMaterials.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-400" />
              <h2 className="text-xs uppercase font-bold text-white tracking-wider">
                Seus Conteúdos Liberados
              </h2>
            </div>
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('conteudos')}
                className="text-[11px] font-bold text-[#e50914] hover:underline uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
              >
                <span>Ver todos</span>
                <ChevronRight size={12} />
              </button>
            )}
          </div>

          {/* Horizontal scrollable cards for unlocked materials */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
            {unlockedMaterials.slice(0, 4).map((mat) => {
              const matId = mat.ID || mat.id;
              const meta = getMaterialMeta(matId, mat.ModuloID || mat.moduleId);

              return (
                <div
                  key={matId}
                  id={`home-material-${matId}`}
                  onClick={() => onSelectMaterial && onSelectMaterial(mat)}
                  className="group w-52 bg-[#111116] hover:bg-[#16161e] border border-[#23232d] hover:border-zinc-600 rounded-2xl p-3 shrink-0 cursor-pointer transition-all shadow-md"
                >
                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black/60 border border-[#262634] mb-2.5">
                    <img
                      src={meta.coverUrl}
                      alt={mat.Titulo || mat.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 right-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider bg-emerald-500/90 text-white shadow-sm">
                        Disponível
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-white uppercase tracking-tight truncate">
                    {mat.Titulo || mat.title}
                  </h3>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                    {mat.Tipo || mat.type} · Acesso liberado
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section Grupos musculares */}
      <div className="bg-[#0f0f14] rounded-2xl border border-[#23232d] p-5 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Grupos Musculares
          </label>
          <button
            id="btn-view-all-categories"
            type="button"
            onClick={onViewAllExercises}
            className="text-xs font-bold text-[#e50914] hover:underline uppercase tracking-wider cursor-pointer"
          >
            Ver todos
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {muscleGroups.map((cat, idx) => (
            <button
              key={cat.id}
              id={`group-btn-${cat.id}`}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className="bg-[#14141c] hover:bg-[#1b1b24] active:scale-[0.98] border border-[#22222d] hover:border-[#e50914] rounded-xl p-3 flex items-center justify-between transition-all text-left group cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-1.5 h-6 rounded-full shrink-0 transition-colors ${
                    idx === 0 ? 'bg-[#e50914]' : 'bg-zinc-700 group-hover:bg-[#e50914]'
                  }`}
                />
                <span className="text-xs font-bold text-white tracking-tight truncate">
                  {cat.name}
                </span>
              </div>
              <ChevronRight size={13} className="text-zinc-600 group-hover:text-zinc-300 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
