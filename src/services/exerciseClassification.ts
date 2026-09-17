export interface ExerciseClassification {
  isCompound: boolean;
  equipment: 'barra' | 'halteres' | 'maquina' | 'polia' | 'peso_corporal' | 'smith' | 'acessorio';
  homeCompatible: boolean;
  simpleGymCompatible: boolean;
  subTarget: string; // e.g., 'peito_superior', 'peito_medio', 'costas_puxada', 'costas_remada', 'ombros_deltoide_lateral', etc.
  difficulty: 'iniciante' | 'intermediario' | 'avancado';
}

/**
 * Camada de classificação centralizada para todos os 149 exercícios da Base Visual.
 * Mapeia biomecânica, equipamento, compatibilidade de local e nível.
 */
export const EXERCISE_META: Record<string, ExerciseClassification> = {
  // PEITO (EX001 - EX021)
  EX001: { isCompound: true, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'peito_reto', difficulty: 'intermediario' },
  EX002: { isCompound: true, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'peito_reto', difficulty: 'iniciante' },
  EX003: { isCompound: true, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'peito_inclinado', difficulty: 'intermediario' },
  EX004: { isCompound: true, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'peito_inclinado', difficulty: 'iniciante' },
  EX005: { isCompound: true, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'peito_declinado', difficulty: 'intermediario' },
  EX006: { isCompound: true, equipment: 'halteres', homeCompatible: false, simpleGymCompatible: true, subTarget: 'peito_declinado', difficulty: 'intermediario' },
  EX007: { isCompound: true, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'peito_reto', difficulty: 'iniciante' },
  EX008: { isCompound: true, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'peito_inclinado', difficulty: 'iniciante' },
  EX009: { isCompound: true, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'peito_reto', difficulty: 'iniciante' },
  EX010: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'peito_isolador', difficulty: 'iniciante' },
  EX011: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'peito_isolador', difficulty: 'iniciante' },
  EX012: { isCompound: false, equipment: 'halteres', homeCompatible: false, simpleGymCompatible: true, subTarget: 'peito_isolador', difficulty: 'intermediario' },
  EX013: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'peito_isolador', difficulty: 'iniciante' },
  EX014: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'peito_cabo', difficulty: 'intermediario' },
  EX015: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'peito_cabo', difficulty: 'intermediario' },
  EX016: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'peito_cabo', difficulty: 'intermediario' },
  EX017: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'peito_cabo', difficulty: 'intermediario' },
  EX018: { isCompound: true, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'peito_calistenia', difficulty: 'iniciante' },
  EX019: { isCompound: true, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'peito_calistenia', difficulty: 'intermediario' },
  EX020: { isCompound: true, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'peito_paralelas', difficulty: 'intermediario' },
  EX021: { isCompound: true, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'peito_fechado', difficulty: 'intermediario' },

  // COSTAS (EX022 - EX046)
  EX022: { isCompound: true, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'costas_puxada', difficulty: 'iniciante' },
  EX023: { isCompound: true, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'costas_puxada', difficulty: 'iniciante' },
  EX024: { isCompound: true, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'costas_puxada', difficulty: 'iniciante' },
  EX025: { isCompound: true, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'costas_puxada', difficulty: 'iniciante' },
  EX026: { isCompound: true, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'costas_puxada', difficulty: 'intermediario' },
  EX027: { isCompound: true, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'costas_barra_fixa', difficulty: 'intermediario' },
  EX028: { isCompound: true, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'costas_barra_fixa', difficulty: 'intermediario' },
  EX029: { isCompound: true, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'costas_barra_fixa', difficulty: 'intermediario' },
  EX030: { isCompound: true, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'costas_remada', difficulty: 'intermediario' },
  EX031: { isCompound: true, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'costas_remada', difficulty: 'intermediario' },
  EX032: { isCompound: true, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'costas_remada', difficulty: 'intermediario' },
  EX033: { isCompound: true, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'costas_remada', difficulty: 'iniciante' },
  EX034: { isCompound: true, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'costas_remada', difficulty: 'iniciante' },
  EX035: { isCompound: true, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'costas_remada', difficulty: 'iniciante' },
  EX036: { isCompound: true, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'costas_remada', difficulty: 'iniciante' },
  EX037: { isCompound: true, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'costas_remada', difficulty: 'iniciante' },
  EX038: { isCompound: true, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'costas_remada', difficulty: 'intermediario' },
  EX039: { isCompound: true, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'costas_remada', difficulty: 'iniciante' },
  EX040: { isCompound: true, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'costas_remada', difficulty: 'iniciante' },
  EX041: { isCompound: true, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'costas_remada', difficulty: 'iniciante' },
  EX042: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'costas_pullover', difficulty: 'intermediario' },
  EX043: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'costas_pullover', difficulty: 'iniciante' },
  EX044: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'costas_pullover', difficulty: 'iniciante' },
  EX045: { isCompound: true, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'costas_lombar', difficulty: 'avancado' },
  EX046: { isCompound: true, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'costas_lombar', difficulty: 'avancado' },

  // OMBROS (EX047 - EX064)
  EX047: { isCompound: true, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'ombros_desenvolvimento', difficulty: 'intermediario' },
  EX048: { isCompound: true, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'ombros_desenvolvimento', difficulty: 'iniciante' },
  EX049: { isCompound: true, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'ombros_desenvolvimento', difficulty: 'intermediario' },
  EX050: { isCompound: true, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'ombros_desenvolvimento', difficulty: 'intermediario' },
  EX051: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'ombros_lateral', difficulty: 'iniciante' },
  EX052: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'ombros_lateral', difficulty: 'iniciante' },
  EX053: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'ombros_lateral', difficulty: 'intermediario' },
  EX054: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'ombros_lateral', difficulty: 'iniciante' },
  EX055: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'ombros_lateral', difficulty: 'intermediario' },
  EX056: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'ombros_anterior', difficulty: 'iniciante' },
  EX057: { isCompound: false, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'ombros_anterior', difficulty: 'iniciante' },
  EX058: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'ombros_anterior', difficulty: 'iniciante' },
  EX059: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'ombros_posterior', difficulty: 'iniciante' },
  EX060: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'ombros_posterior', difficulty: 'iniciante' },
  EX061: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'ombros_posterior', difficulty: 'intermediario' },
  EX062: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'ombros_posterior', difficulty: 'iniciante' },
  EX063: { isCompound: true, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'ombros_desenvolvimento', difficulty: 'intermediario' },
  EX064: { isCompound: true, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'ombros_desenvolvimento', difficulty: 'iniciante' },

  // BÍCEPS (EX065 - EX079)
  EX065: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'biceps_braquial', difficulty: 'iniciante' },
  EX066: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'biceps_pico', difficulty: 'iniciante' },
  EX067: { isCompound: false, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'biceps_scott', difficulty: 'intermediario' },
  EX068: { isCompound: false, equipment: 'halteres', homeCompatible: false, simpleGymCompatible: true, subTarget: 'biceps_scott', difficulty: 'iniciante' },
  EX069: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'biceps_scott', difficulty: 'iniciante' },
  EX070: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'biceps_alongado', difficulty: 'intermediario' },
  EX071: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'biceps_alongado', difficulty: 'intermediario' },
  EX072: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'biceps_direta', difficulty: 'iniciante' },
  EX073: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'biceps_direta', difficulty: 'iniciante' },
  EX074: { isCompound: false, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'biceps_antebraço', difficulty: 'iniciante' },
  EX075: { isCompound: false, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'biceps_direta', difficulty: 'iniciante' },
  EX076: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'biceps_direta', difficulty: 'iniciante' },
  EX077: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'biceps_direta', difficulty: 'iniciante' },
  EX078: { isCompound: false, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'biceps_direta', difficulty: 'iniciante' },
  EX079: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'biceps_braquial', difficulty: 'iniciante' },

  // TRÍCEPS (EX080 - EX091)
  EX080: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'triceps_pulley', difficulty: 'iniciante' },
  EX081: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'triceps_pulley', difficulty: 'iniciante' },
  EX082: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'triceps_pulley', difficulty: 'iniciante' },
  EX083: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'triceps_cabeca_longa', difficulty: 'iniciante' },
  EX084: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'triceps_cabeca_longa', difficulty: 'iniciante' },
  EX085: { isCompound: false, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'triceps_testa', difficulty: 'intermediario' },
  EX086: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'triceps_testa', difficulty: 'iniciante' },
  EX087: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'triceps_testa', difficulty: 'intermediario' },
  EX088: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'triceps_coice', difficulty: 'iniciante' },
  EX089: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'triceps_coice', difficulty: 'iniciante' },
  EX090: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'triceps_pulley', difficulty: 'iniciante' },
  EX091: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'triceps_cabeca_longa', difficulty: 'intermediario' },

  // PERNAS (EX092 - EX137)
  EX092: { isCompound: true, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'pernas_quadriceps', difficulty: 'intermediario' },
  EX093: { isCompound: true, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_posterior', difficulty: 'intermediario' },
  EX094: { isCompound: true, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'pernas_quadriceps', difficulty: 'intermediario' },
  EX095: { isCompound: false, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'pernas_quadriceps', difficulty: 'avancado' },
  EX096: { isCompound: true, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_quadriceps', difficulty: 'iniciante' },
  EX097: { isCompound: true, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'pernas_quadriceps', difficulty: 'iniciante' },
  EX098: { isCompound: true, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'pernas_quadriceps', difficulty: 'intermediario' },
  EX099: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_extensora', difficulty: 'iniciante' },
  EX100: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_extensora', difficulty: 'iniciante' },
  EX101: { isCompound: true, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'pernas_quadriceps', difficulty: 'iniciante' },
  EX102: { isCompound: true, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_quadriceps', difficulty: 'intermediario' },
  EX103: { isCompound: true, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'pernas_quadriceps', difficulty: 'iniciante' },
  EX104: { isCompound: true, equipment: 'smith', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_quadriceps', difficulty: 'iniciante' },
  EX105: { isCompound: true, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'pernas_quadriceps', difficulty: 'iniciante' },
  EX106: { isCompound: true, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_posterior', difficulty: 'intermediario' },
  EX107: { isCompound: true, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_posterior', difficulty: 'intermediario' },
  EX108: { isCompound: true, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'pernas_posterior', difficulty: 'iniciante' },
  EX109: { isCompound: true, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'pernas_posterior', difficulty: 'intermediario' },
  EX110: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_flexora', difficulty: 'iniciante' },
  EX111: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'pernas_flexora', difficulty: 'iniciante' },
  EX112: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_flexora', difficulty: 'iniciante' },
  EX113: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'pernas_flexora', difficulty: 'iniciante' },
  EX114: { isCompound: true, equipment: 'peso_corporal', homeCompatible: false, simpleGymCompatible: false, subTarget: 'pernas_posterior', difficulty: 'avancado' },
  EX115: { isCompound: true, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'pernas_posterior', difficulty: 'avancado' },
  EX116: { isCompound: true, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_gluteo', difficulty: 'intermediario' },
  EX117: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_gluteo', difficulty: 'iniciante' },
  EX118: { isCompound: true, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'pernas_gluteo', difficulty: 'iniciante' },
  EX119: { isCompound: true, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'pernas_gluteo', difficulty: 'iniciante' },
  EX120: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'pernas_adutora', difficulty: 'iniciante' },
  EX121: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'pernas_abdutora', difficulty: 'iniciante' },
  EX122: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'pernas_gluteo', difficulty: 'iniciante' },
  EX123: { isCompound: false, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_panturrilha', difficulty: 'intermediario' },
  EX124: { isCompound: false, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'pernas_panturrilha', difficulty: 'iniciante' },
  EX125: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_panturrilha', difficulty: 'iniciante' },
  EX126: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'pernas_panturrilha', difficulty: 'iniciante' },
  EX127: { isCompound: false, equipment: 'smith', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_panturrilha', difficulty: 'iniciante' },
  EX128: { isCompound: false, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'pernas_panturrilha', difficulty: 'iniciante' },
  EX129: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_panturrilha', difficulty: 'iniciante' },
  EX130: { isCompound: false, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'pernas_panturrilha', difficulty: 'intermediario' },
  EX131: { isCompound: false, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'core_reto', difficulty: 'intermediario' },
  EX132: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'core_obliquo', difficulty: 'iniciante' },
  EX133: { isCompound: true, equipment: 'smith', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_quadriceps', difficulty: 'iniciante' },
  EX134: { isCompound: true, equipment: 'barra', homeCompatible: true, simpleGymCompatible: true, subTarget: 'pernas_quadriceps', difficulty: 'intermediario' },
  EX135: { isCompound: true, equipment: 'barra', homeCompatible: false, simpleGymCompatible: true, subTarget: 'pernas_quadriceps', difficulty: 'avancado' },
  EX136: { isCompound: true, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'pernas_gluteo', difficulty: 'iniciante' },
  EX137: { isCompound: true, equipment: 'halteres', homeCompatible: true, simpleGymCompatible: true, subTarget: 'pernas_quadriceps', difficulty: 'iniciante' },

  // CORE (EX138 - EX149)
  EX138: { isCompound: false, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'core_reto', difficulty: 'iniciante' },
  EX139: { isCompound: false, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'core_estabilidade', difficulty: 'iniciante' },
  EX140: { isCompound: false, equipment: 'maquina', homeCompatible: false, simpleGymCompatible: false, subTarget: 'core_reto', difficulty: 'iniciante' },
  EX141: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'core_reto', difficulty: 'iniciante' },
  EX142: { isCompound: false, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'core_infra', difficulty: 'iniciante' },
  EX143: { isCompound: false, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'core_infra', difficulty: 'intermediario' },
  EX144: { isCompound: false, equipment: 'polia', homeCompatible: false, simpleGymCompatible: true, subTarget: 'core_obliquo', difficulty: 'iniciante' },
  EX145: { isCompound: false, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'core_estabilidade', difficulty: 'iniciante' },
  EX146: { isCompound: false, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'core_obliquo', difficulty: 'iniciante' },
  EX147: { isCompound: false, equipment: 'acessorio', homeCompatible: true, simpleGymCompatible: true, subTarget: 'core_estabilidade', difficulty: 'avancado' },
  EX148: { isCompound: false, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'core_estabilidade', difficulty: 'iniciante' },
  EX149: { isCompound: false, equipment: 'peso_corporal', homeCompatible: true, simpleGymCompatible: true, subTarget: 'core_reto', difficulty: 'intermediario' },
};

/**
 * Retorna se o exercício é composto (multijoint)
 */
export function isCompoundExercise(exerciseId: string): boolean {
  return EXERCISE_META[exerciseId]?.isCompound ?? false;
}

/**
 * Retorna se o exercício é compatível com o local selecionado
 */
export function isExerciseCompatibleWithLocation(
  exerciseId: string,
  location: 'academia_completa' | 'academia_simples' | 'casa'
): boolean {
  const meta = EXERCISE_META[exerciseId];
  if (!meta) return true;

  if (location === 'casa') {
    return meta.homeCompatible;
  }
  if (location === 'academia_simples') {
    return meta.simpleGymCompatible;
  }
  return true; // academia completa permite toda a biblioteca
}
