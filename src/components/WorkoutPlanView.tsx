import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Dumbbell,
  Eye,
  RefreshCw,
  BookmarkCheck,
  RotateCcw,
  Check,
  Timer,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  Exercise,
  WorkoutPlan,
  WorkoutDay,
  WorkoutExerciseItem,
} from '../types';
import { EXERCISES } from '../data/mockData';
import { ExerciseSwapModal } from './ExerciseSwapModal';

interface WorkoutPlanViewProps {
  plan: WorkoutPlan;
  onBack: () => void;
  onRegenerate: () => void;
  onSave: (plan: WorkoutPlan) => Promise<void>;
  onViewExercise: (exercise: Exercise) => void;
  onUpdatePlan: (updatedPlan: WorkoutPlan) => void;
  isSaving?: boolean;
  hasSaved?: boolean;
}

export const WorkoutPlanView: React.FC<WorkoutPlanViewProps> = ({
  plan,
  onBack,
  onRegenerate,
  onSave,
  onViewExercise,
  onUpdatePlan,
  isSaving = false,
  hasSaved = false,
}) => {
  // Estado para o modal de troca de exercício
  const [swapModalState, setSwapModalState] = useState<{
    isOpen: boolean;
    dayId: string;
    exerciseItem: WorkoutExerciseItem | null;
    dayExerciseIds: string[];
  }>({
    isOpen: false,
    dayId: '',
    exerciseItem: null,
    dayExerciseIds: [],
  });

  // Dias expandidos/colapsados (por padrão o primeiro dia expandido ou todos)
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    plan.days.forEach((day, i) => {
      initial[day.dayId] = true; // todos abertos inicialmente para visualização rápida
    });
    return initial;
  });

  const toggleDayExpand = (dayId: string) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayId]: !prev[dayId],
    }));
  };

  const handleOpenSwapModal = (day: WorkoutDay, item: WorkoutExerciseItem) => {
    setSwapModalState({
      isOpen: true,
      dayId: day.dayId,
      exerciseItem: item,
      dayExerciseIds: day.exercises.map((e) => e.exerciseId),
    });
  };

  const handleConfirmSwap = (newExercise: Exercise) => {
    if (!swapModalState.exerciseItem) return;

    const targetDayId = swapModalState.dayId;
    const oldId = swapModalState.exerciseItem.exerciseId;

    const updatedDays = plan.days.map((day) => {
      if (day.dayId !== targetDayId) return day;

      const updatedExercises = day.exercises.map((item) => {
        if (item.exerciseId !== oldId) return item;

        return {
          ...item,
          exerciseId: newExercise.id,
          exerciseName: newExercise.name,
          categoryName: newExercise.categoryName,
          categoryId: newExercise.categoryId,
        };
      });

      return {
        ...day,
        exercises: updatedExercises,
      };
    });

    const updatedPlan: WorkoutPlan = {
      ...plan,
      days: updatedDays,
      updatedAt: new Date().toISOString(),
    };

    onUpdatePlan(updatedPlan);
    setSwapModalState({ isOpen: false, dayId: '', exerciseItem: null, dayExerciseIds: [] });
  };

  const handleViewExecution = (exerciseId: string) => {
    const exercise = EXERCISES.find((e) => e.id === exerciseId);
    if (exercise) {
      onViewExercise(exercise);
    }
  };

  const objectiveLabels: Record<string, string> = {
    hipertrofia: 'Hipertrofia',
    forca: 'Força',
    condicionamento: 'Condicionamento',
    equilibrado: 'Equilibrado',
  };

  const durationLabels: Record<string, string> = {
    ate_30: 'Até 30 min',
    '30_45': '30 a 45 min',
    '45_60': '45 a 60 min',
    mais_60: '+60 min',
  };

  const locationLabels: Record<string, string> = {
    academia_completa: 'Academia Completa',
    academia_simples: 'Academia Simples',
    casa: 'Treino em Casa',
  };

  return (
    <div id="workout-plan-view" className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Top Bar with back button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white bg-[#15151e] border border-[#23232f] hover:border-zinc-500 p-2 px-3 rounded-xl transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft size={14} />
          <span>Voltar ao Formulário</span>
        </button>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#e50914]/10 text-[#e50914] border border-[#e50914]/20 uppercase tracking-widest">
          {plan.splitName}
        </span>
      </div>

      {/* Plan Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0f0f15] border border-[#23232f] p-5 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#e50914]" />
          <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
            Seu Treino Personalizado
          </span>
        </div>

        <h1 className="text-lg font-extrabold text-white tracking-tight">
          {plan.title}
        </h1>

        {/* Quick parameters badges */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-[#1e1e28]">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md bg-[#161622] text-zinc-300 border border-[#252535]">
            <Calendar size={11} className="text-[#e50914]" />
            <span>{plan.answers.frequencia} dias/semana</span>
          </span>

          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md bg-[#161622] text-zinc-300 border border-[#252535]">
            <Clock size={11} className="text-[#e50914]" />
            <span>{durationLabels[plan.answers.duracao] || plan.answers.duracao}</span>
          </span>

          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-md bg-[#161622] text-zinc-300 border border-[#252535]">
            <Dumbbell size={11} className="text-[#e50914]" />
            <span>{locationLabels[plan.answers.local] || plan.answers.local}</span>
          </span>
        </div>

        {/* Action Buttons: Gerar Outra Opção & Salvar Treino */}
        <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-[#1e1e28]">
          <button
            id="btn-regenerate-workout"
            type="button"
            onClick={onRegenerate}
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#171722] hover:bg-[#20202e] border border-[#272738] text-xs font-bold text-zinc-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <RotateCcw size={14} className="text-[#e50914]" />
            <span>Gerar Outra Opção</span>
          </button>

          <button
            id="btn-save-workout"
            type="button"
            onClick={() => onSave(plan)}
            disabled={isSaving}
            className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md cursor-pointer active:scale-95 ${
              hasSaved
                ? 'bg-emerald-600 border border-emerald-500'
                : 'bg-[#e50914] hover:bg-red-600 border border-red-600 shadow-red-950/40'
            }`}
          >
            {hasSaved ? (
              <>
                <Check size={14} />
                <span>Salvo no App</span>
              </>
            ) : (
              <>
                <BookmarkCheck size={14} />
                <span>{isSaving ? 'Salvando...' : 'Salvar Treino'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Days & Exercises List */}
      <div className="space-y-4">
        {plan.days.map((day, dayIndex) => {
          const isExpanded = expandedDays[day.dayId] ?? true;

          return (
            <div
              key={day.dayId}
              id={`workout-day-${day.dayId}`}
              className="rounded-2xl bg-[#0f0f15] border border-[#21212d] overflow-hidden shadow-lg transition-all"
            >
              {/* Day Header Accordion */}
              <div
                onClick={() => toggleDayExpand(day.dayId)}
                className="p-4 bg-[#14141d] hover:bg-[#181824] flex items-center justify-between cursor-pointer border-b border-[#21212d] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="w-7 h-7 rounded-lg bg-[#e50914] text-white flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm shadow-red-950/40">
                    {dayIndex + 1}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xs font-bold text-white uppercase tracking-tight truncate">
                      {day.dayName}
                    </h2>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {day.exercises.length} exercícios programados
                    </p>
                  </div>
                </div>

                <div className="text-zinc-400 shrink-0">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {/* Day Exercises */}
              {isExpanded && (
                <div className="p-3 space-y-2.5 bg-[#0b0b10]">
                  {day.exercises.map((item, exIndex) => (
                    <div
                      key={`${day.dayId}-${item.exerciseId}-${exIndex}`}
                      id={`exercise-item-${item.exerciseId}`}
                      className="p-3 rounded-xl bg-[#12121a] border border-[#20202c] hover:border-zinc-700 transition-all space-y-2.5 shadow-sm"
                    >
                      {/* Exercise Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-bold text-[#e50914] bg-[#e50914]/10 border border-[#e50914]/20 px-1.5 py-0.2 rounded uppercase">
                              #{exIndex + 1}
                            </span>
                            <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">
                              {item.categoryName || item.categoryId}
                            </span>
                          </div>
                          <h3 className="text-xs font-bold text-white tracking-tight">
                            {item.exerciseName}
                          </h3>
                        </div>

                        <span className="text-[9px] font-mono text-zinc-400 shrink-0 bg-zinc-800/60 px-1.5 py-0.5 rounded">
                          {item.exerciseId}
                        </span>
                      </div>

                      {/* Sets, Reps, Rest Badges */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-[#181822] border border-[#282836] px-2.5 py-1 rounded-lg">
                          <Layers size={11} className="text-[#e50914]" />
                          <span className="text-[10px] font-bold text-zinc-200">
                            {item.sets} séries
                          </span>
                        </div>

                        <div className="flex items-center gap-1 bg-[#181822] border border-[#282836] px-2.5 py-1 rounded-lg">
                          <Dumbbell size={11} className="text-zinc-400" />
                          <span className="text-[10px] font-bold text-zinc-200">
                            {item.reps} reps
                          </span>
                        </div>

                        <div className="flex items-center gap-1 bg-[#181822] border border-[#282836] px-2.5 py-1 rounded-lg">
                          <Timer size={11} className="text-amber-400" />
                          <span className="text-[10px] font-bold text-zinc-200">
                            {item.restSeconds}s
                          </span>
                        </div>
                      </div>

                      {/* Coaching Note */}
                      {item.notes && (
                        <p className="text-[11px] text-zinc-400 leading-relaxed italic bg-[#151520] p-2 rounded-lg border border-[#222230]">
                          "{item.notes}"
                        </p>
                      )}

                      {/* Action buttons: Ver Execução & Trocar Exercício */}
                      <div className="flex items-center gap-2 pt-1 border-t border-[#1a1a24]">
                        <button
                          type="button"
                          id={`btn-view-${item.exerciseId}`}
                          onClick={() => handleViewExecution(item.exerciseId)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-[#181824] hover:bg-[#202030] text-zinc-200 hover:text-white text-[10px] font-bold uppercase tracking-wider border border-[#262638] transition-colors cursor-pointer"
                        >
                          <Eye size={12} className="text-[#e50914]" />
                          <span>Ver Execução</span>
                        </button>

                        <button
                          type="button"
                          id={`btn-swap-${item.exerciseId}`}
                          onClick={() => handleOpenSwapModal(day, item)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-[#181824] hover:bg-[#202030] text-zinc-200 hover:text-white text-[10px] font-bold uppercase tracking-wider border border-[#262638] transition-colors cursor-pointer"
                        >
                          <RefreshCw size={12} className="text-zinc-400" />
                          <span>Trocar Exercício</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Exercise Swap Modal */}
      <ExerciseSwapModal
        isOpen={swapModalState.isOpen}
        currentExerciseId={swapModalState.exerciseItem?.exerciseId || null}
        dayExerciseIds={swapModalState.dayExerciseIds}
        location={plan.answers.local}
        level={plan.answers.nivel}
        onClose={() => setSwapModalState({ isOpen: false, dayId: '', exerciseItem: null, dayExerciseIds: [] })}
        onSelectSwap={handleConfirmSwap}
      />
    </div>
  );
};
