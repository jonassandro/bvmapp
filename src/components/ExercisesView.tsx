import React, { useMemo, useRef, useEffect } from 'react';
import { Search, Dumbbell, X, Lock, ShieldAlert, Sparkles } from 'lucide-react';
import { Exercise } from '../types';
import { CATEGORIES } from '../data/mockData';
import { matchesSearch } from '../utils/search';
import { MuscleIllustration } from './MuscleIllustration';

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

  // Current category metadata
  const currentCategoryObj = useMemo(() => {
    return CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];
  }, [selectedCategory]);

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
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">Exercícios</h1>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Selecione o grupo muscular para filtrar a biomecânica
          </p>
        </div>
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider bg-[#1A1412] px-2.5 py-1 rounded-md border border-[#2D2421]">
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
          placeholder="Pesquisar exercício por nome ou músculo..."
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

      {/* Visual Muscle Groups Selector with Anatomical Illustrations */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-0.5">
          <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Selecione o Músculo
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            {CATEGORIES.length} grupos
          </span>
        </div>

        <div
          ref={chipsContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 scroll-smooth"
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                data-active={isActive ? 'true' : 'false'}
                id={`chip-category-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-2 min-w-[76px] rounded-xl border transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-b from-[#251512] to-[#170D0B] border-[#CC0000] shadow-lg shadow-red-950/50 scale-[1.02]'
                    : 'bg-[#16100E] border-[#2A1F1C] hover:border-zinc-700 hover:bg-[#1E1614] opacity-80 hover:opacity-100'
                }`}
              >
                {/* Muscle Anatomical Illustration */}
                <div className="relative mb-1 flex items-center justify-center">
                  <MuscleIllustration
                    category={cat.id}
                    isActive={isActive}
                    size={38}
                    className="w-9 h-9 transition-transform duration-200"
                  />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#CC0000] animate-ping" />
                  )}
                </div>

                {/* Name */}
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider text-center line-clamp-1 ${
                    isActive ? 'text-white' : 'text-zinc-400'
                  }`}
                >
                  {cat.name}
                </span>

                {/* Count badge */}
                <span
                  className={`text-[9px] font-mono mt-0.5 ${
                    isActive ? 'text-red-400 font-bold' : 'text-zinc-600'
                  }`}
                >
                  {cat.exerciseCount || exercises.length} ex.
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Muscle Group Indicator Banner */}
      <div className="bg-gradient-to-r from-[#1E1210] to-[#140D0B] border border-[#2E201C] rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0E0807] border border-[#2D2421] flex items-center justify-center shrink-0 shadow-inner">
            <MuscleIllustration
              category={currentCategoryObj.id}
              isActive={true}
              size={34}
              className="w-8 h-8"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000]">
                Músculo Selecionado
              </span>
              <span className="text-[10px] text-zinc-600">·</span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {currentCategoryObj.groupCode || currentCategoryObj.name}
              </span>
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-tight">
              {currentCategoryObj.name}
            </h2>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-extrabold text-white font-mono block">
            {filteredExercises.length}
          </span>
          <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">
            {filteredExercises.length === 1 ? 'exercício' : 'exercícios'}
          </span>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Exercícios Disponíveis
          </h2>
          <span className="text-[11px] text-zinc-400">
            Página 1 a 149
          </span>
        </div>

        {filteredExercises.length > 0 ? (
          <div className="space-y-2 pt-1">
            {filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                id={`exercise-item-${exercise.id}`}
                onClick={() => onSelectExercise(exercise)}
                className="bg-[#16100E] hover:bg-[#201714] active:scale-[0.99] border border-[#2A1F1C] hover:border-[#CC0000]/60 rounded-xl p-3 flex items-center justify-between gap-3 cursor-pointer transition-all shadow-sm group"
              >
                {/* Left muscle mini-illustration & text */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#0E0807] border border-[#2A1F1C] group-hover:border-[#CC0000]/40 flex items-center justify-center shrink-0 p-1 transition-colors">
                    <MuscleIllustration
                      category={exercise.categoryId}
                      isActive={false}
                      size={28}
                      className="w-7 h-7"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white tracking-tight uppercase truncate group-hover:text-red-200 transition-colors">
                      {exercise.name}
                    </h3>
                    <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                      <span className="font-bold text-[#CC0000] uppercase">
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
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">
                          Vídeo
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0E0807] border border-[#2A1F1C]">
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
                        Guia PDF
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
                Tente buscar por outro termo ou selecione outro grupo muscular acima.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
