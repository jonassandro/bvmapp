import React, { useMemo, useRef, useEffect } from 'react';
import { Search, Dumbbell, X, Lock, ShieldAlert } from 'lucide-react';
import { Exercise } from '../types';
import { CATEGORIES } from '../data/mockData';
import { matchesSearch } from '../utils/search';

interface ExercisesViewProps {
  exercises: Exercise[];
  hasBaseAccess?: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export const ExercisesView: React.FC<ExercisesViewProps> = ({
  exercises,
  hasBaseAccess = true,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onSelectExercise,
}) => {
  const chipsContainerRef = useRef<HTMLDivElement>(null);

  // Filter exercises based on category and search query
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchCategory =
        selectedCategory === 'todos' || ex.categoryId === selectedCategory;
      const matchQuery =
        !searchQuery ||
        matchesSearch(ex.name, searchQuery) ||
        matchesSearch(ex.categoryName, searchQuery) ||
        matchesSearch(String(ex.pageNumber), searchQuery) ||
        matchesSearch(ex.id, searchQuery);

      return matchCategory && matchQuery;
    });
  }, [exercises, selectedCategory, searchQuery]);

  // Scroll active chip into view on category change
  useEffect(() => {
    if (chipsContainerRef.current) {
      const activeBtn = chipsContainerRef.current.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedCategory]);

  return (
    <div id="exercises-view" className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-xl font-bold tracking-tight text-white uppercase">Exercícios</h1>
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
          {exercises.length} catalogados
        </span>
      </div>

      {/* Warning banner when BASE module is not active */}
      {!hasBaseAccess && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-300">
          <ShieldAlert size={16} className="shrink-0 text-red-400 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold uppercase tracking-wide text-white text-[11px]">
              Módulo BASE não liberado
            </p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Você pode navegar pelo catálogo dos 149 exercícios, mas a reprodução de vídeos e o guia completo da Base Visual requerem a permissão <strong className="text-white">BASE</strong> ativa no Firestore.
            </p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
        />
        <input
          id="exercise-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Pesquisar exercício..."
          className="w-full bg-[#1A1412] border border-[#2D2421] rounded-xl pl-10 pr-10 py-3 text-sm text-[#EAEAEA] placeholder-zinc-500 focus:outline-none focus:border-[#CC0000] transition-colors"
        />
        {searchQuery && (
          <button
            id="btn-clear-search"
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Horizontal Category Chips */}
      <div
        ref={chipsContainerRef}
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mx-4 px-4"
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              data-active={isActive ? 'true' : 'false'}
              id={`chip-category-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all shrink-0 ${
                isActive
                  ? 'bg-[#CC0000] text-white shadow-md shadow-red-950/40'
                  : 'bg-[#1A1412] text-zinc-400 border border-[#2D2421] hover:text-zinc-200'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Biblioteca Section */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Biblioteca de Exercícios
          </h2>
          <span className="text-[11px] text-zinc-400">
            {filteredExercises.length}{' '}
            {filteredExercises.length === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

        {/* Exercises List */}
        {filteredExercises.length > 0 ? (
          <div className="space-y-2 pt-1">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                id={`exercise-item-${exercise.id}`}
                onClick={() => onSelectExercise(exercise)}
                className="bg-[#1A1412] hover:bg-[#221a17] active:scale-[0.99] border border-[#2D2421] hover:border-[#CC0000]/60 rounded-xl p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-sm"
              >
                {/* Left icon & text */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#120907] border border-[#2D2421] flex items-center justify-center shrink-0 text-zinc-400">
                    <Dumbbell size={16} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white tracking-tight uppercase truncate">
                      {exercise.name}
                    </h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      <span className="font-bold text-zinc-400 uppercase">
                        {exercise.categoryName}
                      </span>{' '}
                      · Página {exercise.pageNumber}
                    </p>
                  </div>
                </div>

                {/* Right indicator */}
                <div className="shrink-0">
                  {exercise.hasVideo ? (
                    hasBaseAccess ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">
                          Vídeo
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#120907] border border-[#2D2421]">
                        <Lock size={10} className="text-zinc-500" />
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                          Bloqueado
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-1.5 px-2 py-1">
                      <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></div>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                        Sem vídeo
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#120907] border border-[#2D2421] rounded-2xl p-8 text-center space-y-3 mt-4">
            <div className="w-12 h-12 rounded-full bg-[#1A1412] border border-[#2D2421] flex items-center justify-center mx-auto text-zinc-500">
              <Search size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-zinc-200 uppercase">
                Nenhum exercício encontrado
              </p>
              <p className="text-xs text-zinc-500">
                Tente buscar por outro termo ou selecione outro grupo muscular.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
