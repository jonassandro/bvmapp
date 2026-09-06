import coverBaseVisual from '../assets/images/base_visual_cover_1788669836318.jpg';
import coverExerciciosRegiao from '../assets/images/guia_exercicios_regiao_1788645822847.jpg';
import coverProgressaoCarga from '../assets/images/progressao_carga_cover_1788669934990.jpg';
import coverPlanilhaCarga from '../assets/images/planilha_carga_cover_1788669970911.jpg';
import coverSubstituicaoEx from '../assets/images/substituicao_ex_cover_1788669953323.jpg';
import coverPackTreinos from '../assets/images/pack_treinos_cover_1788669851124.jpg';
import coverRotinaTreinos from '../assets/images/rotina_treinos_cover_1788669868456.jpg';
import coverProgramaOito from '../assets/images/programa_oito_cover_1788669884901.jpg';
import coverNutricaoPre from '../assets/images/nutricao_pre_cover_1788669901805.jpg';
import coverTreinosTrinta from '../assets/images/treinos_trinta_cover_1788669917318.jpg';

export interface ContentMeta {
  coverUrl: string;
  badge: string;
  description: string;
  checkoutUrl?: string;
  valueHighlights?: string[];
}

export const CHECKOUT_URLS: Record<string, string> = {
  PACK48: 'https://levantese.pay.yampi.com.br/r/Q0CJOQSKN1',
  TREINOSDIA: 'https://levantese.pay.yampi.com.br/r/IOOPMYC4QN',
  PROGRAMA8: 'https://levantese.pay.yampi.com.br/r/37U9KNMFR5',
  NUTRICAO: 'https://levantese.pay.yampi.com.br/r/A3EPZDBYMH',
  TREINOS30: 'https://levantese.pay.yampi.com.br/r/MT5IKPEQ1V',
};

export const CONTENT_METAS: Record<string, ContentMeta> = {
  // MAT001 - Base Visual da Musculação
  MAT001: {
    coverUrl: coverBaseVisual,
    badge: 'Guia Principal',
    description: 'Guia definitivo com 149 exercícios ilustrados, correções posturais e biomecânica detalhada.',
    valueHighlights: ['+149 Exercícios ilustrados', 'Biomecânica e execução', 'Acesso aos vídeos práticos'],
  },
  // MAT002 - Sumário da Base Visual
  MAT002: {
    coverUrl: coverBaseVisual,
    badge: 'Índice de Consulta',
    description: 'Sumário estruturado por grupamentos musculares para localização rápida de exercícios.',
    valueHighlights: ['Navegação rápida', 'Mapeamento por grupos', 'Paginação direta'],
  },
  // MAT003 - Melhores Exercícios por Região Muscular
  MAT003: {
    coverUrl: coverExerciciosRegiao,
    badge: 'Bônus Base Visual',
    description: 'Seleção visual técnica dos exercícios com maior ativação eletromiográfica por feixe muscular.',
    valueHighlights: ['Ativação muscular máxima', 'Foco por região', 'Guia ilustrado de referência'],
  },
  // MAT004 - Guia de Progressão de Carga
  MAT004: {
    coverUrl: coverProgressaoCarga,
    badge: 'Guia Técnico',
    description: 'Metodologia prática de sobrecarga progressiva, controle de esforço com RPE e cálculo de RIR.',
    valueHighlights: ['Aplicação prática de RIR/RPE', 'Sobrecarga progressiva', 'Evite platôs de evolução'],
  },
  // MAT005 - Planilha de Progressão de Carga
  MAT005: {
    coverUrl: coverPlanilhaCarga,
    badge: 'Ferramenta de Treino',
    description: 'Planilha digital inteligente para acompanhamento de cargas, repetições e volume semanal.',
    valueHighlights: ['Registro interativo', 'Cálculo de volume semanal', 'Acompanhamento de metas'],
  },
  // MAT006 - Guia de Substituições de Exercícios
  MAT006: {
    coverUrl: coverSubstituicaoEx,
    badge: 'Guia de Apoio',
    description: 'Alternativas inteligentes e seguras para aparelhos ocupados ou indisponíveis na sua academia.',
    valueHighlights: ['Alternativas por máquina', 'Sem perda de estímulo', 'Praticidade na rotina'],
  },
  // MAT007 - Treinos de 30 Minutos (TREINOS30)
  MAT007: {
    coverUrl: coverTreinosTrinta,
    badge: 'Conteúdo Adicional',
    description: 'Planilhas condensadas de alta densidade muscular para quem tem pouco tempo e busca evolução.',
    checkoutUrl: CHECKOUT_URLS.TREINOS30,
    valueHighlights: ['Treinos rápidos e intensos', 'Otimização de tempo', 'Alta densidade de estímulo'],
  },
  // MAT008 - Guia de Nutrição Pré/Pós-Treino (NUTRICAO)
  MAT008: {
    coverUrl: coverNutricaoPre,
    badge: 'Conteúdo Adicional',
    description: 'Diretrizes objetivas de timing nutricional para potencializar hipertrofia, força e recuperação.',
    checkoutUrl: CHECKOUT_URLS.NUTRICAO,
    valueHighlights: ['Timing estratégico', 'Cardápios e combinações', 'Recuperação muscular acelerada'],
  },
  // MAT009 - Programa de 8 Semanas (PROGRAMA8)
  MAT009: {
    coverUrl: coverProgramaOito,
    badge: 'Conteúdo Adicional',
    description: 'Periodização completa estruturada semana a semana com manipulação de volume e intensidade.',
    checkoutUrl: CHECKOUT_URLS.PROGRAMA8,
    valueHighlights: ['Periodização de 8 semanas', 'Evolução progressiva', 'Fases de choque e deload'],
  },
  // MAT010 - Treinos Prontos para Sua Rotina (TREINOSDIA)
  MAT010: {
    coverUrl: coverRotinaTreinos,
    badge: 'Conteúdo Adicional',
    description: 'Divisões customizadas conforme a sua disponibilidade: fichas adaptadas de 3 a 6 dias por semana.',
    checkoutUrl: CHECKOUT_URLS.TREINOSDIA,
    valueHighlights: ['Divisões de 3 a 6 dias', 'Adaptação à sua rotina', 'Equilíbrio de descanso'],
  },
  // MAT011 - 48 Treinos Prontos (PACK48)
  MAT011: {
    coverUrl: coverPackTreinos,
    badge: 'Conteúdo Adicional',
    description: 'Acervo massivo com 48 fichas completas para variar estímulos com rigor técnico e foco hipertrófico.',
    checkoutUrl: CHECKOUT_URLS.PACK48,
    valueHighlights: ['48 Fichas prontas', 'Variedade de estímulos', 'Todos os grupamentos'],
  },
};

/**
 * Obtém a imagem de capa e metadados visuais de um material
 */
export function getMaterialMeta(materialIdOrCode: string, moduleId?: string): ContentMeta {
  const meta = CONTENT_METAS[materialIdOrCode];
  if (meta) return meta;

  // Fallback por moduleId
  if (moduleId) {
    if (moduleId === 'PACK48') return CONTENT_METAS.MAT011;
    if (moduleId === 'TREINOSDIA') return CONTENT_METAS.MAT010;
    if (moduleId === 'PROGRAMA8') return CONTENT_METAS.MAT009;
    if (moduleId === 'NUTRICAO') return CONTENT_METAS.MAT008;
    if (moduleId === 'TREINOS30') return CONTENT_METAS.MAT007;
  }

  return {
    coverUrl: coverBaseVisual,
    badge: 'Material Digital',
    description: 'Material exclusivo da Base Visual da Musculação.',
    checkoutUrl: moduleId ? CHECKOUT_URLS[moduleId] : undefined,
  };
}

export function getCheckoutUrl(moduleId: string): string | undefined {
  return CHECKOUT_URLS[moduleId];
}
