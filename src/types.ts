export type TabType = 'inicio' | 'exercicios' | 'conteudos' | 'perfil';

export type ValidModuleId =
  | 'BASE'
  | 'APP_ACCESS'
  | 'TREINOS30'
  | 'PACK48'
  | 'PROGRAMA8'
  | 'TREINOSDIA'
  | 'NUTRICAO'
  | 'BONUS_MELHORES'
  | 'BONUS_CARGA'
  | string;

export interface Exercise {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  pageNumber: number | string;
  pdfBase?: string;
  moduleId?: string;
  moduloId?: string;
  hasVideo?: boolean;
  videoId?: string;
  videoUrl?: string;
  videoFileName?: string;
  active?: boolean;
  order?: number;
  notes?: string;
  executionSteps?: string[];
  biomechanicsTips?: string[];
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  commonMistakes?: string[];
  image?: string;
  [key: string]: any;
}

export interface Video {
  id: string;
  exerciseId: string;
  exerciseName: string;
  group?: string;
  videoUrl: string;
  fileName?: string;
  moduleId?: string;
  active?: boolean;
  [key: string]: any;
}

export interface Material {
  id?: string;
  ID?: string;
  materialId?: string;
  title?: string;
  Titulo?: string;
  subtitle?: string;
  descricaoCurta?: string;
  category?: string;
  Categoria?: string;
  tag?: string;
  type?: string;
  Tipo?: string;
  role?: string;
  moduleId?: string;
  moduloId?: string;
  ModuloID?: string;
  arquivo?: string;
  permissionCode?: string;
  Permissao_Necessaria?: string;
  mainFolder?: string;
  subFolder?: string;
  functionName?: string;
  isLockedDefault?: boolean;
  directLink?: string;
  url?: string;
  URL?: string;
  previewUrl?: string;
  active?: boolean;
  Ativo?: string | boolean;
  visibleInCatalog?: boolean;
  Visivel_Catalogo?: string | boolean;
  driveFileId?: string;
  localAsset?: string;
  spreadsheetId?: string;
  [key: string]: any;
}

export interface Category {
  id: string;
  name: string;
  groupCode?: string;
  order?: number;
  exerciseCount?: number;
}

export interface CatalogItem {
  id: string;
  title: string;
  category: string;
  type: string;
  moduleId: string;
  permissionName: string;
  status: string;
  isLockedDefault: boolean;
}

export interface UserProfile {
  id: string;
  uid?: string;
  name: string;
  email: string;
  initials: string;
  photoURL?: string;
  badge?: string;
  fullAccess?: boolean;
  active?: boolean;
  createdAt?: any;
  lastLoginAt?: any;
}

export interface UserAccess {
  id: string;
  userId: string;
  moduleId: string;
  permissionName: string;
  status: string;
  grantedAt?: string;
}

export interface FirestoreUserAccess {
  id?: string;
  userId?: string;
  email?: string;
  moduleId: string;
  active: boolean;
  permissionName?: string;
  grantedAt?: any;
  orderId?: string;
  source?: string;
}

export interface ProductSKU {
  sku: string;
  name: string;
  moduleIds: string[];
  type: string;
  description: string;
}

export interface FeedbackSubmission {
  id: string;
  type: string;
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
