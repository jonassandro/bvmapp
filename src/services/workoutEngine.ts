import { EXERCISES } from '../data/mockData';
import {
  Exercise,
  WorkoutAnswers,
  WorkoutDay,
  WorkoutExerciseItem,
  WorkoutFrequency,
  WorkoutPlan,
  WorkoutDuration,
  WorkoutLevel,
  WorkoutObjective,
  WorkoutLocation,
} from '../types';
import {
  EXERCISE_META,
  isCompoundExercise,
  isExerciseCompatibleWithLocation,
} from './exerciseClassification';

/**
 * Frases seguras de orientação técnica para cada exercício
 */
const COACHING_NOTES = [
  'Priorize execução controlada e postura correta.',
  'Evite perder a técnica ao aumentar a carga.',
  'Use amplitude confortável e cadência controlada.',
  'Ajuste a carga para manter a boa forma em todas as séries.',
  'Controle a fase excêntrica e evite impulsos.',
  'Mantenha a musculatura alvo sob tensão constante.',
  'Respire de forma contínua durante todo o movimento.',
];

/**
 * Definição dos slots musculares de um dia de treino
 */
interface DaySlotTemplate {
  name: string;
  category: 'peito' | 'costas' | 'ombros' | 'biceps' | 'triceps' | 'pernas' | 'core';
  preferCompound?: boolean;
  priorityEligible?: boolean;
}

interface SplitDayTemplate {
  dayName: string;
  targetMuscles: string[];
  slots: DaySlotTemplate[];
}

/**
 * Estruturas de treino baseadas na frequência semanal (Splits)
 */
export function chooseSplit(frequency: WorkoutFrequency): {
  splitName: string;
  days: SplitDayTemplate[];
} {
  switch (frequency) {
    case 2:
      return {
        splitName: 'Full Body A / B',
        days: [
          {
            dayName: 'Treino A - Full Body (Foco Empurrar & Quadríceps)',
            targetMuscles: ['peito', 'pernas', 'costas', 'ombros', 'triceps', 'core'],
            slots: [
              { name: 'Peito Composto', category: 'peito', preferCompound: true, priorityEligible: true },
              { name: 'Quadríceps Composto', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Costas Remada', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Ombros Desenvolvimento', category: 'ombros', preferCompound: true, priorityEligible: true },
              { name: 'Tríceps Isolador', category: 'triceps', preferCompound: false, priorityEligible: true },
              { name: 'Core Estabilidade', category: 'core', preferCompound: false, priorityEligible: false },
              { name: 'Posteriores / Panturrilha', category: 'pernas', preferCompound: false, priorityEligible: true },
              { name: 'Bíceps / Acessório', category: 'biceps', preferCompound: false, priorityEligible: true },
            ],
          },
          {
            dayName: 'Treino B - Full Body (Foco Puxar & Posterior/Glúteo)',
            targetMuscles: ['costas', 'pernas', 'peito', 'ombros', 'biceps', 'pernas'],
            slots: [
              { name: 'Costas Puxada', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Posterior / Glúteo Composto', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Peito Inclinado/Acessório', category: 'peito', preferCompound: true, priorityEligible: true },
              { name: 'Ombros Lateral', category: 'ombros', preferCompound: false, priorityEligible: true },
              { name: 'Bíceps Isolador', category: 'biceps', preferCompound: false, priorityEligible: true },
              { name: 'Panturrilha', category: 'pernas', preferCompound: false, priorityEligible: false },
              { name: 'Tríceps / Acessório', category: 'triceps', preferCompound: false, priorityEligible: true },
              { name: 'Core / Abdômen', category: 'core', preferCompound: false, priorityEligible: false },
            ],
          },
        ],
      };

    case 3:
      return {
        splitName: 'Full Body A / B / C',
        days: [
          {
            dayName: 'Treino A - Full Body (Base & Força Geral)',
            targetMuscles: ['peito', 'pernas', 'costas', 'ombros', 'triceps', 'core'],
            slots: [
              { name: 'Peito Principal', category: 'peito', preferCompound: true, priorityEligible: true },
              { name: 'Quadríceps Composto', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Costas Remada', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Ombros Lateral', category: 'ombros', preferCompound: false, priorityEligible: true },
              { name: 'Tríceps Isolador', category: 'triceps', preferCompound: false, priorityEligible: true },
              { name: 'Core', category: 'core', preferCompound: false, priorityEligible: false },
              { name: 'Bíceps Complementar', category: 'biceps', preferCompound: false, priorityEligible: true },
              { name: 'Panturrilha', category: 'pernas', preferCompound: false, priorityEligible: false },
            ],
          },
          {
            dayName: 'Treino B - Full Body (Puxada & Posteriores)',
            targetMuscles: ['costas', 'pernas', 'peito', 'ombros', 'biceps', 'pernas'],
            slots: [
              { name: 'Costas Puxada', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Posterior de Coxa', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Peito Secundário', category: 'peito', preferCompound: false, priorityEligible: true },
              { name: 'Ombros Posterior', category: 'ombros', preferCompound: false, priorityEligible: true },
              { name: 'Bíceps Rosca', category: 'biceps', preferCompound: false, priorityEligible: true },
              { name: 'Panturrilha', category: 'pernas', preferCompound: false, priorityEligible: false },
              { name: 'Tríceps / Cabo', category: 'triceps', preferCompound: false, priorityEligible: true },
              { name: 'Core', category: 'core', preferCompound: false, priorityEligible: false },
            ],
          },
          {
            dayName: 'Treino C - Full Body (Glúteos, Ombros & Braços)',
            targetMuscles: ['pernas', 'ombros', 'peito', 'costas', 'biceps', 'triceps'],
            slots: [
              { name: 'Pernas / Agachamento ou Afundo', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Ombros Desenvolvimento', category: 'ombros', preferCompound: true, priorityEligible: true },
              { name: 'Costas Remada Unilateral', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Peito Isolador ou Inclinado', category: 'peito', preferCompound: false, priorityEligible: true },
              { name: 'Bíceps Isolador', category: 'biceps', preferCompound: false, priorityEligible: true },
              { name: 'Tríceps Francês / Testa', category: 'triceps', preferCompound: false, priorityEligible: true },
              { name: 'Glúteo / Posterior', category: 'pernas', preferCompound: false, priorityEligible: true },
              { name: 'Core Prancha', category: 'core', preferCompound: false, priorityEligible: false },
            ],
          },
        ],
      };

    case 4:
      return {
        splitName: 'Upper / Lower (A & B)',
        days: [
          {
            dayName: 'Treino A - Upper (Foco Peitoral & Ombros)',
            targetMuscles: ['peito', 'costas', 'ombros', 'triceps', 'biceps'],
            slots: [
              { name: 'Peito Reto Composto', category: 'peito', preferCompound: true, priorityEligible: true },
              { name: 'Costas Remada', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Peito Inclinado', category: 'peito', preferCompound: true, priorityEligible: true },
              { name: 'Ombros Desenvolvimento', category: 'ombros', preferCompound: true, priorityEligible: true },
              { name: 'Elevação Lateral', category: 'ombros', preferCompound: false, priorityEligible: true },
              { name: 'Tríceps', category: 'triceps', preferCompound: false, priorityEligible: true },
              { name: 'Bíceps', category: 'biceps', preferCompound: false, priorityEligible: true },
              { name: 'Peito Isolador', category: 'peito', preferCompound: false, priorityEligible: true },
            ],
          },
          {
            dayName: 'Treino B - Lower (Foco Quadríceps)',
            targetMuscles: ['pernas', 'pernas', 'pernas', 'pernas', 'core'],
            slots: [
              { name: 'Quadríceps Composto Principal', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Leg Press ou Agachamento Unilateral', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Cadeira Extensora', category: 'pernas', preferCompound: false, priorityEligible: true },
              { name: 'Stiff ou RDL Posterior', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Mesa/Cadeira Flexora', category: 'pernas', preferCompound: false, priorityEligible: true },
              { name: 'Panturrilha em Pé', category: 'pernas', preferCompound: false, priorityEligible: false },
              { name: 'Core Abdominal', category: 'core', preferCompound: false, priorityEligible: false },
              { name: 'Glúteo / Elevação Pélvica', category: 'pernas', preferCompound: true, priorityEligible: true },
            ],
          },
          {
            dayName: 'Treino C - Upper (Foco Costas & Braços)',
            targetMuscles: ['costas', 'peito', 'costas', 'ombros', 'biceps', 'triceps'],
            slots: [
              { name: 'Costas Puxada Vertical', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Peito Supino Halteres', category: 'peito', preferCompound: true, priorityEligible: true },
              { name: 'Costas Remada Baixa/Serrote', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Ombros Posterior / Face Pull', category: 'ombros', preferCompound: false, priorityEligible: true },
              { name: 'Bíceps Rosca Direta', category: 'biceps', preferCompound: false, priorityEligible: true },
              { name: 'Tríceps Pulley ou Testa', category: 'triceps', preferCompound: false, priorityEligible: true },
              { name: 'Bíceps Martelo', category: 'biceps', preferCompound: false, priorityEligible: true },
              { name: 'Elevação Lateral', category: 'ombros', preferCompound: false, priorityEligible: true },
            ],
          },
          {
            dayName: 'Treino D - Lower (Foco Posteriores & Glúteos)',
            targetMuscles: ['pernas', 'pernas', 'pernas', 'pernas', 'core'],
            slots: [
              { name: 'Posterior Composto (Stiff / RDL)', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Hip Thrust ou Elevação Pélvica', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Agachamento Búlgaro ou Passada', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Mesa Flexora', category: 'pernas', preferCompound: false, priorityEligible: true },
              { name: 'Panturrilha Sentada ou em Pé', category: 'pernas', preferCompound: false, priorityEligible: false },
              { name: 'Cadeira Abdutora ou Glúteo Cabo', category: 'pernas', preferCompound: false, priorityEligible: true },
              { name: 'Core Prancha', category: 'core', preferCompound: false, priorityEligible: false },
              { name: 'Extensora Leve', category: 'pernas', preferCompound: false, priorityEligible: false },
            ],
          },
        ],
      };

    case 5:
      return {
        splitName: 'Push / Pull / Legs + Upper / Lower',
        days: [
          {
            dayName: 'Treino A - Push (Peitoral, Ombros & Tríceps)',
            targetMuscles: ['peito', 'peito', 'ombros', 'ombros', 'triceps', 'triceps'],
            slots: [
              { name: 'Peito Reto Composto', category: 'peito', preferCompound: true, priorityEligible: true },
              { name: 'Peito Inclinado', category: 'peito', preferCompound: true, priorityEligible: true },
              { name: 'Ombros Desenvolvimento', category: 'ombros', preferCompound: true, priorityEligible: true },
              { name: 'Elevação Lateral', category: 'ombros', preferCompound: false, priorityEligible: true },
              { name: 'Tríceps Pulley/Corda', category: 'triceps', preferCompound: false, priorityEligible: true },
              { name: 'Tríceps Francês / Testa', category: 'triceps', preferCompound: false, priorityEligible: true },
              { name: 'Crucifixo / Crossover', category: 'peito', preferCompound: false, priorityEligible: true },
              { name: 'Elevação Frontal', category: 'ombros', preferCompound: false, priorityEligible: true },
            ],
          },
          {
            dayName: 'Treino B - Pull (Costas, Deltoide Post. & Bíceps)',
            targetMuscles: ['costas', 'costas', 'costas', 'ombros', 'biceps', 'biceps'],
            slots: [
              { name: 'Costas Puxada Vertical', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Costas Remada Curvada/Baixa', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Remada Unilateral / Serrote', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Crucifixo Inverso / Face Pull', category: 'ombros', preferCompound: false, priorityEligible: true },
              { name: 'Bíceps Rosca Direta', category: 'biceps', preferCompound: false, priorityEligible: true },
              { name: 'Bíceps Martelo', category: 'biceps', preferCompound: false, priorityEligible: true },
              { name: 'Pullover', category: 'costas', preferCompound: false, priorityEligible: true },
              { name: 'Bíceps Scott / Concentrada', category: 'biceps', preferCompound: false, priorityEligible: true },
            ],
          },
          {
            dayName: 'Treino C - Legs (Membros Inferiores Completo)',
            targetMuscles: ['pernas', 'pernas', 'pernas', 'pernas', 'pernas', 'core'],
            slots: [
              { name: 'Agachamento Principal', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Leg Press ou Búlgaro', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Cadeira Extensora', category: 'pernas', preferCompound: false, priorityEligible: true },
              { name: 'Stiff / RDL Posterior', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Mesa/Cadeira Flexora', category: 'pernas', preferCompound: false, priorityEligible: true },
              { name: 'Panturrilha', category: 'pernas', preferCompound: false, priorityEligible: false },
              { name: 'Elevação Pélvica / Hip Thrust', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Core Abdominal', category: 'core', preferCompound: false, priorityEligible: false },
            ],
          },
          {
            dayName: 'Treino D - Upper (Tronco & Braços)',
            targetMuscles: ['peito', 'costas', 'ombros', 'biceps', 'triceps'],
            slots: [
              { name: 'Peito Halteres ou Máquina', category: 'peito', preferCompound: true, priorityEligible: true },
              { name: 'Costas Remada Apoio Peito', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Ombros Desenvolvimento Militar', category: 'ombros', preferCompound: true, priorityEligible: true },
              { name: 'Elevação Lateral', category: 'ombros', preferCompound: false, priorityEligible: true },
              { name: 'Bíceps Rosca Inclinada', category: 'biceps', preferCompound: false, priorityEligible: true },
              { name: 'Tríceps Testa / Corda', category: 'triceps', preferCompound: false, priorityEligible: true },
              { name: 'Crucifixo Inverso', category: 'ombros', preferCompound: false, priorityEligible: true },
              { name: 'Peito Crossover', category: 'peito', preferCompound: false, priorityEligible: true },
            ],
          },
          {
            dayName: 'Treino E - Lower & Core (Foco Postural & Posterior)',
            targetMuscles: ['pernas', 'pernas', 'pernas', 'pernas', 'core'],
            slots: [
              { name: 'Terra Romeno / Stiff', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Passada / Afundo', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Flexora Unilateral ou Nordic', category: 'pernas', preferCompound: false, priorityEligible: true },
              { name: 'Hip Thrust ou Glúteo Cabo', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Panturrilha em Pé', category: 'pernas', preferCompound: false, priorityEligible: false },
              { name: 'Core Prancha', category: 'core', preferCompound: false, priorityEligible: false },
              { name: 'Cadeira Extensora', category: 'pernas', preferCompound: false, priorityEligible: false },
              { name: 'Abdominal Infra', category: 'core', preferCompound: false, priorityEligible: false },
            ],
          },
        ],
      };

    case 6:
    default:
      return {
        splitName: 'Push / Pull / Legs (2x por semana)',
        days: [
          {
            dayName: 'Treino A - Push 1 (Foco Peitoral)',
            targetMuscles: ['peito', 'peito', 'ombros', 'ombros', 'triceps', 'triceps'],
            slots: [
              { name: 'Supino Reto Barra/Halteres', category: 'peito', preferCompound: true, priorityEligible: true },
              { name: 'Supino Inclinado Halteres', category: 'peito', preferCompound: true, priorityEligible: true },
              { name: 'Crucifixo / Peck Deck', category: 'peito', preferCompound: false, priorityEligible: true },
              { name: 'Elevação Lateral', category: 'ombros', preferCompound: false, priorityEligible: true },
              { name: 'Tríceps Pulley Barra', category: 'triceps', preferCompound: false, priorityEligible: true },
              { name: 'Tríceps Francês', category: 'triceps', preferCompound: false, priorityEligible: true },
              { name: 'Desenvolvimento Máquina', category: 'ombros', preferCompound: true, priorityEligible: true },
              { name: 'Crossover Cabo', category: 'peito', preferCompound: false, priorityEligible: true },
            ],
          },
          {
            dayName: 'Treino B - Pull 1 (Foco Largura de Costas)',
            targetMuscles: ['costas', 'costas', 'costas', 'ombros', 'biceps', 'biceps'],
            slots: [
              { name: 'Puxada Frontal Aberta / Barra Fixa', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Remada Curvada Barra', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Puxada Triângulo ou Fechada', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Face Pull ou Crucifixo Inverso', category: 'ombros', preferCompound: false, priorityEligible: true },
              { name: 'Rosca Direta W ou Halteres', category: 'biceps', preferCompound: false, priorityEligible: true },
              { name: 'Rosca Martelo', category: 'biceps', preferCompound: false, priorityEligible: true },
              { name: 'Pullover Cabo/Halter', category: 'costas', preferCompound: false, priorityEligible: true },
              { name: 'Rosca Inclinada', category: 'biceps', preferCompound: false, priorityEligible: true },
            ],
          },
          {
            dayName: 'Treino C - Legs 1 (Foco Quadríceps)',
            targetMuscles: ['pernas', 'pernas', 'pernas', 'pernas', 'pernas', 'core'],
            slots: [
              { name: 'Agachamento Livre ou Smith', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Leg Press 45', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Cadeira Extensora', category: 'pernas', preferCompound: false, priorityEligible: true },
              { name: 'Stiff / RDL', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Panturrilha em Pé', category: 'pernas', preferCompound: false, priorityEligible: false },
              { name: 'Core Abdominal', category: 'core', preferCompound: false, priorityEligible: false },
              { name: 'Passada com Halteres', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Mesa Flexora', category: 'pernas', preferCompound: false, priorityEligible: false },
            ],
          },
          {
            dayName: 'Treino D - Push 2 (Foco Ombros & Tríceps)',
            targetMuscles: ['ombros', 'peito', 'ombros', 'triceps', 'triceps', 'peito'],
            slots: [
              { name: 'Desenvolvimento com Halteres / Militar', category: 'ombros', preferCompound: true, priorityEligible: true },
              { name: 'Supino Inclinado Máquina ou Halter', category: 'peito', preferCompound: true, priorityEligible: true },
              { name: 'Elevação Lateral Polia ou Halter', category: 'ombros', preferCompound: false, priorityEligible: true },
              { name: 'Elevação Frontal', category: 'ombros', preferCompound: false, priorityEligible: true },
              { name: 'Tríceps Testa', category: 'triceps', preferCompound: false, priorityEligible: true },
              { name: 'Tríceps Corda', category: 'triceps', preferCompound: false, priorityEligible: true },
              { name: 'Crucifixo Reto', category: 'peito', preferCompound: false, priorityEligible: true },
              { name: 'Paralelas ou Flexão', category: 'peito', preferCompound: true, priorityEligible: true },
            ],
          },
          {
            dayName: 'Treino E - Pull 2 (Foco Espessura de Costas)',
            targetMuscles: ['costas', 'costas', 'costas', 'ombros', 'biceps', 'biceps'],
            slots: [
              { name: 'Remada Baixa Polia ou Cavalinho', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Remada Serrote com Halter', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Puxada Neutra ou Articulada', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Crucifixo Inverso Máquina/Halter', category: 'ombros', preferCompound: false, priorityEligible: true },
              { name: 'Rosca Scott', category: 'biceps', preferCompound: false, priorityEligible: true },
              { name: 'Rosca Concentrada ou Martelo', category: 'biceps', preferCompound: false, priorityEligible: true },
              { name: 'Levantamento Terra Romeno', category: 'costas', preferCompound: true, priorityEligible: true },
              { name: 'Rosca Alternada', category: 'biceps', preferCompound: false, priorityEligible: true },
            ],
          },
          {
            dayName: 'Treino F - Legs 2 (Foco Posteriores & Glúteos)',
            targetMuscles: ['pernas', 'pernas', 'pernas', 'pernas', 'pernas', 'core'],
            slots: [
              { name: 'Stiff com Barra ou Halteres', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Hip Thrust ou Elevação Pélvica', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Agachamento Búlgaro', category: 'pernas', preferCompound: true, priorityEligible: true },
              { name: 'Mesa/Cadeira Flexora', category: 'pernas', preferCompound: false, priorityEligible: true },
              { name: 'Panturrilha Sentada ou Smith', category: 'pernas', preferCompound: false, priorityEligible: false },
              { name: 'Abdução de Quadril', category: 'pernas', preferCompound: false, priorityEligible: true },
              { name: 'Core Prancha Lateral', category: 'core', preferCompound: false, priorityEligible: false },
              { name: 'Leg Press Horizontal', category: 'pernas', preferCompound: true, priorityEligible: false },
            ],
          },
        ],
      };
  }
}

/**
 * Retorna faixa de exercícios por sessão de acordo com a duração informada
 */
export function getExerciseCountForDuration(duration: WorkoutDuration): {
  min: number;
  max: number;
  target: number;
} {
  switch (duration) {
    case 'ate_30':
      return { min: 4, max: 5, target: 4 };
    case '30_45':
      return { min: 5, max: 6, target: 5 };
    case '45_60':
      return { min: 6, max: 7, target: 6 };
    case 'mais_60':
      return { min: 6, max: 8, target: 7 };
    default:
      return { min: 5, max: 6, target: 6 };
  }
}

/**
 * Define o número de séries (2 a 5) de forma equilibrada e conservadora
 */
export function getSetScheme(
  isCompound: boolean,
  level: WorkoutLevel,
  objective: WorkoutObjective
): number {
  if (level === 'iniciante') {
    // Iniciante: volume baixo a moderado (2 a 3 séries)
    return isCompound ? 3 : 2;
  }

  if (level === 'intermediario') {
    if (objective === 'forca') {
      return isCompound ? 4 : 3;
    }
    return isCompound ? 3 : 3;
  }

  // Avançado: volume equilibrado (3 a 4 séries, sem abusar de 5)
  if (objective === 'forca' && isCompound) {
    return 4;
  }
  return isCompound ? 4 : 3;
}

/**
 * Define a faixa de repetições baseada no objetivo e no tipo de exercício
 */
export function getRepRange(
  isCompound: boolean,
  objective: WorkoutObjective,
  level: WorkoutLevel
): string {
  switch (objective) {
    case 'forca':
      if (isCompound) {
        return level === 'iniciante' ? '6-8' : '4-6';
      }
      return '8-10';

    case 'hipertrofia':
      if (isCompound) {
        return '8-10';
      }
      return '10-12';

    case 'condicionamento':
      if (isCompound) {
        return '10-12';
      }
      return '12-15';

    case 'equilibrado':
    default:
      if (isCompound) {
        return '8-12';
      }
      return '10-12';
  }
}

/**
 * Define o tempo de descanso em segundos (30s a 180s)
 */
export function getRestTime(
  isCompound: boolean,
  objective: WorkoutObjective
): number {
  switch (objective) {
    case 'forca':
      return isCompound ? 120 : 90;
    case 'hipertrofia':
      return isCompound ? 90 : 60;
    case 'condicionamento':
      return isCompound ? 45 : 30;
    case 'equilibrado':
    default:
      return isCompound ? 75 : 60;
  }
}

/**
 * Seleciona exercícios compatíveis da biblioteca oficial EXERCISES
 */
export function selectExerciseForSlot(params: {
  category: string;
  preferCompound?: boolean;
  location: WorkoutLocation;
  level: WorkoutLevel;
  excludeIds: string[];
  rng: () => number;
}): Exercise | null {
  const { category, preferCompound, location, level, excludeIds, rng } = params;

  // Filtrar da biblioteca oficial EXERCISES
  let candidates = EXERCISES.filter((ex) => {
    if (ex.categoryId !== category) return false;
    if (excludeIds.includes(ex.id)) return false;
    if (!isExerciseCompatibleWithLocation(ex.id, location)) return false;

    // Se iniciante, evitar exercícios de dificuldade 'avancado' quando houver outras opções
    if (level === 'iniciante') {
      const meta = EXERCISE_META[ex.id];
      if (meta?.difficulty === 'avancado') return false;
    }

    return true;
  });

  // Se não encontrou opções com o filtro de dificuldade, relaxar restrição de dificuldade
  if (candidates.length === 0) {
    candidates = EXERCISES.filter((ex) => {
      if (ex.categoryId !== category) return false;
      if (excludeIds.includes(ex.id)) return false;
      return isExerciseCompatibleWithLocation(ex.id, location);
    });
  }

  // Se ainda estiver vazio (ex: local muito restrito e todos já usados), permitir reutilizar
  if (candidates.length === 0) {
    candidates = EXERCISES.filter((ex) => {
      if (ex.categoryId !== category) return false;
      return isExerciseCompatibleWithLocation(ex.id, location);
    });
  }

  if (candidates.length === 0) {
    return null;
  }

  // Se houver preferência por composto vs isolador
  if (preferCompound !== undefined) {
    const matchedPreference = candidates.filter((ex) => {
      const isC = isCompoundExercise(ex.id);
      return preferCompound ? isC : !isC;
    });
    if (matchedPreference.length > 0) {
      candidates = matchedPreference;
    }
  }

  // Sorteio determinístico/controlado entre os candidatos válidos
  const selectedIndex = Math.floor(rng() * candidates.length);
  return candidates[selectedIndex];
}

/**
 * Aplica as prioridades musculares do usuário reorganizando os slots
 */
export function applyMusclePriorities(
  slots: DaySlotTemplate[],
  priorities: string[],
  maxExercises: number
): DaySlotTemplate[] {
  if (!priorities || priorities.length === 0) {
    return slots.slice(0, maxExercises);
  }

  const resultSlots: DaySlotTemplate[] = [];
  const prioritySlots: DaySlotTemplate[] = [];
  const normalSlots: DaySlotTemplate[] = [];

  // Separar slots que correspondem às prioridades
  for (const slot of slots) {
    if (priorities.includes(slot.category)) {
      prioritySlots.push(slot);
    } else {
      normalSlots.push(slot);
    }
  }

  // Adicionar prioridades primeiro até um limite razoável (evitando desbalancear tudo)
  const maxPriorityCount = Math.min(prioritySlots.length, Math.ceil(maxExercises * 0.5));
  resultSlots.push(...prioritySlots.slice(0, maxPriorityCount));

  // Completar com slots normais para manter equilíbrio
  for (const slot of normalSlots) {
    if (resultSlots.length >= maxExercises) break;
    resultSlots.push(slot);
  }

  // Se ainda houver espaço e mais prioridades disponíveis
  if (resultSlots.length < maxExercises && prioritySlots.length > maxPriorityCount) {
    const remaining = prioritySlots.slice(maxPriorityCount);
    for (const slot of remaining) {
      if (resultSlots.length >= maxExercises) break;
      resultSlots.push(slot);
    }
  }

  return resultSlots.slice(0, maxExercises);
}

/**
 * Validação rigorosa do plano gerado
 */
export function validateWorkoutPlan(
  plan: WorkoutPlan,
  answers: WorkoutAnswers
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!plan || !plan.days || plan.days.length !== answers.frequencia) {
    errors.push(`Número de dias (${plan?.days?.length}) diferente da frequência solicitada (${answers.frequencia}).`);
  }

  const durationBounds = getExerciseCountForDuration(answers.duracao);

  plan.days.forEach((day, dayIndex) => {
    if (!day.exercises || day.exercises.length === 0) {
      errors.push(`Dia ${dayIndex + 1} (${day.dayName}) não possui exercícios.`);
      return;
    }

    if (day.exercises.length < durationBounds.min - 1 || day.exercises.length > durationBounds.max + 1) {
      errors.push(`Dia ${dayIndex + 1} possui ${day.exercises.length} exercícios, fora da faixa de duração.`);
    }

    const seenIds = new Set<string>();
    day.exercises.forEach((item) => {
      // 1. O ID precisa existir na biblioteca oficial
      const exists = EXERCISES.some((e) => e.id === item.exerciseId);
      if (!exists) {
        errors.push(`Exercício ID ${item.exerciseId} não existe na biblioteca EXERCISES.`);
      }

      // 2. Não deve haver duplicação de exercício no mesmo dia
      if (seenIds.has(item.exerciseId)) {
        errors.push(`Exercício duplicado ${item.exerciseName} no mesmo dia (${day.dayName}).`);
      }
      seenIds.add(item.exerciseId);

      // 3. Séries entre 2 e 5
      if (item.sets < 2 || item.sets > 5) {
        errors.push(`Séries do exercício ${item.exerciseName} fora do intervalo permitido 2-5: ${item.sets}`);
      }

      // 4. Descanso entre 30 e 180 segundos
      if (item.restSeconds < 30 || item.restSeconds > 180) {
        errors.push(`Descanso do exercício ${item.exerciseName} fora do intervalo 30-180s: ${item.restSeconds}s`);
      }

      // 5. Compatibilidade de local
      if (!isExerciseCompatibleWithLocation(item.exerciseId, answers.local)) {
        errors.push(`Exercício ${item.exerciseName} não é compatível com o local: ${answers.local}`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Função geradora principal determinística do Workout Engine
 */
export function generateWorkout(
  answers: WorkoutAnswers,
  options?: { seed?: number }
): WorkoutPlan {
  // Criar gerador pseudo-aleatório com seed ou fallback
  let seedValue = options?.seed ?? (Date.now() % 2147483647);
  const nextRng = () => {
    seedValue = (seedValue * 16807) % 2147483647;
    return (seedValue - 1) / 2147483646;
  };

  const attemptGeneration = (): WorkoutPlan => {
    const splitConfig = chooseSplit(answers.frequencia);
    const durationInfo = getExerciseCountForDuration(answers.duracao);

    const workoutDays: WorkoutDay[] = splitConfig.days.map((dayTemplate, dayIdx) => {
      // Aplicar prioridades e calcular quantidade de exercícios para este dia
      const targetCount = durationInfo.target;
      const filteredSlots = applyMusclePriorities(
        dayTemplate.slots,
        answers.prioridades,
        targetCount
      );

      const dayExercises: WorkoutExerciseItem[] = [];
      const usedExerciseIdsInDay: string[] = [];

      filteredSlots.forEach((slot, slotIdx) => {
        const exercise = selectExerciseForSlot({
          category: slot.category,
          preferCompound: slot.preferCompound,
          location: answers.local,
          level: answers.nivel,
          excludeIds: usedExerciseIdsInDay,
          rng: nextRng,
        });

        if (exercise) {
          usedExerciseIdsInDay.push(exercise.id);

          const isCompound = isCompoundExercise(exercise.id);
          const sets = getSetScheme(isCompound, answers.nivel, answers.objetivo);
          const reps = getRepRange(isCompound, answers.objetivo, answers.nivel);
          const restSeconds = getRestTime(isCompound, answers.objetivo);
          const noteIndex = Math.floor(nextRng() * COACHING_NOTES.length);
          const notes = COACHING_NOTES[noteIndex];

          dayExercises.push({
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            categoryName: exercise.categoryName,
            categoryId: exercise.categoryId,
            sets,
            reps,
            restSeconds,
            notes,
          });
        }
      });

      return {
        dayId: `day-${dayIdx + 1}`,
        dayName: dayTemplate.dayName,
        targetMuscles: dayTemplate.targetMuscles,
        exercises: dayExercises,
      };
    });

    const objectiveLabels: Record<WorkoutObjective, string> = {
      hipertrofia: 'Hipertrofia',
      forca: 'Força',
      condicionamento: 'Condicionamento Geral',
      equilibrado: 'Treino Equilibrado',
    };

    const levelLabels: Record<WorkoutLevel, string> = {
      iniciante: 'Iniciante',
      intermediario: 'Intermediário',
      avancado: 'Avançado',
    };

    const planId = `plan_${Date.now()}_${Math.floor(nextRng() * 1000)}`;
    const title = `Treino ${objectiveLabels[answers.objetivo]} (${answers.frequencia}x/sem) - ${levelLabels[answers.nivel]}`;

    return {
      id: planId,
      title,
      splitName: splitConfig.splitName,
      createdAt: new Date().toISOString(),
      answers,
      days: workoutDays,
      notes: 'Plano gerado com sucesso pelo Workout Engine determinístico da Base Visual da Musculação.',
    };
  };

  // Primeira tentativa de geração
  let plan = attemptGeneration();
  let validation = validateWorkoutPlan(plan, answers);

  // Se falhar na validação, regenerar internamente uma vez com nova semente
  if (!validation.valid) {
    seedValue = (seedValue + 777) % 2147483647;
    plan = attemptGeneration();
    validation = validateWorkoutPlan(plan, answers);
  }

  if (!validation.valid) {
    throw new Error('Não foi possível montar seu treino. Tente novamente.');
  }

  return plan;
}

/**
 * Retorna alternativas válidas para substituição de exercício (Trocar Exercício)
 */
export function getExerciseSwapOptions(params: {
  currentExerciseId: string;
  dayExerciseIds: string[];
  location: WorkoutLocation;
  level: WorkoutLevel;
}): Exercise[] {
  const { currentExerciseId, dayExerciseIds, location, level } = params;
  const current = EXERCISES.find((e) => e.id === currentExerciseId);
  if (!current) return [];

  const category = current.categoryId;
  const currentIsCompound = isCompoundExercise(currentExerciseId);

  // Buscar todos os exercícios da mesma categoria compatíveis com o local
  const candidates = EXERCISES.filter((ex) => {
    if (ex.id === currentExerciseId) return false;
    if (dayExerciseIds.includes(ex.id)) return false;
    if (ex.categoryId !== category) return false;
    if (!isExerciseCompatibleWithLocation(ex.id, location)) return false;

    if (level === 'iniciante') {
      const meta = EXERCISE_META[ex.id];
      if (meta?.difficulty === 'avancado') return false;
    }

    return true;
  });

  // Ordenar para dar preferência a exercícios com a mesma característica biomecânica (composto/isolador)
  candidates.sort((a, b) => {
    const aMatch = isCompoundExercise(a.id) === currentIsCompound ? 1 : 0;
    const bMatch = isCompoundExercise(b.id) === currentIsCompound ? 1 : 0;
    return bMatch - aMatch;
  });

  return candidates;
}
