import React, { useState } from 'react';
import { Search, ShieldCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

interface HomeViewProps {
  totalExercises: number;
  totalVideos: number;
  totalMaterials: number;
  userBadge?: string;
  hasBaseAccess?: boolean;
  onSearch: (query: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onViewAllExercises: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  totalExercises,
  totalVideos,
  totalMaterials,
  userBadge,
  hasBaseAccess = true,
  onSearch,
  onSelectCategory,
  onViewAllExercises,
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

  return (
    <div id="home-view" className="space-y-5 pb-8 animate-in fade-in duration-200">
      {/* Top Banner Card */}
      <div className="bg-[#120907] rounded-2xl border border-[#2D2421] p-5 shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#CC0000]">Início</h2>
          {hasBaseAccess ? (
            <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/20 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>{userBadge || 'Acesso Ativo'}</span>
            </span>
          ) : (
            <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-widest flex items-center gap-1">
              <ShieldAlert size={12} />
              <span>Acesso Pendente</span>
            </span>
          )}
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white pt-0.5">
          Base Visual da Musculação
        </h1>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Seu acervo de exercícios, treinos e conteúdos em um só lugar.
        </p>
      </div>

      {/* Summary metric cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div
          id="metric-card-exercicios"
          onClick={onViewAllExercises}
          className="bg-[#1A1412] hover:bg-[#231b18] transition-all border border-[#2D2421] hover:border-[#CC0000]/60 rounded-xl p-3 text-center cursor-pointer shadow-md"
        >
          <span className="block text-xl font-bold text-white">{totalExercises}</span>
          <span className="block text-[9px] uppercase text-zinc-500 font-bold tracking-wider mt-0.5">
            Exercícios
          </span>
        </div>

        <div
          id="metric-card-videos"
          onClick={onViewAllExercises}
          className="bg-[#1A1412] hover:bg-[#231b18] transition-all border border-[#2D2421] hover:border-[#CC0000]/60 rounded-xl p-3 text-center cursor-pointer shadow-md"
        >
          <span className="block text-xl font-bold text-white">{totalVideos}</span>
          <span className="block text-[9px] uppercase text-zinc-500 font-bold tracking-wider mt-0.5">
            Vídeos
          </span>
        </div>

        <div
          id="metric-card-materiais"
          className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-3 text-center shadow-md"
        >
          <span className="block text-xl font-bold text-white">{totalMaterials}</span>
          <span className="block text-[9px] uppercase text-zinc-500 font-bold tracking-wider mt-0.5">
            Conteúdos
          </span>
        </div>
      </div>

      {/* Section Busca rápida */}
      <div className="bg-[#120907] rounded-2xl border border-[#2D2421] p-5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Busca Rápida
          </label>
          <Search size={16} className="text-zinc-500" />
        </div>

        <form onSubmit={handleSearchSubmit} className="space-y-3">
          <div className="relative">
            <input
              id="home-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Qual exercício você procura?"
              className="w-full bg-[#1A1412] border border-[#2D2421] rounded-xl py-3 px-4 pr-16 text-sm text-[#EAEAEA] placeholder-zinc-500 focus:outline-none focus:border-[#CC0000] transition-colors"
            >
            </input>
            <button
              id="home-search-button"
              type="submit"
              className="absolute right-2 top-2 bg-[#CC0000] hover:bg-red-700 text-white font-bold p-1.5 px-3 rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1 transition-all shadow-md shadow-red-950/40 cursor-pointer"
            >
              <span>Ir</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </form>
      </div>

      {/* Section Grupos musculares */}
      <div className="bg-[#120907] rounded-2xl border border-[#2D2421] p-5 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Grupos Musculares
          </label>
          <button
            id="btn-view-all-categories"
            type="button"
            onClick={onViewAllExercises}
            className="text-xs font-bold text-[#CC0000] hover:underline uppercase tracking-wider cursor-pointer"
          >
            Ver todos
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {muscleGroups.map((cat, idx) => (
            <button
              key={cat.id}
              id={`group-btn-${cat.id}`}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className="bg-[#1A1412] hover:bg-[#241c19] active:scale-[0.98] border border-[#2D2421] hover:border-[#CC0000] rounded-xl p-3 flex items-center gap-3 transition-all text-left group cursor-pointer"
            >
              <div
                className={`w-2 h-6 rounded-full shrink-0 transition-colors ${
                  idx === 0 ? 'bg-[#CC0000]' : 'bg-zinc-800 group-hover:bg-[#CC0000]'
                }`}
              />
              <span className="text-xs font-bold text-[#EAEAEA] tracking-tight line-clamp-1">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
