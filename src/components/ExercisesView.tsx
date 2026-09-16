import React, { useMemo } from 'react';
import {
  Search,
  Dumbbell,
  X,
  PlayCircle,
  FileText,
  Lock,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
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

  return (
    <div id="exercises-view" className="space-y-3 pb-8 animate-in fade-in duration-200">
      {/* Header & Results Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase leading-none">
            Exercícios
          </h1>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            149 exercícios ilustrados da musculação
          </p>
        </div>
        <span className="text-[11px] text-zinc-400 bg-[#1A1412] border border-[#2D2421] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
          {filteredExercises.length} de {exercises.length}
        </span>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-3 text-zinc-500 pointer-events-none"
        />
        <input
          id="search-exercises-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nome, músculo ou página..."
          className="w-full bg-[#1A1412] border border-[#2D2421] focus:border-[#CC0000] text-white text-xs rounded-xl pl-9 pr-8 py-2.5 outline-none transition-colors placeholder:text-zinc-500"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-white p-0.5"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Muscle Group Filter Chips */}
      <div
        id="category-filter-chips"
        className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4"
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg whitespace-nowrap border transition-all active:scale-95 shrink-0 ${
                isActive
                  ? 'bg-[#CC0000] border-[#CC0000] text-white'
                  : 'bg-[#1A1412] border-[#2D2421] text-zinc-400 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Exercises List */}
      <div className="space-y-2 pt-1">
        {filteredExercises.length === 0 ? (
          <div className="bg-[#120907] border border-[#2D2421] rounded-2xl p-8 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1A1412] text-zinc-500 flex items-center justify-center mx-auto">
              <Dumbbell size={20} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase">
                Nenhum exercício encontrado
              </h3>
              <p className="text-[11px] text-zinc-500 mt-1">
                Tente ajustar os termos de busca ou selecionar outra categoria.
              </p>
            </div>
            <button
              onClick={() => {
                onSearchChange('');
                onSelectCategory('todos');
              }}
              className="text-xs text-[#CC0000] hover:underline font-bold uppercase tracking-wider"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              id={`exercise-card-${exercise.id}`}
              onClick={() => onSelectExercise(exercise)}
              className="bg-[#1A1412] border border-[#2D2421] hover:border-[#CC0000]/60 rounded-xl p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-[#CC0000] uppercase tracking-wider bg-[#CC0000]/10 border border-[#CC0000]/20 px-1.5 py-0.5 rounded">
                    {exercise.categoryName}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Pág. {exercise.pageNumber}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white uppercase group-hover:text-red-300 transition-colors truncate">
                  {exercise.name}
                </h3>

                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                  {exercise.hasVideo ? (
                    <span className="flex items-center gap-1 text-zinc-400">
                      <PlayCircle size={11} className="text-[#CC0000]" />
                      <span>Vídeo demonstrativo</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-zinc-500">
                      <FileText size={11} />
                      <span>Ilustrado no guia</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="text-zinc-500 group-hover:text-white transition-colors shrink-0">
                <ChevronRight size={16} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
