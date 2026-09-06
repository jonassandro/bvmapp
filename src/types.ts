export interface Exercise {
  id: string; // e.g. 'EX001'
  name: string; // e.g. 'Supino reto com barra'
  categoryId: 'peito' | 'costas' | 'ombros' | 'biceps' | 'triceps' | 'pernas' | 'core';
  categoryName: string; // e.g. 'PEITO'
  pageNumber: number | string; // e.g. 1, "141, 143", "48-49"
  pdfBase?: string; // e.g. 'https://drive.google.com/file/d/1m7GaV-M3p4zC15NtmMZL22x1PujaNsqQ/view?usp=drivesdk'
  moduleId: string; // e.g. 'BASE'
  moduloId?: string; // e.g. 'BASE'
  hasVideo: boolean;
  active?: boolean;
  videoId?: string; // e.g. 'VID002'
  videoFileName?: string; // e.g. 'SUPINO RETO COM BARRA.mp4'
  videoUrl?: string;
  order?: number;
  notes?: string;
}

export interface Video {
  id: string; // e.g. 'VID001'
  exerciseId: string; // e.g. 'EX073'
  exerciseName: string; // e.g. 'Rosca unilateral na polia'
  group: string; // e.g. 'BÍCEPS'
  videoUrl: string; // Google Drive url
  fileName: string; // e.g. 'ROSCA UNILATERAL NA POLIA.mp4'
  moduleId: string; // 'BASE'
  active: boolean;
}

export interface Material {
  // Colunas obrigatórias da aba Materiais
  ID: string;
  Titulo: string;
  Categoria: string;
  Tipo: string;
  URL: string;
  Ativo: boolean | string; // 'SIM' | 'NÃO' ou boolean
  ModuloID: string; // e.g. 'BASE', 'TREINOS30', 'PACK48', etc.
  Permissao_Necessaria: string;
  Visivel_Catalogo: boolean | string; // 'SIM' | 'NÃO' ou boolean

  // Propriedades compatíveis com o restante do front-end
  id: string;
  materialId?: string;
  driveFileId?: string;
  spreadsheetId?: string;
  localAsset?: string;
  title: string;
  subtitle?: string;
  tag?: string;
  category?: string;
  type: string;
  role?: string;
  moduleId: string;
  moduloId?: string;
  permissionCode?: string;
  mainFolder?: string;
  subFolder?: string;
  functionName?: string;
  isLockedDefault?: boolean;
  directLink: string;
  url?: string;
  previewUrl?: string;
  active?: boolean;
  visibleInCatalog?: boolean;
  arquivo?: string;
  descricaoCurta?: string;
}

export interface Category {
  id: 'todos' | 'peito' | 'costas' | 'ombros' | 'biceps' | 'triceps' | 'pernas' | 'core';
  name: string;
  groupCode?: string;
  order?: number;
  exerciseCount?: number;
}

export interface CatalogItem {
  id: string; // e.g. 'CAT001'
  title: string; // e.g. 'Treinos de 30 minutos'
  category: string; // e.g. 'Treinos'
  type: string; // e.g. 'PDF'
  moduleId: string; // e.g. 'TREINOS30'
  permissionName: string; // e.g. 'TREINOS30'
  status: 'Bloqueado' | 'Liberado';
  isLockedDefault: boolean;
}

export interface UserProfile {
  id: string;
  uid?: string;
  name: string;
  email: string;
  initials: string;
  photoURL?: string;
  badge: string; // 'Acesso Base' | 'Acesso Total' | 'Acesso Modular'
  fullAccess: boolean; // whether all modules are active
  active?: boolean;
  createdAt?: any;
  lastLoginAt?: any;
}

export type ValidModuleId =
  | 'BASE'
  | 'TREINOS30'
  | 'PACK48'
  | 'PROGRAMA8'
  | 'TREINOSDIA'
  | 'NUTRICAO';

export interface FirestoreUserAccess {
  id?: string;
  userId: string;
  email: string;
  moduleId: ValidModuleId | string;
  active: boolean;
  createdAt?: any;
  source?: string;
}

export interface UserAccess {
  id: string;
  userId: string;
  moduleId: string;
  permissionName: string;
  status: 'Liberado' | 'Bloqueado';
  grantedAt?: string;
  active?: boolean;
}


export interface ProductSKU {
  sku: string;
  name: string;
  moduleIds: string[];
  type: 'Principal' | 'Combo' | 'Add-on' | 'Vitalício';
  description: string;
}

export interface FeedbackSubmission {
  id: string;
  type: 'Sugestão' | 'Erro encontrado' | 'Pedido de novo exercício' | 'Problema com vídeo' | 'Problema com acesso' | 'Outro';
  message: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AppConfig {
  appName: string;
  version: string;
  pdfBaseUrl: string;
  totalExercises: number;
  totalVideos: number;
  supportEmail: string;
}

export type TabType = 'inicio' | 'exercicios' | 'conteudos' | 'perfil';

