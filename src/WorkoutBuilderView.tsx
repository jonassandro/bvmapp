import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  CircleCheck,
  CirclePlay,
  Clock,
  Dumbbell,
  Flame,
  History,
  Info,
  Play,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  ShieldAlert,
  Sparkles,
  Timer,
  SlidersHorizontal,
  X,
  BookOpen,
} from "lucide-react";
import { bc } from "./data";
import {
  CatalogExercise,
  ENRICHED_EXERCISES,
  EnrichedExercise,
  EQUIPMENT_OPTIONS,
  EquipmentId,
  EXPERIENCE_LABELS,
  ExperienceLevel,
  GeneratedWorkoutPlan,
  generateWorkoutPlan,
  getCompatibleAlternatives,
  GOAL_LABELS,
  GoalType,
  LOCATION_LABELS,
  PainStatus,
  PRIORITY_OPTIONS,
  PriorityGroup,
  QuestionnaireAnswers,
  SessionHistoryEntry,
   SetLogEntry,
  TrainingLocation,
  WEEK_DAYS,
  WeekDayId,
  estimateSessionDurationMinutes,
} from "./workoutBuilder";

const STORAGE_PLAN_KEY = "bvm_saved_workout_plan_v1";
const STORAGE_ANSWERS_KEY = "bvm_saved_workout_answers_v1";
const STORAGE_HISTORY_KEY = "bvm_workout_session_history_v1";

const DEFAULT_ANSWERS: QuestionnaireAnswers = {
  goal: "hipertrofia",
  experience: "iniciante",
  daysPerWeek: 3,
  selectedDays: ["seg", "qua", "sex"],
  sessionDurationMinutes: 45,
  location: "academia_completa",
  equipment: [
    "maquinas",
    "polias",
    "barra_anilhas",
    "halteres",
    "banco",
    "peso_corporal",
  ],
  priority: "equilibrado",
  avoidedExerciseIds: [],
  painStatus: "nao",
  canProceedWithCustomExclusions: false,
};

interface WorkoutBuilderViewProps {
  userUid?: string;
  onBackToContents: () => void;
  onOpenExerciseExecution: (exercise: CatalogExercise) => void;
  renderCategoryIcon: (categoryId: string, isActive?: boolean, size?: number, className?: string) => React.ReactNode;
}

export const WorkoutBuilderView: React.FC<WorkoutBuilderViewProps> = ({
  userUid,
  onBackToContents,
  onOpenExerciseExecution,
  renderCategoryIcon,
}) => {
  const planStorageKey = userUid ? `${STORAGE_PLAN_KEY}_${userUid}` : STORAGE_PLAN_KEY;
  const answersStorageKey = userUid ? `${STORAGE_ANSWERS_KEY}_${userUid}` : STORAGE_ANSWERS_KEY;
  const historyStorageKey = userUid ? `${STORAGE_HISTORY_KEY}_${userUid}` : STORAGE_HISTORY_KEY;

  const [savedPlan, setSavedPlan] = React.useState<GeneratedWorkoutPlan | null>(() => {
    try {
      const raw = localStorage.getItem(planStorageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [answers, setAnswers] = React.useState<QuestionnaireAnswers>(() => {
    try {
      const raw = localStorage.getItem(answersStorageKey);
      return raw ? { ...DEFAULT_ANSWERS, ...JSON.parse(raw) } : DEFAULT_ANSWERS;
    } catch {
      return DEFAULT_ANSWERS;
    }
  });

  const [history, setHistory] = React.useState<SessionHistoryEntry[]>(() => {
    try {
      const raw = localStorage.getItem(historyStorageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // View modes: "welcome" | "quiz" | "result" | "active_session" | "history"
  const [viewMode, setViewMode] = React.useState<
    "welcome" | "quiz" | "result" | "active_session" | "history"
  >("welcome");

  const [quizStep, setQuizStep] = React.useState<number>(1);
  const TOTAL_STEPS = 10;

  // Draft plan when generating new or editing answers before overwriting savedPlan
  const [draftPlan, setDraftPlan] = React.useState<GeneratedWorkoutPlan | null>(null);
  const [generationIssue, setGenerationIssue] = React.useState<{
    type: "safety_blocked" | "insufficient_exercises";
    reason: string;
    missingAreas?: string[];
  } | null>(null);

  const [selectedSessionIdx, setSelectedSessionIdx] = React.useState<number>(0);
  const [saveFeedbackMessage, setSaveFeedbackMessage] = React.useState<string | null>(null);

  // Avoided exercises filter inside step 9
  const [avoidSearch, setAvoidSearch] = React.useState<string>("");
  const [avoidCategoryFilter, setAvoidCategoryFilter] = React.useState<string>("todos");

  // Swap modal state
  const [swapTarget, setSwapTarget] = React.useState<{
    sessionIndex: number;
    exerciseIndex: number;
    currentExercise: EnrichedExercise;
  } | null>(null);

  // Active workout tracking state
  const [activeSessionIndex, setActiveSessionIndex] = React.useState<number>(0);
  const [sessionStartTimestamp, setSessionStartTimestamp] = React.useState<number>(0);
  const [sessionElapsedSec, setSessionElapsedSec] = React.useState<number>(0);
  const [sessionLogs, setSessionLogs] = React.useState<
    Record<string, SetLogEntry[]>
  >({});
  const [restTimerSec, setRestTimerSec] = React.useState<number>(0);
  const [restTimerRunning, setRestTimerRunning] = React.useState<boolean>(false);
  const [autoStartRestTimer, setAutoStartRestTimer] = React.useState<boolean>(true);

  const activePlan = draftPlan || savedPlan;

  // Elapsed timer during active workout
  React.useEffect(() => {
    if (viewMode !== "active_session" || !sessionStartTimestamp) return;
    const interval = setInterval(() => {
      setSessionElapsedSec(Math.floor((Date.now() - sessionStartTimestamp) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [viewMode, sessionStartTimestamp]);

  // Rest countdown timer
  React.useEffect(() => {
    if (!restTimerRunning || restTimerSec <= 0) {
      if (restTimerSec <= 0 && restTimerRunning) {
        setRestTimerRunning(false);
      }
      return;
    }
    const timer = setInterval(() => {
      setRestTimerSec((prev) => {
        if (prev <= 1) {
          setRestTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [restTimerRunning, restTimerSec]);

  const persistAnswers = (nextAnswers: QuestionnaireAnswers) => {
    setAnswers(nextAnswers);
    try {
      localStorage.setItem(answersStorageKey, JSON.stringify(nextAnswers));
    } catch {}
  };

  const handleDaysPerWeekChange = (count: number) => {
    const defaultDayPresets: Record<number, WeekDayId[]> = {
      1: ["seg"],
      2: ["seg", "qui"],
      3: ["seg", "qua", "sex"],
      4: ["seg", "ter", "qui", "sex"],
      5: ["seg", "ter", "qua", "sex", "sab"],
      6: ["seg", "ter", "qua", "qui", "sex", "sab"],
    };
    const nextSelected =
      answers.selectedDays.length === count
        ? answers.selectedDays
        : defaultDayPresets[count] || ["seg", "qua", "sex"];
    persistAnswers({
      ...answers,
      daysPerWeek: count,
      selectedDays: nextSelected,
    });
  };

  const handleToggleDay = (dayId: WeekDayId) => {
    const exists = answers.selectedDays.includes(dayId);
    if (exists) {
      persistAnswers({
        ...answers,
        selectedDays: answers.selectedDays.filter((d) => d !== dayId),
      });
    } else {
      if (answers.selectedDays.length >= answers.daysPerWeek) {
        // Substitui o último ou ignora se já atingiu o limite
        const updated = [...answers.selectedDays.slice(1), dayId];
        persistAnswers({
          ...answers,
          selectedDays: updated,
        });
      } else {
        persistAnswers({
          ...answers,
          selectedDays: [...answers.selectedDays, dayId],
        });
      }
    }
  };

  const handleLocationChange = (loc: TrainingLocation) => {
    const defaultEq = LOCATION_LABELS[loc].defaultEquipment;
    persistAnswers({
      ...answers,
      location: loc,
      equipment: defaultEq,
    });
  };

  const handleToggleEquipment = (eqId: EquipmentId) => {
    const exists = answers.equipment.includes(eqId);
    if (eqId === "peso_corporal" && !exists) {
      persistAnswers({
        ...answers,
        equipment: ["peso_corporal"],
      });
      return;
    }

    let nextEq: EquipmentId[];
    if (exists) {
      nextEq = answers.equipment.filter((item) => item !== eqId);
    } else {
      nextEq = [...answers.equipment, eqId];
    }
    persistAnswers({
      ...answers,
      equipment: nextEq,
    });
  };

  const handleToggleAvoidExercise = (exId: string) => {
    const exists = answers.avoidedExerciseIds.includes(exId);
    const nextAvoided = exists
      ? answers.avoidedExerciseIds.filter((id) => id !== exId)
      : [...answers.avoidedExerciseIds, exId];
    persistAnswers({
      ...answers,
      avoidedExerciseIds: nextAvoided,
    });
  };

  const runPlanGeneration = () => {
    const outcome = generateWorkoutPlan(answers);
    if (outcome.status === "safety_blocked") {
      setGenerationIssue({
        type: "safety_blocked",
        reason: outcome.reason,
      });
      setDraftPlan(null);
      setViewMode("result");
      return;
    }
    if (outcome.status === "insufficient_exercises") {
      setGenerationIssue({
        type: "insufficient_exercises",
        reason: outcome.reason,
        missingAreas: outcome.missingAreas,
      });
      setDraftPlan(null);
      setViewMode("result");
      return;
    }

    setGenerationIssue(null);
    setDraftPlan(outcome.plan);
    setSelectedSessionIdx(0);
    setViewMode("result");
  };

  const handleSavePlan = (planToSave: GeneratedWorkoutPlan) => {
    setSavedPlan(planToSave);
    setDraftPlan(null);
    try {
      localStorage.setItem(planStorageKey, JSON.stringify(planToSave));
      localStorage.setItem(answersStorageKey, JSON.stringify(planToSave.answers));
    } catch {}
    setSaveFeedbackMessage("Treino salvo com sucesso neste dispositivo!");
    setTimeout(() => setSaveFeedbackMessage(null), 3200);
  };

  const handleConfirmSwapExercise = (newEx: EnrichedExercise) => {
    if (!swapTarget || !activePlan) return;
    const { sessionIndex, exerciseIndex } = swapTarget;

    const updatedSessions = activePlan.sessions.map((session, sIdx) => {
      if (sIdx !== sessionIndex) return session;
      const updatedExercises = session.exercises.map((prescribed, eIdx) => {
        if (eIdx !== exerciseIndex) return prescribed;
        return {
          ...prescribed,
          exercise: newEx,
          executionTip: newEx.executionCue,
        };
      });
      return {
        ...session,
        exercises: updatedExercises,
        estimatedMinutes: estimateSessionDurationMinutes(updatedExercises),
      };
    });

    const updatedPlan: GeneratedWorkoutPlan = {
      ...activePlan,
      sessions: updatedSessions,
    };

    if (draftPlan) {
      setDraftPlan(updatedPlan);
    } else {
      setSavedPlan(updatedPlan);
      try {
        localStorage.setItem(planStorageKey, JSON.stringify(updatedPlan));
      } catch {}
    }
    setSwapTarget(null);
  };

  const getLastUsedWeightAndReps = (
    exerciseId: string,
    setNumber: number
  ): { weightKg: string; repsDone: string } => {
    for (const entry of history) {
      const foundEx = entry.exercisesLogged.find(
        (e) => e.exerciseId === exerciseId
      );
      if (foundEx) {
        const foundSet =
          foundEx.sets.find((s) => s.setNumber === setNumber) ||
          foundEx.sets[foundEx.sets.length - 1];
        if (foundSet && (foundSet.weightKg || foundSet.repsDone)) {
          return {
            weightKg: foundSet.weightKg,
            repsDone: foundSet.repsDone,
          };
        }
      }
    }
    return { weightKg: "", repsDone: "" };
  };

  const handleStartWorkoutSession = (sessionIndex: number) => {
    if (!activePlan) return;
    const session = activePlan.sessions[sessionIndex];
    if (!session) return;

    // Se ainda estava como rascunho não salvo, salva automaticamente ao iniciar
    if (draftPlan && !savedPlan) {
      handleSavePlan(draftPlan);
    }

    const initialLogs: Record<string, SetLogEntry[]> = {};
    session.exercises.forEach((prescribed) => {
      const defaultReps = prescribed.reps.split(" ")[0] || "10";
      const setsArr: SetLogEntry[] = [];
      for (let i = 1; i <= prescribed.sets; i++) {
        const prev = getLastUsedWeightAndReps(prescribed.exercise.id, i);
        setsArr.push({
          setNumber: i,
          weightKg: prev.weightKg,
          repsDone: prev.repsDone || defaultReps,
          completed: false,
        });
      }
      initialLogs[prescribed.exercise.id] = setsArr;
    });

    setActiveSessionIndex(sessionIndex);
    setSessionLogs(initialLogs);
    setSessionStartTimestamp(Date.now());
    setSessionElapsedSec(0);
    setRestTimerSec(0);
    setRestTimerRunning(false);
    setViewMode("active_session");
  };

  const handleUpdateSetLog = (
    exerciseId: string,
    setIdx: number,
    field: "weightKg" | "repsDone",
    value: string
  ) => {
    setSessionLogs((prev) => {
      const list = [...(prev[exerciseId] || [])];
      if (!list[setIdx]) return prev;
      list[setIdx] = { ...list[setIdx], [field]: value };
      return { ...prev, [exerciseId]: list };
    });
  };

  const handleToggleSetCompleted = (
    exerciseId: string,
    setIdx: number,
    restSeconds: number
  ) => {
    setSessionLogs((prev) => {
      const list = [...(prev[exerciseId] || [])];
      if (!list[setIdx]) return prev;
      const nextCompleted = !list[setIdx].completed;
      list[setIdx] = { ...list[setIdx], completed: nextCompleted };
      if (nextCompleted && autoStartRestTimer) {
        setRestTimerSec(restSeconds);
        setRestTimerRunning(true);
      }
      return { ...prev, [exerciseId]: list };
    });
  };

  const handleFinishWorkoutSession = () => {
    if (!activePlan) return;
    const session = activePlan.sessions[activeSessionIndex];
    if (!session) return;

    let completedSetsCount = 0;
    let totalSetsCount = 0;

    const exercisesLogged = session.exercises.map((item) => {
      const sets = sessionLogs[item.exercise.id] || [];
      totalSetsCount += sets.length;
      completedSetsCount += sets.filter((s) => s.completed).length;
      return {
        exerciseId: item.exercise.id,
        exerciseName: item.exercise.name,
        sets,
      };
    });

    const newEntry: SessionHistoryEntry = {
      id: "HIST_" + Date.now(),
      dateIso: new Date().toISOString(),
      sessionId: session.id,
      sessionLabel: session.label,
      sessionFocus: session.focus,
      durationSeconds: Math.max(60, sessionElapsedSec),
      completedSetsCount,
      totalSetsCount,
      exercisesLogged,
    };

    const nextHistory = [newEntry, ...history];
    setHistory(nextHistory);
    try {
      localStorage.setItem(historyStorageKey, JSON.stringify(nextHistory));
    } catch {}

    setRestTimerRunning(false);
    setViewMode("history");
  };

  const formatTimeMMSS = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // ============================================================================
  // 1. TELA INICIAL DO MONTADOR ("welcome")
  // ============================================================================
  if (viewMode === "welcome") {
    return (
      <div
        id="workout-builder-welcome"
        className="space-y-4 pb-12 animate-in fade-in duration-200"
      >
        <button
          id="btn-back-from-builder"
          type="button"
          onClick={onBackToContents}
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-[11px] font-bold uppercase tracking-wider py-1 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Voltar para Conteúdos</span>
        </button>

        {/* Cartão Principal exigido no item 1 */}
        <div className="bg-gradient-to-br from-[#241310] via-[#160D0B] to-[#120907] border border-[#4A261F] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#FF4444] bg-[#CC0000]/15 border border-red-500/30 px-2.5 py-1 rounded-lg">
              <Sparkles size={12} />
              <span>Montador de Treinos</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              149 exercícios oficiais
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-extrabold tracking-tight text-white uppercase leading-tight">
              Um treino que combina com sua rotina
            </h1>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Responda algumas perguntas para organizar seus exercícios de acordo
              com seu objetivo, experiência e tempo disponível.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-[#120907]/90 border border-[#2D2421] rounded-xl p-2.5 text-center">
              <span className="text-xs font-bold text-white block">1 a 6 dias</span>
              <span className="text-[9px] text-zinc-500 uppercase font-bold">
                Divisão real
              </span>
            </div>
            <div className="bg-[#120907]/90 border border-[#2D2421] rounded-xl p-2.5 text-center">
              <span className="text-xs font-bold text-white block">20 a 75+ min</span>
              <span className="text-[9px] text-zinc-500 uppercase font-bold">
                No seu tempo
              </span>
            </div>
            <div className="bg-[#120907]/90 border border-[#2D2421] rounded-xl p-2.5 text-center">
              <span className="text-xs font-bold text-white block">Casa ou Acad.</span>
              <span className="text-[9px] text-zinc-500 uppercase font-bold">
                Seus equip.
              </span>
            </div>
          </div>

          <button
            id="btn-start-questionnaire"
            type="button"
            onClick={() => {
              setQuizStep(1);
              setViewMode("quiz");
            }}
            className="w-full bg-[#CC0000] hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/50 cursor-pointer"
          >
            <span>Começar</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Se o usuário já possui um treino salvo */}
        {savedPlan && (
          <div
            id="saved-workout-summary-card"
            className="bg-[#1A1412] border border-[#2D2421] rounded-2xl p-4 space-y-3.5 shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CircleCheck size={16} className="text-green-400 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Meu Treino Salvo Ativo
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">
                {savedPlan.sessions.length} sessões
              </span>
            </div>

            <div className="bg-[#120907] border border-[#2D2421] rounded-xl p-3 space-y-1">
              <p className="text-xs font-bold text-[#EAEAEA] uppercase">
                {savedPlan.splitName}
              </p>
              <p className="text-[11px] text-zinc-400">
                Objetivo: {GOAL_LABELS[savedPlan.answers.goal].title} •{" "}
                {EXPERIENCE_LABELS[savedPlan.answers.experience].title} • ~
                {savedPlan.answers.sessionDurationMinutes} min
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-open-saved-workout"
                type="button"
                onClick={() => {
                  setDraftPlan(null);
                  setGenerationIssue(null);
                  setSelectedSessionIdx(0);
                  setViewMode("result");
                }}
                className="bg-[#CC0000] hover:bg-red-700 text-white font-bold text-[11px] uppercase tracking-wider py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Dumbbell size={14} />
                <span>Abrir Meu Treino</span>
              </button>
              <button
                id="btn-edit-saved-answers"
                type="button"
                onClick={() => {
                  setAnswers(savedPlan.answers);
                  setQuizStep(1);
                  setViewMode("quiz");
                }}
                className="bg-[#120907] hover:bg-[#231b18] border border-[#2D2421] text-zinc-300 font-bold text-[11px] uppercase tracking-wider py-3 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <SlidersHorizontal size={14} />
                <span>Editar Respostas</span>
              </button>
            </div>
          </div>
        )}

        {/* Histórico de sessões realizadas */}
        <div className="bg-[#1A1412] border border-[#2D2421] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#120907] border border-[#2D2421] flex items-center justify-center text-[#CC0000] shrink-0">
              <History size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-white uppercase">
                Histórico de Sessões
              </h3>
              <p className="text-[11px] text-zinc-400">
                {history.length === 0
                  ? "Nenhuma sessão registrada ainda"
                  : `${history.length} ${
                      history.length === 1
                        ? "sessão concluída"
                        : "sessões concluídas"
                    } neste dispositivo`}
              </p>
            </div>
          </div>
          <button
            id="btn-open-workout-history"
            type="button"
            onClick={() => setViewMode("history")}
            className="bg-[#120907] hover:bg-[#231b18] border border-[#2D2421] text-zinc-200 text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-xl shrink-0 transition-colors cursor-pointer"
          >
            Ver Histórico
          </button>
        </div>

        <div className="bg-[#120907] border border-[#2D2421] rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-zinc-500">
          <Info size={14} className="text-zinc-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Seus treinos salvos e o histórico de cargas ficam armazenados
            localmente neste dispositivo, mantendo sua rotina estável sempre que
            você abrir o aplicativo.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. QUESTIONÁRIO POR ETAPAS ("quiz")
  // ============================================================================
  if (viewMode === "quiz") {
    const progressPercent = Math.round((quizStep / TOTAL_STEPS) * 100);

    const canAdvanceStep = (): boolean => {
      if (quizStep === 4) {
        return answers.selectedDays.length === answers.daysPerWeek;
      }
      if (quizStep === 7) {
        return answers.equipment.length > 0;
      }
      return true;
    };

    const handleNextStep = () => {
      if (!canAdvanceStep()) return;
      if (quizStep < TOTAL_STEPS) {
        setQuizStep(quizStep + 1);
      } else {
        runPlanGeneration();
      }
    };

    const handlePrevStep = () => {
      if (quizStep > 1) {
        setQuizStep(quizStep - 1);
      } else {
        setViewMode(savedPlan ? "result" : "welcome");
      }
    };

    const filteredAvoidExercises = ENRICHED_EXERCISES.filter((ex) => {
      const catMatch =
        avoidCategoryFilter === "todos" || ex.categoryId === avoidCategoryFilter;
      const q = avoidSearch.trim().toLowerCase();
      const searchMatch =
        !q ||
        ex.name.toLowerCase().includes(q) ||
        ex.categoryName.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });

    return (
      <div
        id="workout-builder-quiz"
        className="space-y-4 pb-12 animate-in fade-in duration-200"
      >
        {/* Top bar e barra de progresso */}
        <div className="bg-[#120907] border border-[#2D2421] rounded-2xl p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <button
              id="btn-quiz-top-back"
              type="button"
              onClick={handlePrevStep}
              className="inline-flex items-center gap-1 text-zinc-400 hover:text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{quizStep === 1 ? "Sair" : "Voltar"}</span>
            </button>
            <span className="text-[11px] font-mono font-bold text-[#CC0000]">
              Etapa {quizStep} de {TOTAL_STEPS}
            </span>
          </div>

          <div className="w-full h-2 bg-[#1A1412] rounded-full overflow-hidden border border-[#2D2421]">
            <div
              className="h-full bg-[#CC0000] transition-all duration-200 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Conteúdo da etapa */}
        <div className="bg-[#120907] border border-[#2D2421] rounded-2xl p-5 shadow-xl space-y-4">
          {quizStep === 1 && (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000]">
                  1. Objetivo Principal
                </span>
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                  Qual é seu principal objetivo?
                </h2>
                <p className="text-xs text-zinc-400">
                  Isso define a faixa de repetições, o número de séries e o tempo de descanso.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {(Object.keys(GOAL_LABELS) as GoalType[]).map((gKey) => {
                  const item = GOAL_LABELS[gKey];
                  const active = answers.goal === gKey;
                  return (
                    <button
                      key={gKey}
                      id={`quiz-goal-${gKey}`}
                      type="button"
                      onClick={() => persistAnswers({ ...answers, goal: gKey })}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                        active
                          ? "bg-gradient-to-r from-[#251512] to-[#1A1412] border-[#CC0000] shadow-md"
                          : "bg-[#1A1412] border-[#2D2421] hover:border-zinc-600"
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase text-white block">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-zinc-400 leading-relaxed block">
                          {item.subtitle}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          active
                            ? "border-[#CC0000] bg-[#CC0000] text-white"
                            : "border-zinc-600"
                        }`}
                      >
                        {active && <Check size={12} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {quizStep === 2 && (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000]">
                  2. Experiência de Treino
                </span>
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                  Qual é seu nível de experiência?
                </h2>
                <p className="text-xs text-zinc-400">
                  Ajustamos a complexidade técnica dos exercícios e o volume de séries ao seu momento atual.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {(Object.keys(EXPERIENCE_LABELS) as ExperienceLevel[]).map(
                  (lvlKey) => {
                    const item = EXPERIENCE_LABELS[lvlKey];
                    const active = answers.experience === lvlKey;
                    return (
                      <button
                        key={lvlKey}
                        id={`quiz-exp-${lvlKey}`}
                        type="button"
                        onClick={() =>
                          persistAnswers({ ...answers, experience: lvlKey })
                        }
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                          active
                            ? "bg-gradient-to-r from-[#251512] to-[#1A1412] border-[#CC0000] shadow-md"
                            : "bg-[#1A1412] border-[#2D2421] hover:border-zinc-600"
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold uppercase text-white block">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-zinc-400 leading-relaxed block">
                            {item.subtitle}
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            active
                              ? "border-[#CC0000] bg-[#CC0000] text-white"
                              : "border-zinc-600"
                          }`}
                        >
                          {active && <Check size={12} />}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {quizStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000]">
                  3. Frequência Semanal
                </span>
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                  Quantos dias por semana você consegue treinar?
                </h2>
                <p className="text-xs text-zinc-400">
                  Escolha uma quantidade realista que você consiga manter com consistência toda semana.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {[1, 2, 3, 4, 5, 6].map((num) => {
                  const active = answers.daysPerWeek === num;
                  return (
                    <button
                      key={num}
                      id={`quiz-days-${num}`}
                      type="button"
                      onClick={() => handleDaysPerWeekChange(num)}
                      className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                        active
                          ? "bg-gradient-to-b from-[#251512] to-[#1A1412] border-[#CC0000] text-white shadow-lg shadow-red-950/40"
                          : "bg-[#1A1412] border-[#2D2421] text-zinc-300 hover:border-zinc-600"
                      }`}
                    >
                      <span className="text-2xl font-extrabold font-mono block">
                        {num}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mt-1 block">
                        {num === 1 ? "dia / sem" : "dias / sem"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {quizStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000]">
                  4. Dias da Semana
                </span>
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                  Em quais dias você pretende treinar?
                </h2>
                <p className="text-xs text-zinc-400">
                  Selecione exatamente{" "}
                  <strong className="text-white">
                    {answers.daysPerWeek}{" "}
                    {answers.daysPerWeek === 1 ? "dia" : "dias"}
                  </strong>
                  . Avaliamos se há dias seguidos para organizar o descanso muscular.
                </p>
              </div>

              <div className="flex items-center justify-between bg-[#1A1412] border border-[#2D2421] rounded-xl px-3.5 py-2.5 text-xs">
                <span className="text-zinc-400">Dias selecionados:</span>
                <span
                  className={`font-mono font-bold ${
                    answers.selectedDays.length === answers.daysPerWeek
                      ? "text-green-400"
                      : "text-amber-400"
                  }`}
                >
                  {answers.selectedDays.length} de {answers.daysPerWeek}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {WEEK_DAYS.map((d) => {
                  const active = answers.selectedDays.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      id={`quiz-weekday-${d.id}`}
                      type="button"
                      onClick={() => handleToggleDay(d.id)}
                      className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        active
                          ? "bg-gradient-to-r from-[#251512] to-[#1A1412] border-[#CC0000] text-white"
                          : "bg-[#1A1412] border-[#2D2421] text-zinc-400 hover:border-zinc-600"
                      }`}
                    >
                      <span className="text-xs font-bold uppercase">
                        {d.full}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          active
                            ? "bg-[#CC0000] border-[#CC0000] text-white"
                            : "border-zinc-600"
                        }`}
                      >
                        {active && <Check size={12} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {quizStep === 5 && (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000]">
                  5. Duração por Sessão
                </span>
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                  Quanto tempo você tem por treino?
                </h2>
                <p className="text-xs text-zinc-400">
                  Calculamos a quantidade de exercícios considerando aquecimento, execução das séries, intervalos e transições.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {(
                  [
                    { min: 20, label: "20 minutos", desc: "Treino express focado nos movimentos essenciais (3 a 4 exercícios)" },
                    { min: 30, label: "30 minutos", desc: "Sessão compacta e direta ao ponto (4 exercícios)" },
                    { min: 45, label: "45 minutos", desc: "Equilíbrio ideal entre básicos e complementares (5 a 6 exercícios)" },
                    { min: 60, label: "60 minutos", desc: "Sessão completa com exercícios compostos e isolados (6 a 7 exercícios)" },
                    { min: 75, label: "75 minutos ou mais", desc: "Volume amplo para detalhamento muscular completo (7 a 8 exercícios)" },
                  ] as const
                ).map((opt) => {
                  const active = answers.sessionDurationMinutes === opt.min;
                  return (
                    <button
                      key={opt.min}
                      id={`quiz-duration-${opt.min}`}
                      type="button"
                      onClick={() =>
                        persistAnswers({
                          ...answers,
                          sessionDurationMinutes: opt.min,
                        })
                      }
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        active
                          ? "bg-gradient-to-r from-[#251512] to-[#1A1412] border-[#CC0000] shadow-md"
                          : "bg-[#1A1412] border-[#2D2421] hover:border-zinc-600"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold uppercase text-white block">
                          {opt.label}
                        </span>
                        <span className="text-[11px] text-zinc-400 block">
                          {opt.desc}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          active
                            ? "border-[#CC0000] bg-[#CC0000] text-white"
                            : "border-zinc-600"
                        }`}
                      >
                        {active && <Check size={12} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {quizStep === 6 && (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000]">
                  6. Local de Treino
                </span>
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                  Onde você vai treinar?
                </h2>
                <p className="text-xs text-zinc-400">
                  Adaptaremos os equipamentos sugeridos na próxima etapa ao seu ambiente.
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                {(Object.keys(LOCATION_LABELS) as TrainingLocation[]).map(
                  (locKey) => {
                    const item = LOCATION_LABELS[locKey];
                    const active = answers.location === locKey;
                    return (
                      <button
                        key={locKey}
                        id={`quiz-location-${locKey}`}
                        type="button"
                        onClick={() => handleLocationChange(locKey)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                          active
                            ? "bg-gradient-to-r from-[#251512] to-[#1A1412] border-[#CC0000] shadow-md"
                            : "bg-[#1A1412] border-[#2D2421] hover:border-zinc-600"
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold uppercase text-white block">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-zinc-400 leading-relaxed block">
                            {item.subtitle}
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            active
                              ? "border-[#CC0000] bg-[#CC0000] text-white"
                              : "border-zinc-600"
                          }`}
                        >
                          {active && <Check size={12} />}
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {quizStep === 7 && (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000]">
                  7. Equipamentos Disponíveis
                </span>
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                  Quais equipamentos você tem disponíveis?
                </h2>
                <p className="text-xs text-zinc-400">
                  Pré-selecionamos as opções comuns para{" "}
                  <strong className="text-white">
                    {LOCATION_LABELS[answers.location].title}
                  </strong>
                  . Marque ou desmarque conforme sua realidade.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {EQUIPMENT_OPTIONS.map((eq) => {
                  const active = answers.equipment.includes(eq.id);
                  return (
                    <button
                      key={eq.id}
                      id={`quiz-equip-${eq.id}`}
                      type="button"
                      onClick={() => handleToggleEquipment(eq.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        active
                          ? "bg-gradient-to-r from-[#251512] to-[#1A1412] border-[#CC0000]"
                          : "bg-[#1A1412] border-[#2D2421] hover:border-zinc-600"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold uppercase text-white block">
                          {eq.label}
                        </span>
                        <span className="text-[10px] text-zinc-400 block">
                          {eq.desc}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          active
                            ? "bg-[#CC0000] border-[#CC0000] text-white"
                            : "border-zinc-600"
                        }`}
                      >
                        {active && <Check size={12} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {answers.equipment.length === 0 && (
                <p className="text-[11px] text-amber-400">
                  Selecione pelo menos uma opção de equipamento (ou "Apenas peso corporal") para continuar.
                </p>
              )}
            </div>
          )}

          {quizStep === 8 && (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000]">
                  8. Ênfase Muscular
                </span>
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                  Existe algum grupo muscular que você quer priorizar?
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  A prioridade ajusta a ênfase e posiciona esse grupo no início
                  das sessões (maior energia), mantendo uma rotina equilibrada
                  para o restante do corpo.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {PRIORITY_OPTIONS.map((prio) => {
                  const active = answers.priority === prio.id;
                  return (
                    <button
                      key={prio.id}
                      id={`quiz-priority-${prio.id}`}
                      type="button"
                      onClick={() =>
                        persistAnswers({ ...answers, priority: prio.id })
                      }
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        active
                          ? "bg-gradient-to-r from-[#251512] to-[#1A1412] border-[#CC0000] shadow-md"
                          : "bg-[#1A1412] border-[#2D2421] hover:border-zinc-600"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold uppercase text-white block">
                          {prio.label}
                        </span>
                        <span className="text-[11px] text-zinc-400 block">
                          {prio.desc}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          active
                            ? "border-[#CC0000] bg-[#CC0000] text-white"
                            : "border-zinc-600"
                        }`}
                      >
                        {active && <Check size={12} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {quizStep === 9 && (
            <div className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000]">
                    9. Exercícios a Evitar (Opcional)
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {answers.avoidedExerciseIds.length} evitado(s)
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                  Existe algum exercício que você prefere evitar?
                </h2>
                <p className="text-xs text-zinc-400">
                  Opcional. Selecione exercícios da biblioteca que você não gosta ou não quer incluir na rotina.
                </p>
              </div>

              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  id="input-search-avoid-exercises"
                  type="text"
                  value={avoidSearch}
                  onChange={(e) => setAvoidSearch(e.target.value)}
                  placeholder="Buscar exercício para evitar..."
                  className="w-full bg-[#1A1412] border border-[#2D2421] rounded-xl pl-9 pr-9 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#CC0000]"
                />
                {avoidSearch && (
                  <button
                    type="button"
                    onClick={() => setAvoidSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {bc.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setAvoidCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 border transition-colors cursor-pointer ${
                      avoidCategoryFilter === cat.id
                        ? "bg-[#CC0000] text-white border-[#CC0000]"
                        : "bg-[#1A1412] text-zinc-400 border-[#2D2421]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                {filteredAvoidExercises.map((ex) => {
                  const isAvoided = answers.avoidedExerciseIds.includes(ex.id);
                  return (
                    <button
                      key={ex.id}
                      id={`avoid-ex-${ex.id}`}
                      type="button"
                      onClick={() => handleToggleAvoidExercise(ex.id)}
                      className={`w-full text-left p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        isAvoided
                          ? "bg-red-500/15 border-red-500/40 text-red-200"
                          : "bg-[#1A1412] border-[#2D2421] text-zinc-300 hover:border-zinc-600"
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-bold uppercase block truncate">
                          {ex.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 block">
                          {ex.categoryName} • Pág. {ex.pageNumber}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${
                          isAvoided
                            ? "bg-[#CC0000] text-white"
                            : "bg-[#120907] text-zinc-500 border border-[#2D2421]"
                        }`}
                      >
                        {isAvoided ? "Evitado" : "Permitido"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {quizStep === 10 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000]">
                  10. Segurança e Restrições
                </span>
                <h2 className="text-lg font-bold text-white uppercase tracking-tight">
                  Você sente dor ao se exercitar ou possui alguma restrição que afete seus treinos?
                </h2>
                <p className="text-xs text-zinc-400">
                  Sua segurança vem em primeiro lugar.
                </p>
              </div>

              <div className="space-y-2.5">
                {(
                  [
                    {
                      id: "nao",
                      label: "Não",
                      desc: "Estou apto(a) para treinar normalmente sem dores articulares ou restrições médicas ativas.",
                    },
                    {
                      id: "sim",
                      label: "Sim",
                      desc: "Sinto dor ao realizar determinados movimentos ou possuo restrição articular/médica.",
                    },
                    {
                      id: "nao_tenho_certeza",
                      label: "Não tenho certeza",
                      desc: "Tenho desconforto eventual ou dúvida se posso realizar determinados exercícios.",
                    },
                  ] as const
                ).map((opt) => {
                  const active = answers.painStatus === opt.id;
                  return (
                    <button
                      key={opt.id}
                      id={`quiz-pain-${opt.id}`}
                      type="button"
                      onClick={() =>
                        persistAnswers({
                          ...answers,
                          painStatus: opt.id,
                          canProceedWithCustomExclusions:
                            opt.id === "nao"
                              ? false
                              : answers.canProceedWithCustomExclusions,
                        })
                      }
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                        active
                          ? "bg-gradient-to-r from-[#251512] to-[#1A1412] border-[#CC0000] shadow-md"
                          : "bg-[#1A1412] border-[#2D2421] hover:border-zinc-600"
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase text-white block">
                          {opt.label}
                        </span>
                        <span className="text-[11px] text-zinc-400 leading-relaxed block">
                          {opt.desc}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                          active
                            ? "border-[#CC0000] bg-[#CC0000] text-white"
                            : "border-zinc-600"
                        }`}
                      >
                        {active && <Check size={12} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {(answers.painStatus === "sim" ||
                answers.painStatus === "nao_tenho_certeza") && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-3 text-xs">
                  <div className="flex items-start gap-2.5 text-amber-400">
                    <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold uppercase tracking-wide text-amber-300">
                        Aviso importante de segurança
                      </p>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">
                        Este montador organiza exercícios de musculação geral e{" "}
                        <strong>
                          não avalia lesões, não realiza diagnósticos e não
                          substitui a orientação individual
                        </strong>{" "}
                        de um médico, fisioterapeuta ou profissional de Educação
                        Física.
                      </p>
                    </div>
                  </div>

                  <div className="pt-1 space-y-2">
                    <p className="text-[11px] font-bold text-white">
                      Como você deseja prosseguir?
                    </p>
                    <button
                      id="btn-pain-pause-safe"
                      type="button"
                      onClick={() =>
                        persistAnswers({
                          ...answers,
                          canProceedWithCustomExclusions: false,
                        })
                      }
                      className={`w-full text-left p-3 rounded-xl border text-[11px] transition-colors cursor-pointer ${
                        !answers.canProceedWithCustomExclusions
                          ? "bg-red-500/15 border-[#CC0000] text-white font-semibold"
                          : "bg-[#120907] border-[#2D2421] text-zinc-400"
                      }`}
                    >
                      Não gerar plano automático agora (buscar avaliação individual primeiro)
                    </button>
                    <button
                      id="btn-pain-proceed-with-exclusions"
                      type="button"
                      onClick={() =>
                        persistAnswers({
                          ...answers,
                          canProceedWithCustomExclusions: true,
                        })
                      }
                      className={`w-full text-left p-3 rounded-xl border text-[11px] transition-colors cursor-pointer ${
                        answers.canProceedWithCustomExclusions
                          ? "bg-emerald-500/15 border-emerald-500 text-white font-semibold"
                          : "bg-[#120907] border-[#2D2421] text-zinc-400"
                      }`}
                    >
                      Já tenho liberação profissional e selecionei na etapa anterior os exercícios que devo evitar ({answers.avoidedExerciseIds.length} evitado(s))
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Botões de navegação Voltar / Avançar */}
          <div className="flex items-center gap-2.5 pt-2 border-t border-[#2D2421]">
            <button
              id="btn-quiz-prev"
              type="button"
              onClick={handlePrevStep}
              className="flex-1 bg-[#1A1412] hover:bg-[#251b18] border border-[#2D2421] text-zinc-300 font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>Voltar</span>
            </button>
            <button
              id="btn-quiz-next"
              type="button"
              disabled={!canAdvanceStep()}
              onClick={handleNextStep}
              className="flex-[1.5] bg-[#CC0000] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-red-950/40 cursor-pointer"
            >
              <span>
                {quizStep === TOTAL_STEPS ? "Ver Sugestão de Treino" : "Avançar"}
              </span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 3. TELA DE RESULTADO / LIMITAÇÕES ("result")
  // ============================================================================
  if (viewMode === "result") {
    if (generationIssue?.type === "safety_blocked") {
      return (
        <div
          id="workout-safety-blocked"
          className="space-y-4 pb-12 animate-in fade-in duration-200"
        >
          <button
            type="button"
            onClick={() => setViewMode("quiz")}
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-[11px] font-bold uppercase tracking-wider py-1 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Voltar ao Questionário</span>
          </button>

          <div className="bg-[#120907] border border-amber-500/30 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert size={24} />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white uppercase">
                Orientação Individual Recomendada
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {generationIssue.reason}
              </p>
            </div>
            <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-3.5 text-[11px] text-zinc-400 space-y-1.5">
              <p className="font-bold text-zinc-200 uppercase">
                Você ainda pode consultar a biblioteca:
              </p>
              <p>
                Caso já tenha orientação sobre quais movimentos específicos deve
                evitar, você pode voltar à Etapa 9, marcar os exercícios que não
                deseja realizar e gerar sua organização semanal.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setQuizStep(9);
                  setViewMode("quiz");
                }}
                className="flex-1 bg-[#1A1412] hover:bg-[#251b18] border border-[#2D2421] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl cursor-pointer"
              >
                Selecionar exercícios a evitar
              </button>
              <button
                type="button"
                onClick={onBackToContents}
                className="flex-1 bg-[#CC0000] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl cursor-pointer"
              >
                Voltar para Conteúdos
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (generationIssue?.type === "insufficient_exercises") {
      return (
        <div
          id="workout-insufficient-exercises"
          className="space-y-4 pb-12 animate-in fade-in duration-200"
        >
          <button
            type="button"
            onClick={() => setViewMode("quiz")}
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-[11px] font-bold uppercase tracking-wider py-1 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Voltar ao Questionário</span>
          </button>

          <div className="bg-[#120907] border border-red-500/30 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <CircleAlert size={24} />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white uppercase">
                Equipamentos ou Opções Insuficientes
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {generationIssue.reason}
              </p>
            </div>

            {generationIssue.missingAreas &&
              generationIssue.missingAreas.length > 0 && (
                <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-3.5 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">
                    Grupamentos ou sessões impactadas:
                  </span>
                  <ul className="list-disc list-inside text-zinc-300 text-[11px] space-y-0.5">
                    {generationIssue.missingAreas.map((area) => (
                      <li key={area}>{area}</li>
                    ))}
                  </ul>
                </div>
              )}

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Para não preencher seu treino com exercícios incompatíveis com o que
              você possui, ajuste os equipamentos disponíveis (por exemplo,
              incluindo "Apenas peso corporal" ou "Halteres") ou revise os
              exercícios evitados:
            </p>

            <div className="space-y-2 pt-1">
              <button
                id="btn-fix-equipment"
                type="button"
                onClick={() => {
                  setQuizStep(7);
                  setViewMode("quiz");
                }}
                className="w-full bg-[#CC0000] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl cursor-pointer"
              >
                Ajustar Equipamentos Disponíveis (Etapa 7)
              </button>
              <button
                id="btn-fix-avoided"
                type="button"
                onClick={() => {
                  setQuizStep(9);
                  setViewMode("quiz");
                }}
                className="w-full bg-[#1A1412] hover:bg-[#251b18] border border-[#2D2421] text-zinc-200 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl cursor-pointer"
              >
                Revisar Exercícios Evitados (Etapa 9)
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (!activePlan) return null;

    const isPreviewingNewSuggestion = Boolean(draftPlan && savedPlan);
    const currentSession =
      activePlan.sessions[selectedSessionIdx] || activePlan.sessions[0];

    return (
      <div
        id="workout-builder-result"
        className="space-y-4 pb-12 animate-in fade-in duration-200"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            id="btn-back-to-builder-home"
            type="button"
            onClick={() => setViewMode("welcome")}
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-[11px] font-bold uppercase tracking-wider py-1 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Início do Montador</span>
          </button>

          <button
            id="btn-result-open-history"
            type="button"
            onClick={() => setViewMode("history")}
            className="inline-flex items-center gap-1.5 bg-[#1A1412] hover:bg-[#251b18] border border-[#2D2421] text-zinc-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg cursor-pointer"
          >
            <History size={13} className="text-[#CC0000]" />
            <span>Histórico ({history.length})</span>
          </button>
        </div>

        {/* Banner de confirmação quando o usuário editou respostas tendo um treino salvo */}
        {isPreviewingNewSuggestion && (
          <div
            id="new-suggestion-comparison-banner"
            className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-lg"
          >
            <div className="flex items-start gap-2.5">
              <Sparkles size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-xs font-bold uppercase text-amber-300">
                  Nova Sugestão de Rotina (Pré-visualização)
                </h3>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Confira abaixo como ficou a nova rotina com suas respostas
                  atualizadas. Seu histórico de sessões anteriores será
                  integralmente preservado.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                id="btn-confirm-replace-plan"
                type="button"
                onClick={() => handleSavePlan(draftPlan!)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-wider py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Save size={14} />
                <span>Substituir Treino Salvo</span>
              </button>
              <button
                id="btn-discard-draft-plan"
                type="button"
                onClick={() => {
                  setDraftPlan(null);
                  setSelectedSessionIdx(0);
                }}
                className="flex-1 bg-[#120907] hover:bg-[#1f1513] border border-[#2D2421] text-zinc-300 font-bold text-[11px] uppercase tracking-wider py-2.5 px-3 rounded-xl cursor-pointer"
              >
                Manter Treino Anterior
              </button>
            </div>
          </div>
        )}

        {saveFeedbackMessage && (
          <div className="bg-green-500/15 border border-green-500/30 rounded-xl p-3 flex items-center gap-2 text-xs text-green-300 animate-in fade-in">
            <CircleCheck size={16} className="text-green-400 shrink-0" />
            <span className="font-bold">{saveFeedbackMessage}</span>
          </div>
        )}

        {/* Resumo da Personalização */}
        <div className="bg-[#120907] border border-[#2D2421] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#CC0000]">
              Rotina Personalizada
            </span>
            {savedPlan && !draftPlan ? (
              <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <CircleCheck size={11} />
                <span>Salvo no dispositivo</span>
              </span>
            ) : (
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Sugestão não salva
              </span>
            )}
          </div>

          <div>
            <h1 className="text-lg font-extrabold text-white uppercase tracking-tight">
              {activePlan.splitName}
            </h1>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              {activePlan.splitDescription}
            </p>
          </div>

          {/* 4 Indicadores de Resumo */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-2.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">
                Objetivo
              </span>
              <span className="text-xs font-bold text-white truncate block mt-0.5">
                {GOAL_LABELS[activePlan.answers.goal].title}
              </span>
            </div>
            <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-2.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">
                Nível
              </span>
              <span className="text-xs font-bold text-white truncate block mt-0.5">
                {EXPERIENCE_LABELS[activePlan.answers.experience].title}
              </span>
            </div>
            <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-2.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">
                Frequência
              </span>
              <span className="text-xs font-bold text-white truncate block mt-0.5">
                {activePlan.answers.daysPerWeek} dias/sem (
                {activePlan.answers.selectedDays
                  .map((d) => WEEK_DAYS.find((w) => w.id === d)?.short)
                  .join(", ")}
                )
              </span>
            </div>
            <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-2.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">
                Tempo Estimado
              </span>
              <span className="text-xs font-bold text-white truncate block mt-0.5">
                ~{currentSession?.estimatedMinutes || activePlan.answers.sessionDurationMinutes} min / sessão
              </span>
            </div>
          </div>

          {/* Como suas respostas influenciaram */}
          <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-3.5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000] block">
              Como suas respostas moldaram este treino:
            </span>
            <ul className="space-y-1.5 text-[11px] text-zinc-300 leading-relaxed">
              {activePlan.personalizationSummary.map((line, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#CC0000] font-bold mt-0.5">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {activePlan.limitationsNote && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-[11px] text-amber-300 leading-relaxed">
              {activePlan.limitationsNote}
            </div>
          )}

          {/* Orientação de Carga */}
          <div className="bg-[#16100E] border border-[#2D2421] rounded-xl p-3 text-[11px] text-zinc-400 leading-relaxed">
            <strong className="text-zinc-200">Orientação de Carga: </strong>
            {activePlan.loadGuidance}
          </div>

          {/* Botões de Ação Principal */}
          <div className="flex flex-wrap gap-2 pt-1">
            {(!savedPlan || draftPlan) && (
              <button
                id="btn-save-workout"
                type="button"
                onClick={() => handleSavePlan(activePlan)}
                className="flex-1 min-w-[140px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/40 cursor-pointer"
              >
                <Save size={15} />
                <span>Salvar meu treino</span>
              </button>
            )}
            <button
              id="btn-start-active-workout"
              type="button"
              onClick={() => handleStartWorkoutSession(selectedSessionIdx)}
              className="flex-1 min-w-[140px] bg-[#CC0000] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-950/40 cursor-pointer"
            >
              <Play size={15} />
              <span>Iniciar {currentSession?.label || "Treino"}</span>
            </button>
            <button
              id="btn-edit-answers"
              type="button"
              onClick={() => {
                setAnswers(activePlan.answers);
                setQuizStep(1);
                setViewMode("quiz");
              }}
              className="w-full bg-[#1A1412] hover:bg-[#231b18] border border-[#2D2421] text-zinc-300 font-bold text-[11px] uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={14} />
              <span>Editar minhas respostas</span>
            </button>
          </div>
        </div>

        {/* Seletor de Cartões de Treino (Treino A, Treino B, Treino C...) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {activePlan.sessions.map((sess, idx) => {
              const active = idx === selectedSessionIdx;
              const dayNames = sess.assignedDays
                .map((d) => WEEK_DAYS.find((w) => w.id === d)?.short)
                .filter(Boolean)
                .join(", ");
              return (
                <button
                  key={sess.id}
                  id={`tab-workout-session-${sess.id}`}
                  type="button"
                  onClick={() => setSelectedSessionIdx(idx)}
                  className={`px-3.5 py-2.5 rounded-xl border text-left shrink-0 transition-all cursor-pointer ${
                    active
                      ? "bg-gradient-to-b from-[#251512] to-[#170D0B] border-[#CC0000] text-white shadow-md"
                      : "bg-[#16100E] border-[#2A1F1C] text-zinc-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase">
                      {sess.label}
                    </span>
                    {dayNames && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#120907] text-red-400 border border-[#2D2421]">
                        {dayNames}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">
                    {sess.exercises.length} ex. • ~{sess.estimatedMinutes} min
                  </span>
                </button>
              );
            })}
          </div>

          {/* Cartão da Sessão Selecionada */}
          {currentSession && (
            <div
              id={`workout-session-card-${currentSession.id}`}
              className="bg-[#120907] border border-[#2D2421] rounded-2xl p-4 space-y-3.5 shadow-xl"
            >
              <div className="flex items-start justify-between gap-2 border-b border-[#2D2421] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000] block">
                    {currentSession.label}
                  </span>
                  <h2 className="text-sm font-bold text-white uppercase mt-0.5">
                    {currentSession.focus}
                  </h2>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 bg-[#1A1412] border border-[#2D2421] px-2.5 py-1 rounded-lg shrink-0">
                  ~{currentSession.estimatedMinutes} min estimados
                </span>
              </div>

              <div className="space-y-3">
                {currentSession.exercises.map((item, exIdx) => (
                  <div
                    key={`${currentSession.id}_${item.exercise.id}_${exIdx}`}
                    id={`session-exercise-card-${item.exercise.id}`}
                    className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-3.5 space-y-3 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#120907] border border-[#2D2421] flex items-center justify-center shrink-0 p-1">
                        {renderCategoryIcon(
                          item.exercise.categoryId,
                          true,
                          32,
                          "w-8 h-8"
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#CC0000]">
                            {item.exercise.categoryName}
                          </span>
                          <span className="text-[9px] text-zinc-600">•</span>
                          <span className="text-[9px] font-mono text-zinc-400">
                            Pág. {item.exercise.pageNumber}
                          </span>
                          {item.isPriorityBonus && (
                            <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#CC0000]/20 text-red-300 border border-red-500/30">
                              Prioridade
                            </span>
                          )}
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight mt-0.5">
                          {exIdx + 1}. {item.exercise.name}
                        </h3>
                      </div>
                    </div>

                    {/* Prescrição: Séries, Repetições e Intervalo */}
                    <div className="grid grid-cols-3 gap-2 bg-[#120907] border border-[#2D2421] rounded-lg p-2 text-center">
                      <div>
                        <span className="text-[9px] uppercase text-zinc-500 font-bold block">
                          Séries
                        </span>
                        <span className="text-xs font-bold text-white font-mono">
                          {item.sets}
                        </span>
                      </div>
                      <div className="border-x border-[#2D2421]">
                        <span className="text-[9px] uppercase text-zinc-500 font-bold block">
                          Repetições
                        </span>
                        <span className="text-xs font-bold text-white font-mono">
                          {item.reps}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-zinc-500 font-bold block">
                          Intervalo
                        </span>
                        <span className="text-xs font-bold text-white font-mono">
                          {item.restSeconds}s
                        </span>
                      </div>
                    </div>

                    {/* Orientação curta de execução */}
                    <p className="text-[11px] text-zinc-300 leading-relaxed bg-[#140E0C] border border-[#261C19] rounded-lg p-2.5">
                      <strong className="text-amber-400">Execução: </strong>
                      {item.executionTip}
                    </p>

                    {/* Botões: Ver execução / Trocar exercício */}
                    <div className="flex gap-2">
                      <button
                        id={`btn-view-exec-${item.exercise.id}`}
                        type="button"
                        onClick={() => onOpenExerciseExecution(item.exercise)}
                        className="flex-1 bg-[#120907] hover:bg-[#231b18] border border-[#2D2421] hover:border-[#CC0000]/60 text-zinc-200 font-bold text-[10px] uppercase tracking-wider py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {item.exercise.hasVideo ? (
                          <CirclePlay size={13} className="text-[#CC0000]" />
                        ) : (
                          <BookOpen size={13} className="text-[#CC0000]" />
                        )}
                        <span>Ver execução</span>
                      </button>
                      <button
                        id={`btn-swap-ex-${item.exercise.id}`}
                        type="button"
                        onClick={() =>
                          setSwapTarget({
                            sessionIndex: selectedSessionIdx,
                            exerciseIndex: exIdx,
                            currentExercise: item.exercise,
                          })
                        }
                        className="flex-1 bg-[#120907] hover:bg-[#231b18] border border-[#2D2421] text-zinc-300 hover:text-white font-bold text-[10px] uppercase tracking-wider py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RefreshCw size={12} />
                        <span>Trocar exercício</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal de Troca de Exercício */}
        {swapTarget && (
          <div
            id="swap-exercise-modal-overlay"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <div className="w-full max-w-md bg-[#120907] border border-[#2D2421] rounded-t-3xl sm:rounded-2xl p-5 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#2D2421] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000] block">
                    Substituição Compatível
                  </span>
                  <h3 className="text-sm font-bold text-white uppercase">
                    Trocar: {swapTarget.currentExercise.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSwapTarget(null)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-[11px] text-zinc-400">
                Exibindo alternativas da biblioteca oficial compatíveis com seus
                equipamentos e que cumprem função similar:
              </p>

              <div className="overflow-y-auto space-y-2 pr-1 flex-1">
                {(() => {
                  const inSessionIds =
                    activePlan.sessions[
                      swapTarget.sessionIndex
                    ]?.exercises.map((e) => e.exercise.id) || [];
                  const alternatives = getCompatibleAlternatives(
                    swapTarget.currentExercise,
                    inSessionIds,
                    activePlan.answers
                  );

                  if (alternatives.length === 0) {
                    return (
                      <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-4 text-center space-y-2">
                        <p className="text-xs font-bold text-zinc-300 uppercase">
                          Nenhuma outra alternativa disponível
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          Todos os exercícios compatíveis deste grupo já estão
                          no treino ou foram marcados para evitar.
                        </p>
                      </div>
                    );
                  }

                  return alternatives.map((alt) => (
                    <button
                      key={alt.id}
                      id={`btn-select-alt-${alt.id}`}
                      type="button"
                      onClick={() => handleConfirmSwapExercise(alt)}
                      className="w-full text-left bg-[#1A1412] hover:bg-[#251b18] border border-[#2D2421] hover:border-[#CC0000] rounded-xl p-3 flex items-center justify-between gap-3 transition-all cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white uppercase truncate">
                            {alt.name}
                          </span>
                          {alt.pattern === swapTarget.currentExercise.pattern && (
                            <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-green-500/15 text-green-400 border border-green-500/30 shrink-0">
                              Mesmo Padrão
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-400 block mt-0.5">
                          {alt.categoryName} • Pág. {alt.pageNumber}
                          {alt.hasVideo ? " • Com Vídeo" : ""}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase text-[#CC0000] shrink-0">
                        Escolher
                      </span>
                    </button>
                  ));
                })()}
              </div>

              <button
                type="button"
                onClick={() => setSwapTarget(null)}
                className="w-full bg-[#1A1412] border border-[#2D2421] text-zinc-300 font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // 4. EXECUÇÃO DO TREINO ATIVO ("active_session")
  // ============================================================================
  if (viewMode === "active_session" && activePlan) {
    const session =
      activePlan.sessions[activeSessionIndex] || activePlan.sessions[0];

    return (
      <div
        id="workout-active-session"
        className="space-y-4 pb-16 animate-in fade-in duration-200"
      >
        {/* Top bar da sessão em andamento */}
        <div className="bg-[#120907] border border-[#2D2421] rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg sticky top-16 z-20">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000] block">
              Treino em Andamento • {session.label}
            </span>
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase truncate max-w-[200px]">
              {session.focus}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-[#1A1412] border border-[#2D2421] px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-mono text-white">
              <Clock size={13} className="text-[#CC0000]" />
              <span>{formatTimeMMSS(sessionElapsedSec)}</span>
            </div>
            <button
              type="button"
              onClick={() => setViewMode("result")}
              className="text-zinc-400 hover:text-white p-1.5 rounded-lg bg-[#1A1412] border border-[#2D2421]"
              title="Voltar ao resumo"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Temporizador de Descanso Opcional */}
        <div className="bg-[#1A1412] border border-[#2D2421] rounded-2xl p-3.5 space-y-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer size={16} className="text-[#CC0000]" />
              <span className="text-xs font-bold uppercase text-white">
                Temporizador de Descanso
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAutoStartRestTimer(!autoStartRestTimer)}
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border cursor-pointer ${
                autoStartRestTimer
                  ? "bg-green-500/15 text-green-400 border-green-500/30"
                  : "bg-[#120907] text-zinc-500 border-[#2D2421]"
              }`}
            >
              Auto: {autoStartRestTimer ? "Ativo" : "Off"}
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 bg-[#120907] border border-[#2D2421] rounded-xl p-2.5">
            <span
              id="rest-timer-display"
              className={`text-xl font-extrabold font-mono ${
                restTimerSec > 0 ? "text-[#FF4444]" : "text-zinc-500"
              }`}
            >
              {formatTimeMMSS(restTimerSec)}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setRestTimerSec((prev) => Math.max(0, prev - 15))
                }
                className="px-2 py-1 rounded-lg bg-[#1A1412] border border-[#2D2421] text-[10px] font-bold text-zinc-300 hover:text-white cursor-pointer"
              >
                -15s
              </button>
              <button
                type="button"
                onClick={() => {
                  setRestTimerSec((prev) => (prev === 0 ? 60 : prev + 15));
                  setRestTimerRunning(true);
                }}
                className="px-2 py-1 rounded-lg bg-[#1A1412] border border-[#2D2421] text-[10px] font-bold text-zinc-300 hover:text-white cursor-pointer"
              >
                +15s
              </button>
              <button
                type="button"
                onClick={() => {
                  if (restTimerSec === 0) {
                    setRestTimerSec(60);
                    setRestTimerRunning(true);
                  } else {
                    setRestTimerRunning(!restTimerRunning);
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-[#CC0000] text-white text-[10px] font-bold uppercase cursor-pointer"
              >
                {restTimerRunning ? "Pausar" : "Iniciar"}
              </button>
              {restTimerSec > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setRestTimerSec(0);
                    setRestTimerRunning(false);
                  }}
                  className="px-2 py-1 rounded-lg bg-[#1A1412] border border-[#2D2421] text-[10px] font-bold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Zerar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Lista de exercícios com registro de carga e séries */}
        <div className="space-y-3.5">
          {session.exercises.map((item, idx) => {
            const logs = sessionLogs[item.exercise.id] || [];
            return (
              <div
                key={item.exercise.id}
                className="bg-[#120907] border border-[#2D2421] rounded-2xl p-4 space-y-3 shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#CC0000]">
                      Exercício {idx + 1} • Meta: {item.sets}x ({item.reps}) •{" "}
                      {item.restSeconds}s
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-white uppercase mt-0.5">
                      {item.exercise.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenExerciseExecution(item.exercise)}
                    className="text-[10px] font-bold uppercase text-zinc-300 bg-[#1A1412] border border-[#2D2421] px-2.5 py-1.5 rounded-lg shrink-0 hover:text-white cursor-pointer"
                  >
                    Ver execução
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[9px] font-bold uppercase tracking-wider text-zinc-500 px-1">
                    <span className="col-span-2">Série</span>
                    <span className="col-span-4">Carga (kg)</span>
                    <span className="col-span-4">Reps feitas</span>
                    <span className="col-span-2 text-center">Feito</span>
                  </div>

                  {logs.map((setLog, sIdx) => (
                    <div
                      key={setLog.setNumber}
                      className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl border transition-colors ${
                        setLog.completed
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-[#1A1412] border-[#2D2421]"
                      }`}
                    >
                      <span className="col-span-2 text-xs font-mono font-bold text-zinc-300 pl-1">
                        #{setLog.setNumber}
                      </span>
                      <div className="col-span-4">
                        <input
                          type="text"
                          inputMode="decimal"
                          placeholder="kg"
                          value={setLog.weightKg}
                          onChange={(e) =>
                            handleUpdateSetLog(
                              item.exercise.id,
                              sIdx,
                              "weightKg",
                              e.target.value
                            )
                          }
                          className="w-full bg-[#120907] border border-[#2D2421] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#CC0000]"
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="reps"
                          value={setLog.repsDone}
                          onChange={(e) =>
                            handleUpdateSetLog(
                              item.exercise.id,
                              sIdx,
                              "repsDone",
                              e.target.value
                            )
                          }
                          className="w-full bg-[#120907] border border-[#2D2421] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#CC0000]"
                        />
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <button
                          id={`btn-complete-set-${item.exercise.id}-${setLog.setNumber}`}
                          type="button"
                          onClick={() =>
                            handleToggleSetCompleted(
                              item.exercise.id,
                              sIdx,
                              item.restSeconds
                            )
                          }
                          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                            setLog.completed
                              ? "bg-green-500 border-green-500 text-black font-bold"
                              : "bg-[#120907] border-[#2D2421] text-zinc-500 hover:text-white"
                          }`}
                        >
                          <Check size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <button
          id="btn-finish-workout-session"
          type="button"
          onClick={handleFinishWorkoutSession}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest py-4 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 cursor-pointer"
        >
          <CircleCheck size={16} />
          <span>Finalizar Treino e Salvar no Histórico</span>
        </button>
      </div>
    );
  }

  // ============================================================================
  // 5. HISTÓRICO DE SESSÕES REALIZADAS ("history")
  // ============================================================================
  return (
    <div
      id="workout-history-view"
      className="space-y-4 pb-12 animate-in fade-in duration-200"
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMode(activePlan ? "result" : "welcome")}
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-[11px] font-bold uppercase tracking-wider py-1 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Voltar</span>
        </button>
        <span className="text-[10px] font-mono text-zinc-400">
          {history.length} registro(s)
        </span>
      </div>

      <div className="bg-[#120907] border border-[#2D2421] rounded-2xl p-5 shadow-xl space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#CC0000]">
          Registro de Evolução
        </span>
        <h1 className="text-lg font-bold text-white uppercase">
          Histórico de Sessões Realizadas
        </h1>
        <p className="text-xs text-zinc-400">
          Consulte suas sessões concluídas, cargas registradas e séries feitas.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="bg-[#1A1412] border border-[#2D2421] rounded-2xl p-8 text-center space-y-3">
          <History size={28} className="text-zinc-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase text-white">
              Nenhuma sessão registrada ainda
            </h3>
            <p className="text-[11px] text-zinc-400">
              Ao clicar em "Iniciar Treino" e concluir suas séries, seus
              registros de carga e evolução aparecerão aqui.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => {
            const dateFormatted = new Date(entry.dateIso).toLocaleDateString(
              "pt-BR",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            );
            return (
              <div
                key={entry.id}
                className="bg-[#1A1412] border border-[#2D2421] rounded-2xl p-4 space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between gap-2 border-b border-[#2D2421] pb-2.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#CC0000] block">
                      {entry.sessionLabel} • {dateFormatted}
                    </span>
                    <h3 className="text-xs font-bold text-white uppercase mt-0.5">
                      {entry.sessionFocus}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded shrink-0">
                    {entry.completedSetsCount}/{entry.totalSetsCount} séries
                  </span>
                </div>

                <div className="space-y-2">
                  {entry.exercisesLogged.map((exLog) => (
                    <div
                      key={exLog.exerciseId}
                      className="bg-[#120907] border border-[#2D2421] rounded-xl p-2.5 space-y-1"
                    >
                      <span className="text-[11px] font-bold text-white uppercase block">
                        {exLog.exerciseName}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {exLog.sets.map((s) => (
                          <span
                            key={s.setNumber}
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              s.completed
                                ? "bg-green-500/10 text-green-300 border-green-500/30"
                                : "bg-[#1A1412] text-zinc-500 border-[#2D2421]"
                            }`}
                          >
                            S{s.setNumber}: {s.weightKg ? `${s.weightKg}kg` : "Peso corp."} ×{" "}
                            {s.repsDone || "0"}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
