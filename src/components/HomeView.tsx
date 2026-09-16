import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  Dumbbell,
  PlayCircle,
  BookOpen,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
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
    <div id="home-view" className="space-y-4 pb-8 animate-in fade-in duration-200">
      {/* Banner de Boas-Vindas */}
      <div className="bg-[#120907] border border-[#2D2421] rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000] bg-[#CC0000]/10 border border-[#CC0000]/20 px-2.5 py-1 rounded">
            Área de Membros
          </span>

          <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            <ShieldCheck size={12} />
            <span>{userBadge || 'Acesso Total'}</span>
          </span>
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase leading-tight">
            Base Visual <span className="text-[#CC0000]">da Musculação</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Consulte exercícios, demonstrações em vídeo e acesse seus guias e fichas de treinamento.
          </p>
        </div>

        {/* Barra de Busca Rápida */}
        <form onSubmit={handleSearchSubmit} className="relative pt-1">
          <input
            id="home-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar exercício (ex: supino, agachamento)..."
            className="w-full bg-[#1A1412] border border-[#2D2421] focus:border-[#CC0000] text-white text-xs rounded-xl pl-9 pr-20 py-2.5 outline-none transition-colors placeholder:text-zinc-500"
          />
          <Search size={15} className="absolute left-3 top-4 text-zinc-500 pointer-events-none" />
          <button
            type="submit"
            className="absolute right-1.5 top-2.5 bg-[#CC0000] hover:bg-[#b30000] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Estatísticas de Acesso */}
      <div className="grid grid-cols-3 gap-2.5">
        <div
          onClick={onViewAllExercises}
          className="bg-[#1A1412] border border-[#2D2421] hover:border-[#CC0000]/50 rounded-xl p-3 text-center cursor-pointer transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-[#CC0000]/10 text-[#CC0000] flex items-center justify-center mx-auto mb-1.5">
            <Dumbbell size={15} />
          </div>
          <div className="text-lg font-bold text-white">{totalExercises}</div>
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Exercícios</div>
        </div>

        <div
          onClick={onViewAllExercises}
          className="bg-[#1A1412] border border-[#2D2421] hover:border-[#CC0000]/50 rounded-xl p-3 text-center cursor-pointer transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-[#CC0000]/10 text-[#CC0000] flex items-center justify-center mx-auto mb-1.5">
            <PlayCircle size={15} />
          </div>
          <div className="text-lg font-bold text-white">{totalVideos}</div>
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Vídeos</div>
        </div>

        <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-3 text-center">
          <div className="w-7 h-7 rounded-lg bg-[#CC0000]/10 text-[#CC0000] flex items-center justify-center mx-auto mb-1.5">
            <BookOpen size={15} />
          </div>
          <div className="text-lg font-bold text-white">{totalMaterials}</div>
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Materiais</div>
        </div>
      </div>

      {/* Grupos Musculares */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Grupos Musculares
          </h2>
          <button
            onClick={onViewAllExercises}
            className="text-[11px] font-bold text-[#CC0000] hover:text-[#ff3333] uppercase tracking-wider flex items-center gap-1"
          >
            <span>Ver Todos</span>
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {muscleGroups.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="bg-[#1A1412] border border-[#2D2421] hover:border-[#CC0000]/50 p-3 rounded-xl flex items-center justify-between text-left transition-all active:scale-[0.98]"
            >
              <div>
                <span className="text-xs font-bold text-white uppercase block">
                  {cat.name}
                </span>
                {cat.exerciseCount !== undefined && (
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {cat.exerciseCount} exercícios
                  </span>
                )}
              </div>
              <ChevronRight size={15} className="text-zinc-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
