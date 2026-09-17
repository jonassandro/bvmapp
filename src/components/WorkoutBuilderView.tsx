import React, { useState } from 'react';
import {
  Target,
  Calendar,
  Clock,
  TrendingUp,
  MapPin,
  Dumbbell,
  Sparkles,
  Bookmark,
  ChevronRight,
  AlertCircle,
  Check,
} from 'lucide-react';
import {
  WorkoutAnswers,
  WorkoutDuration,
  WorkoutFrequency,
  WorkoutLevel,
  WorkoutLocation,
  WorkoutObjective,
  WorkoutPlan,
} from '../types';
import { generateWorkout } from '../services/workoutEngine';

interface WorkoutBuilderViewProps {
  onWorkoutGenerated: (plan: WorkoutPlan) => void;
  onOpenSavedWorkouts: () => void;
  savedWorkoutsCount: number;
}

export const WorkoutBuilderView: React.FC<WorkoutBuilderViewProps> = ({
  onWorkoutGenerated,
  onOpenSavedWorkouts,
  savedWorkoutsCount,
}) => {
  // Estado do formulário com valores padrão realistas
  const [objetivo, setObjetivo] = useState<WorkoutObjective>('hipertrofia');
  const [frequencia, setFrequencia] = useState<WorkoutFrequency>(4);
  const [duracao, setDuracao] = useState<WorkoutDuration>('45_60');
  const [nivel, setNivel] = useState<WorkoutLevel>('intermediario');
  const [local, setLocal] = useState<WorkoutLocation>('academia_completa');
  const [prioridades, setPrioridades] = useState<string[]>([]);

  // Estados de controle e erro
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const togglePriority = (muscleId: string) => {
    if (muscleId === 'nenhum') {
      setPrioridades([]);
      return;
    }

    setPrioridades((prev) => {
      const exists = prev.includes(muscleId);
      if (exists) {
        return prev.filter((id) => id !== muscleId);
      }
      // Limitar a no máximo 2 prioridades para garantir equilíbrio de treino
      if (prev.length >= 2) {
        return [prev[1], muscleId];
      }
      return [...prev, muscleId];
    });
  };

  const handleGenerate = () => {
    setErrorMessage(null);
    setIsGenerating(true);

    // Feedback visual rápido de processamento local (250ms)
    setTimeout(() => {
      try {
        const answers: WorkoutAnswers = {
          objetivo,
          frequencia,
          duracao,
          nivel,
          local,
          prioridades,
        };

        const plan = generateWorkout(answers);
        setIsGenerating(false);
        onWorkoutGenerated(plan);
      } catch (err) {
        setIsGenerating(false);
        setErrorMessage('Não foi possível montar seu treino. Tente novamente.');
      }
    }, 300);
  };

  return (
    <div id="workout-builder-view" className="space-y-5 pb-12 animate-in fade-in duration-200">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#12121c] to-[#0d0d14] border border-[#222232] p-5 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#e50914] animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase text-[#e50914] tracking-widest">
                Montador de Treinos
              </span>
            </div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">
              Monte seu Treino Personalizado
            </h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm leading-relaxed">
              Sistema inteligente baseado na biblioteca oficial de 149 exercícios da Base Visual.
            </p>
          </div>

          {/* Quick Access to Saved Workouts */}
          <button
            type="button"
            onClick={onOpenSavedWorkouts}
            className="shrink-0 flex items-center gap-1.5 p-2.5 px-3 rounded-xl bg-[#171724] hover:bg-[#202032] border border-[#29293e] hover:border-zinc-500 text-xs font-bold text-zinc-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Bookmark size={14} className="text-[#e50914]" />
            <span className="hidden sm:inline">Meus Treinos</span>
            {savedWorkoutsCount > 0 && (
              <span className="text-[10px] font-bold bg-[#e50914] text-white px-1.5 py-0.2 rounded-full ml-0.5">
                {savedWorkoutsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Form Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle size={16} className="text-[#e50914] shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Questions */}
      <div className="space-y-5">
        {/* 1. Objetivo do Treino */}
        <div className="rounded-2xl bg-[#0f0f15] border border-[#21212d] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-[#e50914]" />
            <label className="text-xs font-bold uppercase tracking-wider text-white">
              1. Objetivo Principal
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'hipertrofia', label: 'Hipertrofia', desc: 'Ganho de massa muscular' },
              { id: 'forca', label: 'Força', desc: 'Aumento de carga e potência' },
              { id: 'condicionamento', label: 'Condicionamento', desc: 'Resistência e gasto calórico' },
              { id: 'equilibrado', label: 'Equilibrado', desc: 'Saúde geral e harmonia física' },
            ].map((item) => {
              const active = objetivo === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setObjetivo(item.id as WorkoutObjective)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    active
                      ? 'bg-[#1a141a] border-[#e50914] shadow-md shadow-red-950/30 ring-1 ring-[#e50914]'
                      : 'bg-[#13131b] border-[#22222e] hover:border-zinc-600 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{item.label}</span>
                    {active && <Check size={14} className="text-[#e50914]" />}
                  </div>
                  <span className="text-[10px] text-zinc-400">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Frequência Semanal */}
        <div className="rounded-2xl bg-[#0f0f15] border border-[#21212d] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[#e50914]" />
            <label className="text-xs font-bold uppercase tracking-wider text-white">
              2. Frequência Semanal
            </label>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {([2, 3, 4, 5, 6] as WorkoutFrequency[]).map((days) => {
              const active = frequencia === days;
              return (
                <button
                  key={days}
                  type="button"
                  onClick={() => setFrequencia(days)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    active
                      ? 'bg-[#e50914] border-red-600 text-white font-extrabold shadow-md shadow-red-950/40'
                      : 'bg-[#13131b] border-[#22222e] hover:border-zinc-600 text-zinc-300 font-semibold'
                  }`}
                >
                  <span className="block text-sm leading-tight">{days}x</span>
                  <span className="text-[9px] uppercase opacity-80">dias</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Duração do Treino */}
        <div className="rounded-2xl bg-[#0f0f15] border border-[#21212d] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#e50914]" />
            <label className="text-xs font-bold uppercase tracking-wider text-white">
              3. Duração Estimada da Sessão
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'ate_30', label: 'Até 30 min', desc: 'Rápido e direto' },
              { id: '30_45', label: '30 a 45 min', desc: 'Volume moderado' },
              { id: '45_60', label: '45 a 60 min', desc: 'Padrão ideal' },
              { id: 'mais_60', label: '+60 min', desc: 'Completo e amplo' },
            ].map((item) => {
              const active = duracao === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDuracao(item.id as WorkoutDuration)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-[#1a141a] border-[#e50914] ring-1 ring-[#e50914]'
                      : 'bg-[#13131b] border-[#22222e] hover:border-zinc-600'
                  }`}
                >
                  <span className="block text-xs font-bold text-white">{item.label}</span>
                  <span className="text-[10px] text-zinc-400">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Nível de Treino */}
        <div className="rounded-2xl bg-[#0f0f15] border border-[#21212d] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#e50914]" />
            <label className="text-xs font-bold uppercase tracking-wider text-white">
              4. Nível de Experiência
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'iniciante', label: 'Iniciante', desc: 'Até 6 meses' },
              { id: 'intermediario', label: 'Intermediário', desc: '6 meses a 2 anos' },
              { id: 'avancado', label: 'Avançado', desc: 'Mais de 2 anos' },
            ].map((item) => {
              const active = nivel === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setNivel(item.id as WorkoutLevel)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    active
                      ? 'bg-[#1a141a] border-[#e50914] ring-1 ring-[#e50914]'
                      : 'bg-[#13131b] border-[#22222e] hover:border-zinc-600'
                  }`}
                >
                  <span className="block text-xs font-bold text-white">{item.label}</span>
                  <span className="text-[10px] text-zinc-400">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Local de Treino */}
        <div className="rounded-2xl bg-[#0f0f15] border border-[#21212d] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[#e50914]" />
            <label className="text-xs font-bold uppercase tracking-wider text-white">
              5. Local e Equipamentos
            </label>
          </div>

          <div className="space-y-2">
            {[
              {
                id: 'academia_completa',
                label: 'Academia Completa',
                desc: 'Acesso total a máquinas, polias, halteres e barras livres.',
              },
              {
                id: 'academia_simples',
                label: 'Academia Simples / Condomínio',
                desc: 'Halteres, barras, polia básica ou banco. Sem máquinas complexas.',
              },
              {
                id: 'casa',
                label: 'Treino em Casa',
                desc: 'Exercícios com peso corporal e halteres disponíveis.',
              },
            ].map((item) => {
              const active = local === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLocal(item.id as WorkoutLocation)}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    active
                      ? 'bg-[#1a141a] border-[#e50914] ring-1 ring-[#e50914]'
                      : 'bg-[#13131b] border-[#22222e] hover:border-zinc-600'
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-white">{item.label}</span>
                    <span className="text-[10px] text-zinc-400">{item.desc}</span>
                  </div>
                  {active && <Check size={16} className="text-[#e50914] shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Grupos Musculares Prioritários */}
        <div className="rounded-2xl bg-[#0f0f15] border border-[#21212d] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell size={16} className="text-[#e50914]" />
              <label className="text-xs font-bold uppercase tracking-wider text-white">
                6. Foco / Prioridade Muscular (Opcional)
              </label>
            </div>
            <span className="text-[10px] text-zinc-400">Até 2 grupos</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'peito', label: 'Peito' },
              { id: 'costas', label: 'Costas' },
              { id: 'pernas', label: 'Pernas' },
              { id: 'ombros', label: 'Ombros' },
              { id: 'biceps', label: 'Bíceps' },
              { id: 'triceps', label: 'Tríceps' },
            ].map((muscle) => {
              const active = prioridades.includes(muscle.id);
              return (
                <button
                  key={muscle.id}
                  type="button"
                  onClick={() => togglePriority(muscle.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    active
                      ? 'bg-[#1a141a] border-[#e50914] text-white font-bold ring-1 ring-[#e50914]'
                      : 'bg-[#13131b] border-[#22222e] hover:border-zinc-600 text-zinc-300'
                  }`}
                >
                  <span className="text-xs">{muscle.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setPrioridades([])}
            className={`w-full py-2 px-3 rounded-xl border text-center text-xs transition-all cursor-pointer ${
              prioridades.length === 0
                ? 'bg-[#161622] border-zinc-600 text-zinc-200 font-bold'
                : 'bg-[#101016] border-[#1e1e28] text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Distribuição Padrão / Sem prioridade específica
          </button>
        </div>
      </div>

      {/* Main Action: Montar Treino */}
      <div className="pt-2">
        <button
          id="btn-montar-treino"
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full p-4 rounded-2xl bg-[#e50914] hover:bg-red-600 text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-950/50 transition-all cursor-pointer active:scale-98 disabled:opacity-75"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Calculando Estrutura do Treino...</span>
            </div>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Montar Treino Agora</span>
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
