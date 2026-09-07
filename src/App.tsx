/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { TabType, Exercise, Material, CatalogItem, UserProfile } from './types';
import {
  EXERCISES,
  MATERIALS,
  CATALOG_ITEMS,
  INITIAL_USER,
} from './data/mockData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginView } from './components/LoginView';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { ExercisesView } from './components/ExercisesView';
import { ExerciseDetailView } from './components/ExerciseDetailView';
import { ContentsView } from './components/ContentsView';
import { ContentDetailView } from './components/ContentDetailView';
import { MaterialViewer } from './components/MaterialViewer';
import { ProfileView } from './components/ProfileView';
import { FeedbackModal } from './components/FeedbackModal';
import { LockedContentModal } from './components/LockedContentModal';
import { DemonstrationModal } from './components/DemonstrationModal';
import { MaterialReaderModal } from './components/MaterialReaderModal';
import { PWAUpdateToast } from './components/PWAUpdateToast';
import { AppUpgradeRequiredView } from './components/AppUpgradeRequiredView';

function AppContent() {
  const {
    firebaseUser,
    userProfile,
    userAccesses,
    hasAccess,
    refreshAccesses,
    loading,
    loadingAccesses,
    logout,
  } = useAuth();

  // Navigation tabs state
  const [currentTab, setCurrentTab] = useState<TabType>('inicio');

  // Active detail views
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [activeViewingMaterial, setActiveViewingMaterial] = useState<Material | null>(null);

  // Search and Category filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');

  // Modals state
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [lockedCatalogItem, setLockedCatalogItem] = useState<CatalogItem | null>(null);
  const [demoExercise, setDemoExercise] = useState<Exercise | null>(null);
  const [readerState, setReaderState] = useState<{
    isOpen: boolean;
    material?: Material | null;
    exerciseRef?: Exercise | null;
  }>({
    isOpen: false,
    material: null,
    exerciseRef: null,
  });

  // Access checks
  const hasAppAccess = hasAccess('APP_ACCESS');
  const hasBase = hasAccess('BASE');
  const allModulesList = ['BASE', 'TREINOS30', 'PACK48', 'PROGRAMA8', 'TREINOSDIA', 'NUTRICAO'];
  const activeCount = allModulesList.filter((m) => hasAccess(m)).length;
  const hasAllModules = activeCount === allModulesList.length;

  // Construct authenticated user profile with Firestore badge
  const user: UserProfile = useMemo(() => {
    if (!firebaseUser && !userProfile) {
      return INITIAL_USER;
    }

    const name =
      userProfile?.name ||
      firebaseUser?.displayName ||
      firebaseUser?.email?.split('@')[0] ||
      'Usuário';
    const email =
      userProfile?.email ||
      firebaseUser?.email ||
      '';
    const photoURL = userProfile?.photoURL || firebaseUser?.photoURL || '';

    const initials =
      name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n: string) => n[0].toUpperCase())
        .join('') || 'U';

    const calculatedBadge = hasAllModules
      ? 'Acesso Total'
      : hasBase
      ? activeCount > 1
        ? `Base + ${activeCount - 1} Módulos`
        : 'Acesso Base Visual'
      : activeCount > 0
      ? `${activeCount} Módulo(s) Ativo(s)`
      : 'Sem Módulos Ativos';

    return {
      id: firebaseUser?.uid || 'USR_CURRENT',
      uid: firebaseUser?.uid || 'USR_CURRENT',
      name,
      email,
      initials,
      photoURL,
      badge: calculatedBadge,
      fullAccess: hasAllModules,
      active: userProfile?.active ?? true,
      createdAt: userProfile?.createdAt,
      lastLoginAt: userProfile?.lastLoginAt,
    };
  }, [firebaseUser, userProfile, hasAllModules, hasBase, activeCount]);

  // Loading state while verifying Firebase session or checking accesses
  if (loading || (firebaseUser && loadingAccesses && userAccesses.length === 0)) {
    return (
      <div className="min-h-screen bg-[#08080a] text-[#ededf0] flex items-center justify-center font-sans antialiased p-4">
        <div className="w-full max-w-xs bg-[#0c0c10] border border-[#1e1e28] rounded-2xl p-6 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 bg-[#e50914] rounded-xl flex items-center justify-center font-extrabold text-white text-xl mx-auto shadow-md shadow-red-950/50">
            B
          </div>
          <div className="space-y-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Base Visual da Musculação
            </h2>
            <p className="text-xs text-zinc-500">Verificando permissões...</p>
          </div>
          <Loader2 size={24} className="animate-spin text-[#e50914] mx-auto" />
        </div>
      </div>
    );
  }

  // Protected route: unauthenticated users view the Login screen
  if (!firebaseUser) {
    return <LoginView />;
  }

  // Gatekeeping: require APP_ACCESS to enter the App version
  if (!hasAppAccess) {
    return (
      <>
        <AppUpgradeRequiredView
          userEmail={user.email}
          userName={user.name}
          onRefreshAccesses={refreshAccesses}
          onLogout={logout}
          onOpenHelp={() => setIsFeedbackOpen(true)}
        />
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          defaultName={user.name}
          defaultEmail={user.email}
        />
      </>
    );
  }

  // Calculate high level counts
  const totalExercises = EXERCISES.length;
  const totalVideos = EXERCISES.filter((e) => e.hasVideo).length;
  const totalMaterials = MATERIALS.length + CATALOG_ITEMS.length;

  // Handle Tab navigation
  const handleSelectTab = (tab: TabType) => {
    setCurrentTab(tab);
    if (tab !== 'exercicios') {
      setSelectedExercise(null);
    }
    if (tab !== 'conteudos') {
      setSelectedMaterial(null);
      setActiveViewingMaterial(null);
    }
  };

  // Home search jump
  const handleHomeSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('todos');
    setSelectedExercise(null);
    setCurrentTab('exercicios');
  };

  // Category select jump from Home
  const handleHomeCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    setSelectedExercise(null);
    setCurrentTab('exercicios');
  };

  // View all exercises from Home
  const handleViewAllExercises = () => {
    setSelectedCategory('todos');
    setSearchQuery('');
    setSelectedExercise(null);
    setCurrentTab('exercicios');
  };

  // Video demo open - controlled by BASE module
  const handleOpenVideo = (exercise: Exercise) => {
    if (!hasBase) {
      setLockedCatalogItem({
        id: 'LOCKED_BASE_VIDEO',
        title: `Vídeo: ${exercise.name}`,
        category: 'Vídeo Demonstrativo',
        type: 'Vídeo MP4',
        moduleId: 'BASE',
        permissionName: 'Módulo Principal Base Visual',
        status: 'Bloqueado',
        isLockedDefault: true,
      });
      return;
    }
    setDemoExercise(exercise);
  };

  // Material reader open for exercise reference - controlled by BASE module
  const handleOpenMaterialRef = (exercise: Exercise) => {
    if (!hasBase) {
      setLockedCatalogItem({
        id: 'LOCKED_BASE_REF',
        title: 'Guia Base Visual da Musculação (PDF)',
        category: 'Guia Oficial de Treinamento',
        type: 'PDF Oficial',
        moduleId: 'BASE',
        permissionName: 'Módulo Principal Base Visual',
        status: 'Bloqueado',
        isLockedDefault: true,
      });
      return;
    }
    const baseMaterial = MATERIALS.find(
      (m) => (m.materialId || m.id || m.ID) === 'MAT001'
    ) || null;
    setReaderState({
      isOpen: true,
      material: baseMaterial,
      exerciseRef: exercise,
    });
  };

  // Material access open for material card - controlled by item's ModuloID
  const handleOpenMaterial = (material: Material) => {
    const modId = material.ModuloID || material.moduleId;
    if (!hasAccess(modId)) {
      setLockedCatalogItem({
        id: `LOCKED_${material.ID || material.id}`,
        title: material.Titulo || material.title,
        category: material.Categoria || material.category || material.tag || 'Material',
        type: material.Tipo || material.type,
        moduleId: modId,
        permissionName: material.Permissao_Necessaria || material.permissionCode || modId,
        status: 'Bloqueado',
        isLockedDefault: true,
      });
      return;
    }

    const isSpreadsheet = material.Tipo === 'Planilha' || material.type === 'Planilha';
    if (isSpreadsheet) {
      const targetUrl = material.URL || material.url || material.directLink;
      if (targetUrl) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    // Para PDF ou Imagem: abrir internamente no app via MaterialViewer
    setActiveViewingMaterial(material);
    setCurrentTab('conteudos');
  };

  const handleUnlockContent = (mat: Material) => {
    const modId = mat.ModuloID || mat.moduleId;
    setLockedCatalogItem({
      id: `LOCKED_${mat.ID || mat.id}`,
      title: mat.Titulo || mat.title,
      category: mat.Categoria || mat.category || mat.tag || 'Material',
      type: mat.Tipo || mat.type,
      moduleId: modId,
      permissionName: mat.Permissao_Necessaria || mat.permissionCode || modId,
      status: 'Bloqueado',
      isLockedDefault: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 flex justify-center font-sans antialiased selection:bg-[#e50914] selection:text-white">
      {/* Mobile container centered on desktop */}
      <main
        id="app-container"
        className="w-full max-w-md min-h-screen bg-[#0c0c10] shadow-2xl relative flex flex-col border-x border-[#1e1e28] pb-24"
      >
        {/* Top Header with Brand Identity */}
        <header
          id="app-top-header"
          className="h-16 flex items-center justify-between px-4 bg-[#0c0c10]/95 backdrop-blur-md border-b border-[#1e1e28] sticky top-0 z-30"
        >
          <div
            onClick={() => handleSelectTab('inicio')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 bg-[#e50914] rounded-xl flex items-center justify-center font-extrabold text-white text-base shadow-md shadow-red-950/50">
              B
            </div>
            <h1 className="text-sm font-bold tracking-tight uppercase text-white">
              Base Visual <span className="text-[#e50914]">da Musculação</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[9px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-widest hidden xs:inline-flex items-center gap-1 ${
                hasBase
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {hasBase ? <ShieldCheck size={11} /> : <ShieldAlert size={11} />}
              <span>{user.badge}</span>
            </span>

            <button
              id="top-profile-chip"
              onClick={() => handleSelectTab('perfil')}
              className="flex items-center gap-1.5 bg-[#14141c] p-1 px-2.5 rounded-full border border-[#262632] hover:border-[#e50914]/60 transition-colors cursor-pointer"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-5 h-5 rounded-full object-cover border border-[#282836]"
                />
              ) : (
                <div className="w-5 h-5 bg-[#20202c] rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                  {user.initials}
                </div>
              )}
              <span className="text-[11px] font-medium text-zinc-300 max-w-[65px] truncate">
                {user.name.split(' ')[0]}
              </span>
            </button>
          </div>
        </header>

        {/* Screen Content Container */}
        <div className="px-4 pt-3 pb-2 flex-1">
          {/* Main Active Screen Rendering */}
          {currentTab === 'inicio' && (
            <HomeView
              totalExercises={totalExercises}
              totalVideos={totalVideos}
              totalMaterials={totalMaterials}
              userBadge={user.badge}
              hasBaseAccess={hasBase}
              materials={MATERIALS}
              hasAccess={hasAccess}
              onSelectMaterial={handleOpenMaterial}
              onSearch={handleHomeSearch}
              onSelectCategory={handleHomeCategorySelect}
              onViewAllExercises={handleViewAllExercises}
              onNavigateTab={handleSelectTab}
            />
          )}

          {currentTab === 'exercicios' && (
            <>
              {selectedExercise ? (
                <ExerciseDetailView
                  exercise={selectedExercise}
                  hasBaseAccess={hasBase}
                  onBack={() => setSelectedExercise(null)}
                  onOpenVideo={handleOpenVideo}
                  onOpenMaterialRef={handleOpenMaterialRef}
                  onUnlockContent={() => handleOpenMaterialRef(selectedExercise)}
                />
              ) : (
                <ExercisesView
                  exercises={EXERCISES}
                  hasBaseAccess={hasBase}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  onSelectExercise={(ex) => setSelectedExercise(ex)}
                />
              )}
            </>
          )}

          {currentTab === 'conteudos' && (
            <>
              {activeViewingMaterial ? (
                <MaterialViewer
                  material={activeViewingMaterial}
                  onBack={() => setActiveViewingMaterial(null)}
                />
              ) : selectedMaterial ? (
                <ContentDetailView
                  material={selectedMaterial}
                  isUnlocked={hasAccess(selectedMaterial.ModuloID || selectedMaterial.moduleId)}
                  onBack={() => setSelectedMaterial(null)}
                  onAccessMaterial={handleOpenMaterial}
                  onUnlockContent={handleUnlockContent}
                />
              ) : (
                <ContentsView
                  materials={MATERIALS}
                  catalogItems={CATALOG_ITEMS}
                  hasAccess={hasAccess}
                  onSelectMaterial={(mat) => {
                    setActiveViewingMaterial(null);
                    setSelectedMaterial(mat);
                  }}
                  onSelectLockedItem={(item) => setLockedCatalogItem(item)}
                  onGoToProfile={() => setCurrentTab('perfil')}
                  onAccessDirectMaterial={handleOpenMaterial}
                />
              )}
            </>
          )}

          {currentTab === 'perfil' && (
            <ProfileView
              user={user}
              materials={MATERIALS}
              hasAccess={hasAccess}
              onRefreshAccesses={refreshAccesses}
              onOpenHelp={() => setIsFeedbackOpen(true)}
              onSelectMaterial={(mat) => {
                setActiveViewingMaterial(null);
                setSelectedMaterial(mat);
                setCurrentTab('conteudos');
              }}
              onLogout={logout}
            />
          )}
        </div>

        {/* Persistent Bottom Navigation Bar across all screens */}
        <BottomNav currentTab={currentTab} onSelectTab={handleSelectTab} />

        {/* Discreet PWA Service Worker Update Notification */}
        <PWAUpdateToast />

        {/* Modals */}
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          defaultName={user.name}
          defaultEmail={user.email}
        />

        <LockedContentModal
          item={lockedCatalogItem}
          onClose={() => setLockedCatalogItem(null)}
          onGoToProfile={() => setCurrentTab('perfil')}
        />

        <DemonstrationModal
          exercise={demoExercise}
          hasAccess={hasBase}
          onClose={() => setDemoExercise(null)}
        />

        <MaterialReaderModal
          isOpen={readerState.isOpen}
          onClose={() => setReaderState({ isOpen: false, material: null, exerciseRef: null })}
          material={readerState.material}
          exerciseRef={readerState.exerciseRef}
          hasAccess={readerState.material ? hasAccess(readerState.material.ModuloID || readerState.material.moduleId) : hasBase}
        />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
