import React, { useState } from 'react';
import {
  Bookmark,
  Calendar,
  Clock,
  Dumbbell,
  Trash2,
  Edit2,
  ExternalLink,
  PlusCircle,
  FolderOpen,
  Check,
  X,
  Layers,
} from 'lucide-react';
import { WorkoutPlan } from '../types';

interface MyWorkoutsViewProps {
  workouts: WorkoutPlan[];
  onOpenWorkout: (workout: WorkoutPlan) => void;
  onDeleteWorkout: (workoutId: string) => Promise<void>;
  onRenameWorkout: (workoutId: string, newTitle: string) => Promise<void>;
  onCreateNew: () => void;
}

export const MyWorkoutsView: React.FC<MyWorkoutsViewProps> = ({
  workouts,
  onOpenWorkout,
  onDeleteWorkout,
  onRenameWorkout,
  onCreateNew,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const startRename = (workout: WorkoutPlan) => {
    setEditingId(workout.id);
    setEditTitle(workout.title);
  };

  const confirmRename = async (workoutId: string) => {
    if (editTitle.trim()) {
      await onRenameWorkout(workoutId, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const confirmDelete = async (workoutId: string) => {
    await onDeleteWorkout(workoutId);
    setDeletingId(null);
  };

  return (
    <div id="my-workouts-view" className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-extrabold text-white uppercase tracking-tight">
            Meus Treinos Salvos
          </h1>
          <p className="text-[11px] text-zinc-400">
            Acesse e organize suas fichas de treino personalizadas
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNew}
          className="flex items-center gap-1.5 p-2 px-3 rounded-xl bg-[#e50914] hover:bg-red-600 text-white text-xs font-bold transition-all shadow-md shadow-red-950/40 cursor-pointer active:scale-95"
        >
          <PlusCircle size={14} />
          <span>Novo Treino</span>
        </button>
      </div>

      {/* Workouts List */}
      {workouts.length === 0 ? (
        <div className="rounded-2xl bg-[#0f0f15] border border-[#23232f] p-8 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#171722] border border-[#272738] flex items-center justify-center mx-auto text-zinc-500">
            <Bookmark size={24} className="text-[#e50914]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">
              Nenhum treino salvo ainda
            </h3>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Utilize o Montador de Treinos para gerar sua ficha personalizada e salvá-la aqui.
            </p>
          </div>

          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e50914] hover:bg-red-600 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-red-950/40"
          >
            <PlusCircle size={14} />
            <span>Montar Meu Primeiro Treino</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {workouts.map((w) => {
            const isEditing = editingId === w.id;
            const isConfirmingDelete = deletingId === w.id;
            const totalExercises = w.days.reduce(
              (acc, day) => acc + day.exercises.length,
              0
            );

            return (
              <div
                key={w.id}
                id={`saved-workout-${w.id}`}
                className="rounded-2xl bg-[#0f0f15] border border-[#23232f] hover:border-zinc-700 p-4 transition-all shadow-md space-y-3"
              >
                {/* Title & Rename Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-[#181824] border border-[#e50914] text-white text-xs font-bold rounded-lg p-1.5 focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => confirmRename(w.id)}
                          className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={cancelRename}
                          className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white tracking-tight truncate">
                          {w.title}
                        </h3>
                        <button
                          type="button"
                          onClick={() => startRename(w)}
                          className="text-zinc-500 hover:text-zinc-300 p-1 rounded transition-colors cursor-pointer"
                          title="Renomear treino"
                        >
                          <Edit2 size={12} />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold text-[#e50914] bg-[#e50914]/10 border border-[#e50914]/20 px-1.5 py-0.2 rounded uppercase tracking-wider">
                        {w.splitName}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {w.days.length} dias · {totalExercises} exercícios totais
                      </span>
                    </div>
                  </div>

                  {/* Delete button */}
                  {!isConfirmingDelete ? (
                    <button
                      type="button"
                      onClick={() => setDeletingId(w.id)}
                      className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-[#1f1a1d] transition-colors cursor-pointer"
                      title="Excluir treino"
                    >
                      <Trash2 size={15} />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-red-950/40 border border-red-900/60 p-1 rounded-lg">
                      <span className="text-[10px] text-red-300 font-bold px-1">Excluir?</span>
                      <button
                        type="button"
                        onClick={() => confirmDelete(w.id)}
                        className="p-1 rounded bg-[#e50914] text-white hover:bg-red-600 text-xs font-bold"
                      >
                        Sim
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(null)}
                        className="p-1 rounded bg-zinc-800 text-zinc-300 hover:text-white text-xs"
                      >
                        Não
                      </button>
                    </div>
                  )}
                </div>

                {/* Days preview pills */}
                <div className="flex flex-wrap gap-1.5">
                  {w.days.map((day) => (
                    <span
                      key={day.dayId}
                      className="text-[9px] font-medium bg-[#161622] text-zinc-300 border border-[#232334] px-2 py-0.5 rounded-md truncate max-w-[180px]"
                    >
                      {day.dayName.split('-')[0].trim()} ({day.exercises.length} ex)
                    </span>
                  ))}
                </div>

                {/* Actions Footer */}
                <div className="pt-2 border-t border-[#1e1e28] flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500">
                    {new Date(w.createdAt).toLocaleDateString('pt-BR')}
                  </span>

                  <button
                    type="button"
                    onClick={() => onOpenWorkout(w)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#1a1a26] hover:bg-[#e50914] text-white text-xs font-bold border border-[#28283a] hover:border-red-600 transition-all cursor-pointer active:scale-95"
                  >
                    <FolderOpen size={13} />
                    <span>Abrir Treino</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
