import { tg } from "./data";

export type GoalType =
  | "hipertrofia"
  | "forca"
  | "emagrecimento"
  | "rotina_ativa";

export type ExperienceLevel = "iniciante" | "intermediario" | "avancado";

export type TrainingLocation =
  | "academia_completa"
  | "academia_compacta"
  | "casa";

export type EquipmentId =
  | "maquinas"
  | "polias"
  | "barra_anilhas"
  | "halteres"
  | "banco"
  | "elasticos"
  | "peso_corporal";

export type PriorityGroup =
  | "equilibrado"
  | "pernas"
  | "costas"
  | "peito"
  | "ombros"
  | "bracos";

export type PainStatus = "nao" | "sim" | "nao_tenho_certeza";

export type WeekDayId = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";

export interface QuestionnaireAnswers {
  goal: GoalType;
  experience: ExperienceLevel;
  daysPerWeek: number; // 1 to 6
  selectedDays: WeekDayId[];
  sessionDurationMinutes: 20 | 30 | 45 | 60 | 75;
  location: TrainingLocation;
  equipment: EquipmentId[];
  priority: PriorityGroup;
  avoidedExerciseIds: string[];
  painStatus: PainStatus;
  canProceedWithCustomExclusions?: boolean;
}

export interface CatalogExercise {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  pageNumber: number | string;
  pdfBase: string;
  moduleId: string;
  moduloId: string;
  hasVideo: boolean;
  active: boolean;
  videoId?: string;
  videoFileName?: string;
  videoUrl?: string;
  order: number;
  notes: string;
}

export type MovementPattern =
  | "empurrar_horizontal"
  | "empurrar_inclinado"
  | "isolado_peito"
  | "puxar_vertical"
  | "puxar_horizontal"
  | "hinge_costas"
  | "empurrar_vertical"
  | "elevacao_lateral"
  | "elevacao_frontal"
  | "deltoide_posterior"
  | "rosca_biceps"
  | "extensao_triceps"
  | "agachamento_joelho"
  | "unilateral_pernas"
  | "isolado_quadriceps"
  | "posterior_quadril"
  | "isolado_posterior"
  | "gluteo_quadril"
  | "adutor_abdutor"
  | "panturrilha"
  | "core_flexao"
  | "core_estabilidade"
  | "core_rotacao";

export interface EnrichedExercise extends CatalogExercise {
  requiredEquipment: EquipmentId[];
   requiresBench: boolean;
  pattern: MovementPattern;
  isCompound: boolean;
  minLevel: ExperienceLevel;
  executionCue: string;
}

export interface PrescribedExercise {
  exercise: EnrichedExercise;
  sets: number;
  reps: string;
  restSeconds: number;
  executionTip: string;
  isPriorityBonus?: boolean;
}

export interface WorkoutSessionPlan {
  id: string; // e.g., "A", "B", "C"
  label: string; // e.g., "Treino A"
  focus: string; // e.g., "Corpo Inteiro — Ênfase Base"
  assignedDays: WeekDayId[];
  estimatedMinutes: number;
  exercises: PrescribedExercise[];
}

export interface GeneratedWorkoutPlan {
  id: string;
  createdAt: string;
  answers: QuestionnaireAnswers;
  splitName: string;
  splitDescription: string;
  personalizationSummary: string[];
  loadGuidance: string;
  sessions: WorkoutSessionPlan[];
  limitationsNote?: string;
}

export type GenerationOutcome =
  | {
      status: "ok";
      plan: GeneratedWorkoutPlan;
    }
  | {
      status: "safety_blocked";
      reason: string;
    }
  | {
      status: "insufficient_exercises";
      reason: string;
      missingAreas: string[];
    };

export interface SetLogEntry {
  setNumber: number;
  weightKg: string;
  repsDone: string;
  completed: boolean;
}

export interface SessionHistoryEntry {
  id: string;
  dateIso: string;
  sessionId: string;
  sessionLabel: string;
  sessionFocus: string;
  durationSeconds: number;
  completedSetsCount: number;
  totalSetsCount: number;
  exercisesLogged: {
    exerciseId: string;
    exerciseName: string;
    sets: SetLogEntry[];
  }[];
}

export const WEEK_DAYS: { id: WeekDayId; short: string; full: string; index: number }[] = [
  { id: "seg", short: "Seg", full: "Segunda-feira", index: 0 },
  { id: "ter", short: "Ter", full: "Terça-feira", index: 1 },
  { id: "qua", short: "Qua", full: "Quarta-feira", index: 2 },
  { id: "qui", short: "Qui", full: "Quinta-feira", index: 3 },
  { id: "sex", short: "Sex", full: "Sexta-feira", index: 4 },
  { id: "sab", short: "Sáb", full: "Sábado", index: 5 },
  { id: "dom", short: "Dom", full: "Domingo", index: 6 },
];

export const GOAL_LABELS: Record<GoalType, { title: string; subtitle: string }> = {
  hipertrofia: {
    title: "Ganhar massa muscular",
    subtitle: "Foco em volume estruturado, tensão mecânica e progressão gradual de repetições e cargas.",
  },
  forca: {
    title: "Desenvolver força",
    subtitle: "Prioridade em movimentos multiarticulares, faixas de repetições mais baixas e intervalos amplos.",
  },
  emagrecimento: {
    title: "Emagrecer e melhorar o condicionamento",
    subtitle: "Sessões dinâmicas com intervalos controlados para estimular o gasto energético e preservar massa magra.",
  },
  rotina_ativa: {
    title: "Manter uma rotina ativa",
    subtitle: "Treinos equilibrados e sustentáveis para saúde articular, disposição e constância semanal.",
  },
};

export const EXPERIENCE_LABELS: Record<
  ExperienceLevel,
  { title: string; subtitle: string }
> = {
  iniciante: {
    title: "Iniciante",
    subtitle:
      "Estou começando agora, retomando após pausa longa ou treino há menos de 6 meses. Foco em dominar a execução com segurança.",
  },
  intermediario: {
    title: "Intermediário",
    subtitle:
      "Treino com regularidade entre 6 meses e 2 anos, conheço os movimentos principais e busco evoluir volume e consistência.",
  },
  avancado: {
    title: "Avançado",
    subtitle:
      "Mais de 2 anos de treino consistente, ótimo controle de proximidade da falha (RIR/RPE) e boa recuperação.",
  },
};

export const LOCATION_LABELS: Record<
  TrainingLocation,
  { title: string; subtitle: string; defaultEquipment: EquipmentId[] }
> = {
  academia_completa: {
    title: "Academia completa",
    subtitle: "Acesso amplo a máquinas, polias, pesos livres e bancos reguláveis.",
    defaultEquipment: [
      "maquinas",
      "polias",
      "barra_anilhas",
      "halteres",
      "banco",
      "peso_corporal",
    ],
  },
  academia_compacta: {
    title: "Academia com poucos equipamentos",
    subtitle: "Academia de condomínio ou estúdio enxuto com halteres, banco, polia básica ou barra.",
    defaultEquipment: ["halteres", "banco", "polias", "barra_anilhas", "peso_corporal"],
  },
  casa: {
    title: "Em casa",
    subtitle: "Treino doméstico com peso corporal e eventuais acessórios que você possua.",
    defaultEquipment: ["peso_corporal"],
  },
};

export const EQUIPMENT_OPTIONS: {
  id: EquipmentId;
  label: string;
  desc: string;
}[] = [
  { id: "maquinas", label: "Máquinas", desc: "Aparelhos guiados (Leg press, extensora, peck deck, etc.)" },
  { id: "polias", label: "Polias", desc: "Cabos, crossover, puxador alto e remada baixa" },
  { id: "barra_anilhas", label: "Barra e anilhas", desc: "Barras retas, W, gaiola ou suporte" },
  { id: "halteres", label: "Halteres", desc: "Pares de halteres fixos ou ajustáveis" },
  { id: "banco", label: "Banco", desc: "Banco reto ou inclinável de apoio" },
  { id: "elasticos", label: "Elásticos", desc: "Faixas elásticas / minibands de resistência" },
  { id: "peso_corporal", label: "Apenas peso corporal", desc: "Exercícios livres usando o próprio corpo" },
];

export const PRIORITY_OPTIONS: {
  id: PriorityGroup;
  label: string;
  desc: string;
}[] = [
  {
    id: "equilibrado",
    label: "Desenvolvimento equilibrado",
    desc: "Distribuição simétrica de volume entre membros superiores, inferiores e core.",
  },
  {
    id: "pernas",
    label: "Pernas e glúteos",
    desc: "Prioriza quadríceps, posteriores, glúteos e panturrilhas no início das sessões.",
  },
  {
    id: "costas",
    label: "Costas",
    desc: "Dá ênfase extra a puxadas e remadas para largura e densidade dorsal.",
  },
  {
    id: "peito",
    label: "Peitoral",
    desc: "Prioriza variações de empurrar horizontal e inclinado no início do treino.",
  },
  {
    id: "ombros",
    label: "Ombros",
    desc: "Aumenta o foco em deltoide lateral, frontal e posterior.",
  },
  {
    id: "bracos",
    label: "Braços (Bíceps e Tríceps)",
    desc: "Garante estímulo prioritário e volume adicional para bíceps e tríceps.",
  },
];

const EXECUTION_CUES_BY_PATTERN: Record<MovementPattern, string> = {
  empurrar_horizontal:
    "Mantenha as escápulas retraídas e firmes no apoio; desça com controle e empurre sem perder o alinhamento dos punhos.",
  empurrar_inclinado:
    "Controle a fase excêntrica mantendo os cotovelos levemente angulados (~45°) para proteger a articulação do ombro.",
  isolado_peito:
    "Mantenha leve flexão nos cotovelos durante todo o arco e concentre a contração no centro do peitoral.",
  puxar_vertical:
    "Inicie o movimento deprimindo as escápulas e conduza os cotovelos em direção ao tronco, evitando impulso lombar.",
  puxar_horizontal:
    "Mantenha a coluna neutra e traga a carga aproximando as escápulas no final da puxada com 1s de controle.",
  hinge_costas:
    "Mantenha o core firme, coluna neutra e a barra próxima ao corpo durante toda a subida.",
  empurrar_vertical:
    "Contraia glúteos e abdômen para não hiperestender a lombar ao empurrar a carga acima da cabeça.",
  elevacao_lateral:
    "Eleve os braços no plano escapular até a linha dos ombros, guiando o movimento pelos cotovelos sem encolher o trapézio.",
  elevacao_frontal:
    "Suba de forma controlada até a linha dos ombros sem balançar o tronco na saída do movimento.",
  deltoide_posterior:
    "Conduza os cotovelos para trás mantendo os ombros baixos para isolar a porção posterior do deltoide.",
  rosca_biceps:
    "Mantenha os cotovelos estáveis ao lado do tronco e faça a extensão completa antes de iniciar a próxima repetição.",
  extensao_triceps:
    "Estabilize os cotovelos como uma dobradiça fixa, estendendo completamente o antebraço no final.",
  agachamento_joelho:
    "Mantenha os pés inteiros apoiados no solo, joelhos acompanhando a ponta dos pés e controle a descida.",
  unilateral_pernas:
    "Mantenha o tronco estável e concentre a força no calcanhar e meio do pé da perna da frente.",
  isolado_quadriceps:
    "Ajuste o encosto para alinhar o joelho ao eixo do aparelho e segure 1 segundo no topo da extensão.",
  posterior_quadril:
    "Empurre o quadril para trás mantendo os joelhos seminflexionados e a coluna rigorosamente neutra.",
  isolado_posterior:
    "Mantenha o quadril apoiado no banco durante toda a flexão dos joelhos, controlando o retorno.",
  gluteo_quadril:
    "Faça a extensão completa do quadril contraindo os glúteos no topo, mantendo o queixo próximo ao peito.",
  adutor_abdutor:
    "Execute com amplitude controlada e cadência constante, sem soltar o peso bruscamente.",
  panturrilha:
    "Alongue bem o calcanhar na descida e faça uma pausa de 1 segundo na contração máxima no topo.",
  core_flexao:
    "Enrole a coluna torácica aproximando as costelas da pelve e solte o ar no ponto de maior contração.",
  core_estabilidade:
    "Mantenha pelve neutra, glúteos contraídos e abdômen firme sem deixar o quadril cair.",
  core_rotacao:
    "Gire o tronco de forma controlada usando a musculatura oblíqua, mantendo o quadril estável.",
};

function classifyExercise(raw: CatalogExercise): EnrichedExercise {
  const n = raw.name.toLowerCase();
  const id = raw.id;

  let requiredEquipment: EquipmentId[] = ["maquinas"];
  let requiresBench = false;

  if (
    id === "EX018" ||
    id === "EX019" ||
    id === "EX020" ||
    id === "EX027" ||
    id === "EX028" ||
    id === "EX029" ||
    id === "EX095" ||
    id === "EX103" ||
    id === "EX109" ||
    id === "EX115" ||
    id === "EX118" ||
    id === "EX128" ||
    id === "EX131" ||
    id === "EX138" ||
    id === "EX139" ||
    id === "EX143" ||
    id === "EX145" ||
    id === "EX146" ||
    id === "EX148" ||
    id === "EX149"
  ) {
    requiredEquipment = ["peso_corporal"];
  } else if (id === "EX094") {
    // Agachamento búlgaro: pode ser feito com peso corporal ou halteres
    requiredEquipment = ["peso_corporal"];
  } else if (id === "EX142") {
    // Abdominal infra no banco
    requiredEquipment = ["banco"];
    requiresBench = true;
  } else if (id === "EX147") {
    // Ab wheel rollout
    requiredEquipment = ["barra_anilhas"];
  } else if (
    n.includes("máquina") ||
    n.includes("peck deck") ||
    n.includes("chest press") ||
    n.includes("hack") ||
    n.includes("leg press") ||
    n.includes("cadeira ") ||
    n.includes("mesa flexora") ||
    n.includes("smith") ||
    n.includes("panturrilha sentada") ||
    n.includes("donkey") ||
    n.includes("glute ham") ||
    n.includes("cavalinho")
  ) {
    requiredEquipment = ["maquinas"];
  } else if (
    n.includes("polia") ||
    n.includes("cabo") ||
    n.includes("crossover") ||
    n.includes("puxada") ||
    n.includes("pulley") ||
    n.includes("face pull") ||
    n.includes("triângulo") ||
    n.includes("remada baixa")
  ) {
    requiredEquipment = ["polias"];
  } else if (n.includes("halter") || n.includes("serrote") || n.includes("goblet") || id === "EX047" || id === "EX052" || id === "EX055" || id === "EX065" || id === "EX066" || id === "EX077" || id === "EX084") {
    requiredEquipment = ["halteres"];
    if (
      n.includes("supino") ||
      n.includes("crucifixo reto") ||
      n.includes("crucifixo inclinado") ||
      n.includes("crucifixo declinado") ||
      n.includes("rosca inclinada") ||
      n.includes("rosca scott com halter") ||
      n.includes("pullover com halter") ||
      n.includes("elevação lateral inclinada")
    ) {
      requiresBench = true;
    }
  } else if (
    n.includes("barra") ||
    n.includes("supino fechado") ||
    n.includes("rack pull") ||
    n.includes("levantamento terra") ||
    n.includes("good morning") ||
    n.includes("agachamento livre") ||
    n.includes("agachamento frontal") ||
    n.includes("agachamento sumô")
  ) {
    requiredEquipment = ["barra_anilhas"];
    if (n.includes("supino") || n.includes("tríceps testa") || n.includes("hip thrust com barra")) {
      requiresBench = true;
    }
  }

  let pattern: MovementPattern = "empurrar_horizontal";
  let isCompound = true;

  if (raw.categoryId === "peito") {
    if (n.includes("inclinado") || n.includes("pés elevados") || n.includes("crossover baixo")) {
      pattern = n.includes("crucifixo") || n.includes("crossover") ? "isolado_peito" : "empurrar_inclinado";
      isCompound = !n.includes("crucifixo") && !n.includes("crossover");
    } else if (n.includes("crucifixo") || n.includes("crossover") || n.includes("peck deck")) {
      pattern = "isolado_peito";
      isCompound = false;
    } else {
      pattern = "empurrar_horizontal";
      isCompound = true;
    }
  } else if (raw.categoryId === "costas") {
    if (n.includes("puxada") || n.includes("barra fixa") || n.includes("pullover")) {
      pattern = "puxar_vertical";
      isCompound = !n.includes("pullover");
    } else if (n.includes("terra") || n.includes("rack pull")) {
      pattern = "hinge_costas";
      isCompound = true;
    } else {
      pattern = "puxar_horizontal";
      isCompound = true;
    }
  } else if (raw.categoryId === "ombros") {
    if (n.includes("desenvolvimento")) {
      pattern = "empurrar_vertical";
      isCompound = true;
    } else if (n.includes("elevação lateral")) {
      pattern = "elevacao_lateral";
      isCompound = false;
    } else if (n.includes("elevação frontal")) {
      pattern = "elevacao_frontal";
      isCompound = false;
    } else {
      pattern = "deltoide_posterior";
      isCompound = false;
    }
  } else if (raw.categoryId === "biceps") {
    pattern = "rosca_biceps";
    isCompound = false;
  } else if (raw.categoryId === "triceps") {
    pattern = "extensao_triceps";
    isCompound = false;
  } else if (raw.categoryId === "pernas") {
    if (n.includes("panturrilha") || n.includes("calf")) {
      pattern = "panturrilha";
      isCompound = false;
    } else if (n.includes("extensora") || n.includes("sissy")) {
      pattern = "isolado_quadriceps";
      isCompound = false;
    } else if (n.includes("flexora") || n.includes("nordic") || n.includes("glute ham")) {
      pattern = "isolado_posterior";
      isCompound = false;
    } else if (n.includes("stiff") || n.includes("romeno") || n.includes("good morning")) {
      pattern = "posterior_quadril";
      isCompound = true;
    } else if (n.includes("hip thrust") || n.includes("pélvica") || n.includes("glúteo") || n.includes("coice na máquina")) {
      pattern = "gluteo_quadril";
      isCompound = n.includes("hip thrust") || n.includes("pélvica");
    } else if (n.includes("adução") || n.includes("abdução")) {
      pattern = "adutor_abdutor";
      isCompound = false;
    } else if (n.includes("búlgaro") || n.includes("passada") || n.includes("afundo") || n.includes("step-up") || n.includes("unilateral")) {
      pattern = "unilateral_pernas";
      isCompound = true;
    } else if (id === "EX131" || id === "EX132") {
      pattern = id === "EX132" ? "core_rotacao" : "core_flexao";
      isCompound = false;
    } else {
      pattern = "agachamento_joelho";
      isCompound = true;
    }
  } else if (raw.categoryId === "core") {
    if (n.includes("prancha") || n.includes("rollout") || n.includes("mountain")) {
      pattern = "core_estabilidade";
      isCompound = false;
    } else if (n.includes("oblíquo")) {
      pattern = "core_rotacao";
      isCompound = false;
    } else {
      pattern = "core_flexao";
      isCompound = false;
    }
  }

  let minLevel: ExperienceLevel = "iniciante";
  if (
    id === "EX045" ||
    id === "EX046" ||
    id === "EX093" ||
    id === "EX095" ||
    id === "EX114" ||
    id === "EX115" ||
    id === "EX135" ||
    id === "EX147"
  ) {
    minLevel = "avancado";
  } else if (
    id === "EX020" ||
    id === "EX027" ||
    id === "EX030" ||
    id === "EX031" ||
    id === "EX063" ||
    id === "EX071" ||
    id === "EX094" ||
    id === "EX102" ||
    id === "EX106" ||
    id === "EX107" ||
    id === "EX131" ||
    id === "EX134" ||
    id === "EX143" ||
    id === "EX149"
  ) {
    minLevel = "intermediario";
  }

  return {
    ...raw,
    requiredEquipment,
    requiresBench,
    pattern,
    isCompound,
    minLevel,
    executionCue: EXECUTION_CUES_BY_PATTERN[pattern],
  };
}

export const ENRICHED_EXERCISES: EnrichedExercise[] = (tg as CatalogExercise[]).map(
  classifyExercise
);

export function isExerciseCompatibleWithEquipment(
  ex: EnrichedExercise,
  availableEquipment: EquipmentId[],
  location: TrainingLocation
): boolean {
  const equipSet = new Set<EquipmentId>(availableEquipment);
  const hasMain = ex.requiredEquipment.every((req) => equipSet.has(req));
  if (!hasMain) return false;
  if (ex.requiresBench && location === "casa" && !equipSet.has("banco")) {
    return false;
  }
  return true;
}

function getLevelScore(
  ex: EnrichedExercise,
  userLevel: ExperienceLevel,
  goal: GoalType
): number {
  let score = 0;
  if (ex.hasVideo) score += 2; // Prioriza exercícios com vídeo demonstrativo em caso de empate
  if (userLevel === "iniciante") {
    if (ex.minLevel === "iniciante") score += 30;
    else if (ex.minLevel === "intermediario") score += 10;
    else score -= 25;
    if (ex.requiredEquipment.includes("maquinas") || ex.requiredEquipment.includes("polias")) {
      score += 8;
    }
  } else if (userLevel === "intermediario") {
    if (ex.minLevel !== "avancado") score += 20;
    if (ex.isCompound) score += 6;
  } else {
    // avançado
    if (ex.isCompound) score += 10;
    if (ex.minLevel === "intermediario" || ex.minLevel === "avancado") score += 8;
  }

  if (goal === "forca" && ex.isCompound) {
    score += 15;
  }
  if (goal === "emagrecimento" && ex.isCompound) {
    score += 10;
  }
  return score;
}

function getPrescriptionParams(
  ex: EnrichedExercise,
  goal: GoalType,
  experience: ExperienceLevel,
  isPriorityBonus: boolean
): { sets: number; reps: string; restSeconds: number } {
  let sets = 3;
  let reps = "10 a 12";
  let restSeconds = 75;

  if (goal === "forca") {
    if (ex.isCompound) {
      sets = experience === "iniciante" ? 3 : 4;
      reps = experience === "iniciante" ? "6 a 8" : "5 a 6";
      restSeconds = experience === "iniciante" ? 90 : 120;
    } else {
      sets = 3;
      reps = "8 a 10";
      restSeconds = 75;
    }
  } else if (goal === "hipertrofia") {
    if (ex.isCompound) {
      sets = experience === "iniciante" ? 3 : 4;
      reps = "8 a 12";
      restSeconds = 90;
    } else {
      sets = 3;
      reps = "10 a 15";
      restSeconds = 60;
    }
  } else if (goal === "emagrecimento") {
    sets = experience === "avancado" && ex.isCompound ? 4 : 3;
    reps = ex.isCompound ? "10 a 12" : "12 a 15";
    restSeconds = ex.isCompound ? 60 : 45;
  } else {
    // rotina_ativa
    sets = experience === "iniciante" ? 2 : 3;
    reps = "10 a 12";
    restSeconds = 60;
  }

  if (isPriorityBonus && sets < 4 && experience !== "iniciante") {
    sets += 1;
  }

  return { sets, reps, restSeconds };
}

export function estimateSessionDurationMinutes(
  exercises: { sets: number; restSeconds: number }[]
): number {
  if (exercises.length === 0) return 0;
  const warmupSeconds = 4 * 60; // 4 min aquecimento articular e específico
  const avgExecutionPerSetSeconds = 40;
  const transitionBetweenExercisesSeconds = 50;

  let totalSeconds = warmupSeconds;
  for (const item of exercises) {
    const workSec = item.sets * avgExecutionPerSetSeconds;
    const restSec = Math.max(0, item.sets - 1) * item.restSeconds;
    totalSeconds += workSec + restSec + transitionBetweenExercisesSeconds;
  }
  return Math.max(15, Math.round(totalSeconds / 60));
}

function getTargetExerciseCount(
  sessionDurationMinutes: number,
  goal: GoalType,
  experience: ExperienceLevel
): number {
  // Calcula quantos exercícios cabem confortavelmente no tempo informado
  if (sessionDurationMinutes <= 20) return 3;
  if (sessionDurationMinutes <= 30) return 4;
  if (sessionDurationMinutes <= 45) return goal === "forca" ? 5 : 6;
  if (sessionDurationMinutes <= 60) return goal === "forca" ? 6 : 7;
  return experience === "iniciante" ? 7 : 8;
}

interface SlotSpec {
  categories: string[];
  preferredPatterns?: MovementPattern[];
  preferCompound?: boolean;
}

interface SessionBlueprint {
  id: string;
  label: string;
  focus: string;
  slots: SlotSpec[];
}

function hasConsecutiveDays(days: WeekDayId[]): boolean {
  if (days.length <= 1) return false;
  const indices = days
    .map((d) => WEEK_DAYS.find((w) => w.id === d)?.index ?? 0)
    .sort((a, b) => a - b);
  for (let i = 0; i < indices.length - 1; i++) {
    if (indices[i + 1] - indices[i] === 1) return true;
  }
  return false;
}

function buildSplitBlueprints(
  answers: QuestionnaireAnswers
): {
  splitName: string;
  splitDescription: string;
  blueprints: SessionBlueprint[];
} {
  const { daysPerWeek, experience, selectedDays } = answers;
  const consecutive = hasConsecutiveDays(selectedDays);

  if (daysPerWeek === 1) {
    return {
      splitName: "Full Body (Corpo Inteiro — 1x/semana)",
      splitDescription:
        "Sessão global que estimula todos os grandes grupos musculares em um único treino estratégico.",
      blueprints: [
        {
          id: "A",
          label: "Treino A",
          focus: "Corpo Inteiro — Estímulo Global",
          slots: [
            { categories: ["pernas"], preferredPatterns: ["agachamento_joelho", "unilateral_pernas"], preferCompound: true },
            { categories: ["peito"], preferredPatterns: ["empurrar_horizontal", "empurrar_inclinado"], preferCompound: true },
            { categories: ["costas"], preferredPatterns: ["puxar_vertical", "puxar_horizontal"], preferCompound: true },
            { categories: ["pernas"], preferredPatterns: ["posterior_quadril", "gluteo_quadril", "isolado_posterior"] },
            { categories: ["ombros"], preferredPatterns: ["empurrar_vertical", "elevacao_lateral"] },
            { categories: ["biceps", "triceps"] },
            { categories: ["core"] },
            { categories: ["pernas"], preferredPatterns: ["panturrilha"] },
          ],
        },
      ],
    };
  }

  if (daysPerWeek === 2) {
    if (consecutive) {
      return {
        splitName: "Superior / Inferior (Upper / Lower — 2x/semana)",
        splitDescription:
          "Como seus dias de treino são seguidos, dividimos em Membros Superiores e Membros Inferiores para evitar fadiga sobreposta.",
        blueprints: [
          {
            id: "A",
            label: "Treino A",
            focus: "Membros Superiores Completo",
            slots: [
              { categories: ["peito"], preferredPatterns: ["empurrar_horizontal"], preferCompound: true },
              { categories: ["costas"], preferredPatterns: ["puxar_vertical"], preferCompound: true },
              { categories: ["ombros"], preferredPatterns: ["empurrar_vertical", "elevacao_lateral"] },
              { categories: ["costas"], preferredPatterns: ["puxar_horizontal"], preferCompound: true },
              { categories: ["peito"], preferredPatterns: ["empurrar_inclinado", "isolado_peito"] },
              { categories: ["triceps"] },
              { categories: ["biceps"] },
              { categories: ["ombros"], preferredPatterns: ["deltoide_posterior", "elevacao_lateral"] },
            ],
          },
          {
            id: "B",
            label: "Treino B",
            focus: "Pernas, Glúteos e Core",
            slots: [
              { categories: ["pernas"], preferredPatterns: ["agachamento_joelho"], preferCompound: true },
              { categories: ["pernas"], preferredPatterns: ["posterior_quadril", "gluteo_quadril"], preferCompound: true },
              { categories: ["pernas"], preferredPatterns: ["unilateral_pernas", "isolado_quadriceps"] },
              { categories: ["pernas"], preferredPatterns: ["isolado_posterior", "gluteo_quadril"] },
              { categories: ["pernas"], preferredPatterns: ["panturrilha"] },
              { categories: ["core"], preferredPatterns: ["core_flexao"] },
              { categories: ["core"], preferredPatterns: ["core_estabilidade"] },
              { categories: ["pernas"], preferredPatterns: ["adutor_abdutor", "gluteo_quadril"] },
            ],
          },
        ],
      };
    }

    return {
      splitName: "Full Body A/B (Corpo Inteiro — 2x/semana)",
      splitDescription:
        "Dois treinos de corpo inteiro com variações complementares de ângulos para estimular cada grupo muscular duas vezes na semana.",
      blueprints: [
        {
          id: "A",
          label: "Treino A",
          focus: "Corpo Inteiro — Ênfase Dominante de Joelho e Empurrar",
          slots: [
            { categories: ["pernas"], preferredPatterns: ["agachamento_joelho"], preferCompound: true },
            { categories: ["peito"], preferredPatterns: ["empurrar_horizontal"], preferCompound: true },
            { categories: ["costas"], preferredPatterns: ["puxar_horizontal"], preferCompound: true },
            { categories: ["pernas"], preferredPatterns: ["isolado_posterior", "gluteo_quadril"] },
            { categories: ["ombros"], preferredPatterns: ["elevacao_lateral", "empurrar_vertical"] },
            { categories: ["triceps"] },
            { categories: ["core"], preferredPatterns: ["core_estabilidade"] },
            { categories: ["pernas"], preferredPatterns: ["panturrilha"] },
          ],
        },
        {
          id: "B",
          label: "Treino B",
          focus: "Corpo Inteiro — Ênfase Posterior, Glúteos e Puxar",
          slots: [
            { categories: ["pernas"], preferredPatterns: ["posterior_quadril", "gluteo_quadril"], preferCompound: true },
            { categories: ["costas"], preferredPatterns: ["puxar_vertical"], preferCompound: true },
            { categories: ["peito"], preferredPatterns: ["empurrar_inclinado", "isolado_peito"] },
            { categories: ["pernas"], preferredPatterns: ["unilateral_pernas", "isolado_quadriceps"] },
            { categories: ["ombros"], preferredPatterns: ["empurrar_vertical", "deltoide_posterior"] },
            { categories: ["biceps"] },
            { categories: ["core"], preferredPatterns: ["core_flexao"] },
            { categories: ["pernas"], preferredPatterns: ["panturrilha"] },
          ],
        },
      ],
    };
  }

  if (daysPerWeek === 3) {
    if (experience === "iniciante" && !consecutive) {
      return {
        splitName: "Full Body A/B/C (Corpo Inteiro — 3x/semana)",
        splitDescription:
          "Frequência ideal para iniciantes em dias alternados: estimula os padrões motores fundamentais com volume controlado por sessão.",
        blueprints: [
          {
            id: "A",
            label: "Treino A",
            focus: "Corpo Inteiro — Base A",
            slots: [
              { categories: ["pernas"], preferredPatterns: ["agachamento_joelho"], preferCompound: true },
              { categories: ["peito"], preferredPatterns: ["empurrar_horizontal"], preferCompound: true },
              { categories: ["costas"], preferredPatterns: ["puxar_vertical"], preferCompound: true },
              { categories: ["pernas"], preferredPatterns: ["isolado_posterior", "posterior_quadril"] },
              { categories: ["ombros"], preferredPatterns: ["elevacao_lateral"] },
              { categories: ["biceps"] },
              { categories: ["core"], preferredPatterns: ["core_estabilidade"] },
            ],
          },
          {
            id: "B",
            label: "Treino B",
            focus: "Corpo Inteiro — Base B",
            slots: [
              { categories: ["pernas"], preferredPatterns: ["posterior_quadril", "gluteo_quadril"], preferCompound: true },
              { categories: ["costas"], preferredPatterns: ["puxar_horizontal"], preferCompound: true },
              { categories: ["peito"], preferredPatterns: ["empurrar_inclinado", "empurrar_horizontal"] },
              { categories: ["pernas"], preferredPatterns: ["isolado_quadriceps", "unilateral_pernas"] },
              { categories: ["ombros"], preferredPatterns: ["empurrar_vertical"] },
              { categories: ["triceps"] },
              { categories: ["pernas"], preferredPatterns: ["panturrilha"] },
            ],
          },
          {
            id: "C",
            label: "Treino C",
            focus: "Corpo Inteiro — Base C",
            slots: [
              { categories: ["pernas"], preferredPatterns: ["unilateral_pernas", "agachamento_joelho"], preferCompound: true },
              { categories: ["peito"], preferredPatterns: ["empurrar_horizontal", "isolado_peito"] },
              { categories: ["costas"], preferredPatterns: ["puxar_vertical", "puxar_horizontal"] },
              { categories: ["pernas"], preferredPatterns: ["gluteo_quadril"] },
              { categories: ["ombros"], preferredPatterns: ["deltoide_posterior", "elevacao_lateral"] },
              { categories: ["biceps", "triceps"] },
              { categories: ["core"], preferredPatterns: ["core_flexao"] },
            ],
          },
        ],
      };
    }

    return {
      splitName: "ABC — Empurrar / Puxar / Pernas (Push / Pull / Legs)",
      splitDescription:
        "Divisão clássica em 3 sessões que agrupa músculos sinérgicos, garantindo excelente recuperação mesmo quando há dias consecutivos.",
      blueprints: [
        {
          id: "A",
          label: "Treino A",
          focus: "Empurrar — Peitoral, Ombros e Tríceps",
          slots: [
            { categories: ["peito"], preferredPatterns: ["empurrar_horizontal"], preferCompound: true },
            { categories: ["peito"], preferredPatterns: ["empurrar_inclinado"], preferCompound: true },
            { categories: ["ombros"], preferredPatterns: ["empurrar_vertical"], preferCompound: true },
            { categories: ["peito"], preferredPatterns: ["isolado_peito"] },
            { categories: ["ombros"], preferredPatterns: ["elevacao_lateral"] },
            { categories: ["triceps"], preferredPatterns: ["extensao_triceps"] },
            { categories: ["triceps"], preferredPatterns: ["extensao_triceps"] },
            { categories: ["ombros"], preferredPatterns: ["elevacao_frontal"] },
          ],
        },
        {
          id: "B",
          label: "Treino B",
          focus: "Puxar — Costas, Deltoide Posterior e Bíceps",
          slots: [
            { categories: ["costas"], preferredPatterns: ["puxar_vertical"], preferCompound: true },
            { categories: ["costas"], preferredPatterns: ["puxar_horizontal"], preferCompound: true },
            { categories: ["costas"], preferredPatterns: ["puxar_horizontal", "puxar_vertical"] },
            { categories: ["ombros"], preferredPatterns: ["deltoide_posterior"] },
            { categories: ["biceps"], preferredPatterns: ["rosca_biceps"] },
            { categories: ["biceps"], preferredPatterns: ["rosca_biceps"] },
            { categories: ["core"], preferredPatterns: ["core_flexao", "core_estabilidade"] },
            { categories: ["costas"], preferredPatterns: ["hinge_costas", "puxar_vertical"] },
          ],
        },
        {
          id: "C",
          label: "Treino C",
          focus: "Inferiores — Quadríceps, Posteriores, Glúteos e Panturrilhas",
          slots: [
            { categories: ["pernas"], preferredPatterns: ["agachamento_joelho"], preferCompound: true },
            { categories: ["pernas"], preferredPatterns: ["posterior_quadril"], preferCompound: true },
            { categories: ["pernas"], preferredPatterns: ["unilateral_pernas", "agachamento_joelho"] },
            { categories: ["pernas"], preferredPatterns: ["isolado_quadriceps"] },
            { categories: ["pernas"], preferredPatterns: ["isolado_posterior"] },
            { categories: ["pernas"], preferredPatterns: ["gluteo_quadril"] },
            { categories: ["pernas"], preferredPatterns: ["panturrilha"] },
            { categories: ["core"], preferredPatterns: ["core_estabilidade"] },
          ],
        },
      ],
    };
  }

  if (daysPerWeek === 4) {
    return {
      splitName: "Upper / Lower 2x (Superior / Inferior — 4 dias)",
      splitDescription:
        "Combinação ideal entre frequência (2x por semana para cada grupo muscular) e recuperação entre sessões.",
      blueprints: [
        {
          id: "A",
          label: "Treino A",
          focus: "Superior A — Ênfase Peitoral e Largura de Costas",
          slots: [
            { categories: ["peito"], preferredPatterns: ["empurrar_horizontal"], preferCompound: true },
            { categories: ["costas"], preferredPatterns: ["puxar_vertical"], preferCompound: true },
            { categories: ["peito"], preferredPatterns: ["empurrar_inclinado"] },
            { categories: ["costas"], preferredPatterns: ["puxar_horizontal"] },
            { categories: ["ombros"], preferredPatterns: ["elevacao_lateral"] },
            { categories: ["triceps"] },
            { categories: ["biceps"] },
            { categories: ["ombros"], preferredPatterns: ["deltoide_posterior"] },
          ],
        },
        {
          id: "B",
          label: "Treino B",
          focus: "Inferior A — Ênfase Quadríceps, Glúteos e Core",
          slots: [
            { categories: ["pernas"], preferredPatterns: ["agachamento_joelho"], preferCompound: true },
            { categories: ["pernas"], preferredPatterns: ["posterior_quadril"], preferCompound: true },
            { categories: ["pernas"], preferredPatterns: ["unilateral_pernas"] },
            { categories: ["pernas"], preferredPatterns: ["isolado_quadriceps"] },
            { categories: ["pernas"], preferredPatterns: ["gluteo_quadril"] },
            { categories: ["pernas"], preferredPatterns: ["panturrilha"] },
            { categories: ["core"], preferredPatterns: ["core_estabilidade"] },
            { categories: ["pernas"], preferredPatterns: ["adutor_abdutor"] },
          ],
        },
        {
          id: "C",
          label: "Treino C",
          focus: "Superior B — Ênfase Ombros, Densidade Dorsal e Braços",
          slots: [
            { categories: ["ombros"], preferredPatterns: ["empurrar_vertical"], preferCompound: true },
            { categories: ["costas"], preferredPatterns: ["puxar_horizontal"], preferCompound: true },
            { categories: ["peito"], preferredPatterns: ["empurrar_inclinado", "empurrar_horizontal"] },
            { categories: ["costas"], preferredPatterns: ["puxar_vertical"] },
            { categories: ["peito"], preferredPatterns: ["isolado_peito"] },
            { categories: ["ombros"], preferredPatterns: ["elevacao_lateral", "deltoide_posterior"] },
            { categories: ["biceps"] },
            { categories: ["triceps"] },
          ],
        },
        {
          id: "D",
          label: "Treino D",
          focus: "Inferior B — Ênfase Posterior de Coxa, Glúteos e Abdômen",
          slots: [
            { categories: ["pernas"], preferredPatterns: ["posterior_quadril", "gluteo_quadril"], preferCompound: true },
            { categories: ["pernas"], preferredPatterns: ["agachamento_joelho"], preferCompound: true },
            { categories: ["pernas"], preferredPatterns: ["isolado_posterior"] },
            { categories: ["pernas"], preferredPatterns: ["gluteo_quadril"] },
            { categories: ["pernas"], preferredPatterns: ["isolado_quadriceps", "unilateral_pernas"] },
            { categories: ["pernas"], preferredPatterns: ["panturrilha"] },
            { categories: ["core"], preferredPatterns: ["core_flexao"] },
            { categories: ["core"], preferredPatterns: ["core_rotacao"] },
          ],
        },
      ],
    };
  }

  if (daysPerWeek === 5) {
    return {
      splitName: "Upper / Lower + Push / Pull / Legs (5 dias)",
      splitDescription:
        "Divisão híbrida de 5 dias que distribui o volume semanal com alta qualidade técnica e ótima recuperação articular.",
      blueprints: [
        {
          id: "A",
          label: "Treino A",
          focus: "Superior Completo (Força Base)",
          slots: [
            { categories: ["peito"], preferredPatterns: ["empurrar_horizontal"], preferCompound: true },
            { categories: ["costas"], preferredPatterns: ["puxar_horizontal"], preferCompound: true },
            { categories: ["ombros"], preferredPatterns: ["empurrar_vertical"], preferCompound: true },
            { categories: ["costas"], preferredPatterns: ["puxar_vertical"] },
            { categories: ["peito"], preferredPatterns: ["isolado_peito"] },
            { categories: ["biceps"] },
            { categories: ["triceps"] },
          ],
        },
        {
          id: "B",
          label: "Treino B",
          focus: "Inferior Completo (Força Base)",
          slots: [
            { categories: ["pernas"], preferredPatterns: ["agachamento_joelho"], preferCompound: true },
            { categories: ["pernas"], preferredPatterns: ["posterior_quadril"], preferCompound: true },
            { categories: ["pernas"], preferredPatterns: ["unilateral_pernas"] },
            { categories: ["pernas"], preferredPatterns: ["isolado_posterior"] },
            { categories: ["pernas"], preferredPatterns: ["panturrilha"] },
            { categories: ["core"], preferredPatterns: ["core_estabilidade"] },
            { categories: ["pernas"], preferredPatterns: ["gluteo_quadril"] },
          ],
        },
        {
          id: "C",
          label: "Treino C",
          focus: "Empurrar — Peitoral, Ombros e Tríceps",
          slots: [
            { categories: ["peito"], preferredPatterns: ["empurrar_inclinado"], preferCompound: true },
            { categories: ["peito"], preferredPatterns: ["empurrar_horizontal", "isolado_peito"] },
            { categories: ["ombros"], preferredPatterns: ["empurrar_vertical", "elevacao_lateral"] },
            { categories: ["ombros"], preferredPatterns: ["elevacao_lateral"] },
            { categories: ["triceps"] },
            { categories: ["triceps"] },
            { categories: ["core"], preferredPatterns: ["core_flexao"] },
          ],
        },
        {
          id: "D",
          label: "Treino D",
          focus: "Puxar — Costas, Posterior de Ombro e Bíceps",
          slots: [
            { categories: ["costas"], preferredPatterns: ["puxar_vertical"], preferCompound: true },
            { categories: ["costas"], preferredPatterns: ["puxar_horizontal"], preferCompound: true },
            { categories: ["costas"], preferredPatterns: ["puxar_horizontal", "puxar_vertical"] },
            { categories: ["ombros"], preferredPatterns: ["deltoide_posterior"] },
            { categories: ["biceps"] },
            { categories: ["biceps"] },
            { categories: ["core"], preferredPatterns: ["core_rotacao", "core_flexao"] },
          ],
        },
        {
          id: "E",
          label: "Treino E",
          focus: "Pernas e Glúteos (Hipertrofia e Detalhamento)",
          slots: [
            { categories: ["pernas"], preferredPatterns: ["gluteo_quadril", "agachamento_joelho"], preferCompound: true },
            { categories: ["pernas"], preferredPatterns: ["isolado_quadriceps"] },
            { categories: ["pernas"], preferredPatterns: ["isolado_posterior"] },
            { categories: ["pernas"], preferredPatterns: ["unilateral_pernas"] },
            { categories: ["pernas"], preferredPatterns: ["adutor_abdutor", "gluteo_quadril"] },
            { categories: ["pernas"], preferredPatterns: ["panturrilha"] },
            { categories: ["core"], preferredPatterns: ["core_estabilidade"] },
          ],
        },
      ],
    };
  }

  // 6 dias
  return {
    splitName: "ABC 2x — Push / Pull / Legs (6 dias)",
    splitDescription:
      "Divisão avançada de 6 sessões semanais que trabalha cada grupamento duas vezes na semana com foco específico por padrão motor.",
    blueprints: [
      {
        id: "A",
        label: "Treino A",
        focus: "Push A — Peitoral, Ombros e Tríceps (Ênfase Base)",
        slots: [
          { categories: ["peito"], preferredPatterns: ["empurrar_horizontal"], preferCompound: true },
          { categories: ["peito"], preferredPatterns: ["empurrar_inclinado"], preferCompound: true },
          { categories: ["ombros"], preferredPatterns: ["empurrar_vertical"] },
          { categories: ["ombros"], preferredPatterns: ["elevacao_lateral"] },
          { categories: ["triceps"] },
          { categories: ["triceps"] },
        ],
      },
      {
        id: "B",
        label: "Treino B",
        focus: "Pull A — Costas, Trapézio e Bíceps (Ênfase Largura)",
        slots: [
          { categories: ["costas"], preferredPatterns: ["puxar_vertical"], preferCompound: true },
          { categories: ["costas"], preferredPatterns: ["puxar_horizontal"], preferCompound: true },
          { categories: ["costas"], preferredPatterns: ["puxar_vertical"] },
          { categories: ["ombros"], preferredPatterns: ["deltoide_posterior"] },
          { categories: ["biceps"] },
          { categories: ["biceps"] },
        ],
      },
      {
        id: "C",
        label: "Treino C",
        focus: "Legs A — Quadríceps, Posteriores, Panturrilha e Core",
        slots: [
          { categories: ["pernas"], preferredPatterns: ["agachamento_joelho"], preferCompound: true },
          { categories: ["pernas"], preferredPatterns: ["posterior_quadril"], preferCompound: true },
          { categories: ["pernas"], preferredPatterns: ["isolado_quadriceps"] },
          { categories: ["pernas"], preferredPatterns: ["isolado_posterior"] },
          { categories: ["pernas"], preferredPatterns: ["panturrilha"] },
          { categories: ["core"], preferredPatterns: ["core_estabilidade"] },
        ],
      },
      {
        id: "D",
        label: "Treino D",
        focus: "Push B — Peitoral, Ombros e Tríceps (Variação de Ângulos)",
        slots: [
          { categories: ["peito"], preferredPatterns: ["empurrar_inclinado"], preferCompound: true },
          { categories: ["peito"], preferredPatterns: ["isolado_peito"] },
          { categories: ["ombros"], preferredPatterns: ["empurrar_vertical", "elevacao_lateral"] },
          { categories: ["ombros"], preferredPatterns: ["elevacao_lateral", "elevacao_frontal"] },
          { categories: ["triceps"] },
          { categories: ["triceps"] },
        ],
      },
      {
        id: "E",
        label: "Treino E",
        focus: "Pull B — Costas, Deltoide Posterior e Bíceps (Ênfase Espessura)",
        slots: [
          { categories: ["costas"], preferredPatterns: ["puxar_horizontal"], preferCompound: true },
          { categories: ["costas"], preferredPatterns: ["puxar_vertical"], preferCompound: true },
          { categories: ["costas"], preferredPatterns: ["puxar_horizontal"] },
          { categories: ["ombros"], preferredPatterns: ["deltoide_posterior"] },
          { categories: ["biceps"] },
          { categories: ["biceps"] },
        ],
      },
      {
        id: "F",
        label: "Treino F",
        focus: "Legs B — Glúteos, Unilateral, Posteriores e Abdômen",
        slots: [
          { categories: ["pernas"], preferredPatterns: ["gluteo_quadril"], preferCompound: true },
          { categories: ["pernas"], preferredPatterns: ["unilateral_pernas"], preferCompound: true },
          { categories: ["pernas"], preferredPatterns: ["isolado_posterior", "posterior_quadril"] },
          { categories: ["pernas"], preferredPatterns: ["adutor_abdutor", "isolado_quadriceps"] },
          { categories: ["pernas"], preferredPatterns: ["panturrilha"] },
          { categories: ["core"], preferredPatterns: ["core_flexao"] },
        ],
      },
    ],
  };
}

function applyPriorityToSlots(
  slots: SlotSpec[],
  priority: PriorityGroup
): { orderedSlots: SlotSpec[]; priorityCategories: string[] } {
  if (priority === "equilibrado") {
    return { orderedSlots: slots, priorityCategories: [] };
  }

  const priorityCategories =
    priority === "bracos" ? ["biceps", "triceps"] : [priority];

  // Move slots do grupo prioritário para o início da sessão (quando aplicável)
  const matching: SlotSpec[] = [];
  const others: SlotSpec[] = [];
  for (const s of slots) {
    if (s.categories.some((c) => priorityCategories.includes(c))) {
      matching.push(s);
    } else {
      others.push(s);
    }
  }

  const orderedSlots = [...matching, ...others];
  // Se a sessão já trabalha o grupo prioritário, adiciona 1 slot extra de ênfase
  if (matching.length > 0) {
    orderedSlots.splice(matching.length, 0, {
      categories: priorityCategories,
    });
  }

  return { orderedSlots, priorityCategories };
}

export function generateWorkoutPlan(
  answers: QuestionnaireAnswers
): GenerationOutcome {
  // 1. Validação de Segurança (Dor / Restrição)
  if (
    (answers.painStatus === "sim" || answers.painStatus === "nao_tenho_certeza") &&
    !answers.canProceedWithCustomExclusions
  ) {
    return {
      status: "safety_blocked",
      reason:
        "Como você relatou dor ou incerteza sobre uma restrição física que não pode ser avaliada automaticamente com segurança, pausamos a geração automática do treino. O Montador de Treinos é uma ferramenta de organização de exercícios e não realiza diagnóstico clínico nem prescrição de reabilitação. Recomendamos buscar orientação presencial de um médico, fisioterapeuta ou profissional de Educação Física antes de iniciar.",
    };
  }

  // 2. Filtra exercícios compatíveis com equipamentos e não evitados
  const avoidedSet = new Set(answers.avoidedExerciseIds);
  const compatiblePool = ENRICHED_EXERCISES.filter(
    (ex) =>
      !avoidedSet.has(ex.id) &&
      isExerciseCompatibleWithEquipment(ex, answers.equipment, answers.location)
  );

  // Verifica se há exercícios mínimos nos pilares principais (empurrar, puxar, inferiores)
  const missingAreas: string[] = [];
  const hasPush = compatiblePool.some(
    (e) => e.categoryId === "peito" || e.categoryId === "ombros" || e.categoryId === "triceps"
  );
  const hasPull = compatiblePool.some(
    (e) => e.categoryId === "costas" || e.categoryId === "biceps"
  );
  const hasLegs = compatiblePool.some((e) => e.categoryId === "pernas");

  if (!hasPush) missingAreas.push("Empurrar (Peitoral / Ombros / Tríceps)");
  if (!hasPull) missingAreas.push("Puxar (Costas / Bíceps)");
  if (!hasLegs) missingAreas.push("Membros Inferiores (Pernas e Glúteos)");

  if (missingAreas.length > 0 || compatiblePool.length < 4) {
    return {
      status: "insufficient_exercises",
      reason:
        "Não encontramos exercícios compatíveis suficientes na biblioteca para montar uma rotina equilibrada e segura com a combinação atual de equipamentos e restrições de exercícios.",
      missingAreas,
    };
  }

  // 3. Constrói a divisão semanal
  const { splitName, splitDescription, blueprints } =
    buildSplitBlueprints(answers);

  const targetCountPerSession = getTargetExerciseCount(
    answers.sessionDurationMinutes,
    answers.goal,
    answers.experience
  );

  const sortedDays = [...answers.selectedDays].sort(
    (a, b) =>
      (WEEK_DAYS.find((w) => w.id === a)?.index ?? 0) -
      (WEEK_DAYS.find((w) => w.id === b)?.index ?? 0)
  );

  const globallyUsedExerciseIds = new Set<string>();
  const sessions: WorkoutSessionPlan[] = [];

  blueprints.forEach((bp, idx) => {
    const { orderedSlots, priorityCategories } = applyPriorityToSlots(
      bp.slots,
      answers.priority
    );

    const sessionExercises: PrescribedExercise[] = [];
    const sessionUsedIds = new Set<string>();

    for (const slot of orderedSlots) {
      if (sessionExercises.length >= targetCountPerSession) break;

      // Busca candidatos compatíveis para o slot
      let candidates = compatiblePool.filter(
        (ex) =>
          slot.categories.includes(ex.categoryId) &&
          !sessionUsedIds.has(ex.id)
      );

      if (candidates.length === 0) continue;

      // Ordena candidatos de forma determinística
      candidates.sort((a, b) => {
        const aPatternMatch =
          slot.preferredPatterns && slot.preferredPatterns.includes(a.pattern)
            ? 25
            : 0;
        const bPatternMatch =
          slot.preferredPatterns && slot.preferredPatterns.includes(b.pattern)
            ? 25
            : 0;

        const aCompoundBonus =
          slot.preferCompound && a.isCompound ? 12 : 0;
        const bCompoundBonus =
          slot.preferCompound && b.isCompound ? 12 : 0;

        // Prefere variar exercícios entre os treinos A/B/C quando possível
        const aFreshBonus = !globallyUsedExerciseIds.has(a.id) ? 15 : 0;
        const bFreshBonus = !globallyUsedExerciseIds.has(b.id) ? 15 : 0;

        const scoreA =
          aPatternMatch +
          aCompoundBonus +
          aFreshBonus +
          getLevelScore(a, answers.experience, answers.goal);
        const scoreB =
          bPatternMatch +
          bCompoundBonus +
          bFreshBonus +
          getLevelScore(b, answers.experience, answers.goal);

        if (scoreB !== scoreA) return scoreB - scoreA;
        return a.order - b.order;
      });

      const chosen = candidates[0];
      sessionUsedIds.add(chosen.id);
      globallyUsedExerciseIds.add(chosen.id);

      const isPriority = priorityCategories.includes(chosen.categoryId);
      const { sets, reps, restSeconds } = getPrescriptionParams(
        chosen,
        answers.goal,
        answers.experience,
        isPriority
      );

      sessionExercises.push({
        exercise: chosen,
        sets,
        reps,
        restSeconds,
        executionTip: chosen.executionCue,
        isPriorityBonus: isPriority,
      });
    }

    // Ajusta caso a duração estimada ultrapasse muito o limite escolhido (ex: treinos de 20 ou 30 min)
    while (
      sessionExercises.length > 3 &&
      estimateSessionDurationMinutes(sessionExercises) >
        answers.sessionDurationMinutes + 7
    ) {
      sessionExercises.pop();
    }

    const assignedDay = sortedDays[idx] ? [sortedDays[idx]] : [];

    sessions.push({
      id: bp.id,
      label: bp.label,
      focus:
        answers.priority !== "equilibrado" &&
        sessionExercises.some((e) => e.isPriorityBonus)
          ? `${bp.focus} (Ênfase: ${
              PRIORITY_OPTIONS.find((p) => p.id === answers.priority)?.label
            })`
          : bp.focus,
      assignedDays: assignedDay,
      estimatedMinutes: estimateSessionDurationMinutes(sessionExercises),
      exercises: sessionExercises,
    });
  });

  const incompleteSessions = sessions.filter((s) => s.exercises.length < 3);
  if (incompleteSessions.length > 0) {
    return {
      status: "insufficient_exercises",
      reason:
        "Com os equipamentos selecionados e os exercícios marcados para evitar, não há exercícios compatíveis suficientes na biblioteca para completar todas as sessões da divisão escolhida sem repetir ou improvisar.",
      missingAreas: incompleteSessions.map((s) => `${s.label} (${s.focus})`),
    };
  }

  // 4. Monta explicação transparente de como as respostas moldaram o treino
  const personalizationSummary: string[] = [
    `Objetivo (${GOAL_LABELS[answers.goal].title}): séries, faixas de repetições e intervalos ajustados para priorizar ${
      answers.goal === "forca"
        ? "tensão mecânica em exercícios compostos e recuperação neural entre séries"
        : answers.goal === "hipertrofia"
        ? "volume efetivo de séries (8 a 15 repetições) e progressão consistente"
        : answers.goal === "emagrecimento"
        ? "densidade de treino e manutenção de massa muscular com intervalos dinâmicos (o treino auxilia no gasto energético e condicionamento, sem substituir o controle alimentar)"
        : "estímulo global equilibrado, saúde articular e aderência à rotina"
    }.`,
    `Frequência (${answers.daysPerWeek}x/semana) e Nível (${EXPERIENCE_LABELS[answers.experience].title}): estrutura definida como "${splitName}" considerando seus dias selecionados (${sortedDays
      .map((d) => WEEK_DAYS.find((w) => w.id === d)?.short)
      .join(", ")}).`,
    `Tempo disponível (${answers.sessionDurationMinutes} min): volume calibrado para ~${sessions[0]?.exercises.length || 4} exercícios por sessão, contabilizando aquecimento, execução das séries, descanso e transição.`,
  ];

  if (answers.priority !== "equilibrado") {
    const prioLabel = PRIORITY_OPTIONS.find(
      (p) => p.id === answers.priority
    )?.label;
    personalizationSummary.push(
      `Prioridade Muscular (${prioLabel}): posicionado no início das sessões correspondentes (maior energia) com estímulo adicional, sem deixar de trabalhar o restante do corpo.`
    );
  }

  if (answers.avoidedExerciseIds.length > 0) {
    personalizationSummary.push(
      `Preferências respeitadas: ${answers.avoidedExerciseIds.length} exercício(s) marcado(s) para evitar foram excluídos e substituídos por equivalentes biomecânicos.`
    );
  }

  let limitationsNote: string | undefined;
  const onlyBodyweight =
    answers.equipment.length === 1 && answers.equipment[0] === "peso_corporal";
  if (onlyBodyweight) {
    limitationsNote =
      "Nota sobre equipamento (Apenas peso corporal): selecionamos exclusivamente os exercícios calistênicos presentes na biblioteca oficial (flexões, barra fixa, passadas, búlgaro, elevação pélvica, panturrilha e core). Para isolar ombros ou bíceps com mais variações no futuro, basta incluir halteres ou polias.";
  }

  return {
    status: "ok",
    plan: {
      id: "PLAN_" + Date.now(),
      createdAt: new Date().toISOString(),
      answers,
      splitName,
      splitDescription,
      personalizationSummary,
      loadGuidance:
        "Como escolher a carga (sem adivinhação): escolha um peso que permita completar a faixa de repetições com técnica limpa, encerrando a série com 1 a 3 repetições na reserva (RIR 1–3) — ou seja, sentindo que conseguiria fazer no máximo mais 1 a 3 repetições mantendo a postura. Registre os pesos usados ao iniciar o treino para acompanhar sua evolução.",
      sessions,
      limitationsNote,
    },
  };
}

export function getCompatibleAlternatives(
  currentExercise: EnrichedExercise,
  currentSessionExerciseIds: string[],
  answers: QuestionnaireAnswers
): EnrichedExercise[] {
  const avoidedSet = new Set(answers.avoidedExerciseIds);
  const inSessionSet = new Set(currentSessionExerciseIds);

  const sameCategory = ENRICHED_EXERCISES.filter(
    (ex) =>
      ex.id !== currentExercise.id &&
      !avoidedSet.has(ex.id) &&
      !inSessionSet.has(ex.id) &&
      ex.categoryId === currentExercise.categoryId &&
      isExerciseCompatibleWithEquipment(ex, answers.equipment, answers.location)
  );

  if (sameCategory.length > 0) {
    return sameCategory.sort((a, b) => {
      const aSamePattern = a.pattern === currentExercise.pattern ? 1 : 0;
      const bSamePattern = b.pattern === currentExercise.pattern ? 1 : 0;
      if (bSamePattern !== aSamePattern) return bSamePattern - aSamePattern;
      return (
        getLevelScore(b, answers.experience, answers.goal) -
        getLevelScore(a, answers.experience, answers.goal)
      );
    });
  }

  // Fallback para grupos sinérgicos caso os equipamentos restrinjam a mesma categoria
  const synergisticMap: Record<string, string[]> = {
    peito: ["ombros", "triceps", "core"],
    ombros: ["peito", "triceps", "core"],
    triceps: ["peito", "ombros", "core"],
    costas: ["biceps", "core"],
    biceps: ["costas", "core"],
    pernas: ["core"],
    core: ["pernas"],
  };
  const fallbackCats = synergisticMap[currentExercise.categoryId] || [];

  return ENRICHED_EXERCISES.filter(
    (ex) =>
      ex.id !== currentExercise.id &&
      !avoidedSet.has(ex.id) &&
      !inSessionSet.has(ex.id) &&
      fallbackCats.includes(ex.categoryId) &&
      isExerciseCompatibleWithEquipment(ex, answers.equipment, answers.location)
  );
}
