import React from 'react';
import { X, RefreshCw, Check, Dumbbell } from 'lucide-react';
import { Exercise, WorkoutLocation, WorkoutLevel } from '../types';
import { EXERCISES } from '../data/mockData';
import { getExerciseSwapOptions } from '../services/workoutEngine';

interface ExerciseSwapModalProps {
  isOpen: boolean;
  currentExerciseId: string | null;
  dayExerciseIds: string[];
  location: WorkoutLocation;
  level: WorkoutLevel;
  onClose: () => void;
  onSelectSwap: (newExercise: Exercise) => void;
}

export const ExerciseSwapModal: React.FC<ExerciseSwapModalProps> = ({
  isOpen,
  currentExerciseId,
  dayExerciseIds,
  location,
  level,
  onClose,
  onSelectSwap,
}) => {
  if (!isOpen || !currentExerciseId) return null;

  const currentExercise = EXERCISES.find((e) => e.id === currentExerciseId);
  const options = getExerciseSwapOptions({
    currentExerciseId,
    dayExerciseIds,
    location,
    level,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="exercise-swap-modal"
        className="bg-[#0f0f15] border border-[#262634] rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#21212d] bg-[#12121a]">
          <div className="flex items-center gap-2">
            <RefreshCw size={18} className="text-[#e50914]" />
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Trocar Exercício
              </h2>
              <p className="text-[11px] text-zinc-400">
                Substitua por outra opção compatível do mesmo grupo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1f1f2a] transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Exercise banner */}
        {currentExercise && (
          <div className="p-3.5 bg-[#171722] border-b border-[#242434] flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Exercício Atual:
              </span>
              <p className="text-xs font-bold text-white truncate">
                {currentExercise.name}
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 uppercase shrink-0">
              {currentExercise.categoryName || currentExercise.categoryId}
            </span>
          </div>
        )}

        {/* Alternatives List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {options.length === 0 ? (
            <div className="text-center py-8 space-y-2 text-zinc-400">
              <Dumbbell size={28} className="mx-auto text-zinc-600 opacity-60" />
              <p className="text-xs font-medium">
                Nenhuma outra variação compatível encontrada para este local.
              </p>
            </div>
          ) : (
            options.map((option) => (
              <div
                key={option.id}
                onClick={() => onSelectSwap(option)}
                className="group p-3 rounded-xl bg-[#14141c] hover:bg-[#1a1a24] border border-[#22222f] hover:border-[#e50914] transition-all flex items-center justify-between cursor-pointer shadow-sm"
              >
                <div className="min-w-0 pr-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {option.id}
                    </span>
                    <span className="text-[9px] font-semibold text-zinc-400 uppercase">
                      {option.categoryName || option.categoryId}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                    {option.name}
                  </h4>
                </div>

                <button
                  type="button"
                  className="shrink-0 bg-[#e50914]/10 group-hover:bg-[#e50914] text-[#e50914] group-hover:text-white p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Check size={14} />
                  <span className="text-[10px] uppercase tracking-wider">Escolher</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#21212d] bg-[#12121a] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white bg-[#1a1a24] hover:bg-[#232332] rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
