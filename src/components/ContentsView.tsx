import React from 'react';
import {
  BookOpen,
  ShieldCheck,
  Lock,
  ChevronRight,
  ShieldAlert,
  ExternalLink,
  FileSpreadsheet,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { Material, CatalogItem } from '../types';
import { getMaterialMeta, getCheckoutUrl } from '../data/contentCovers';

interface ContentsViewProps {
  materials: Material[];
  catalogItems?: CatalogItem[];
  hasAccess: (moduleId: string) => boolean;
  onSelectMaterial: (material: Material) => void;
  onAccessDirectMaterial?: (material: Material) => void;
  onSelectLockedItem: (item: CatalogItem) => void;
  onGoToProfile: () => void;
}

export const ContentsView: React.FC<ContentsViewProps> = ({
  materials,
  hasAccess,
  onSelectMaterial,
  onAccessDirectMaterial,
  onSelectLockedItem,
  onGoToProfile,
}) => {
  // Visivel_Catalogo e Ativo definem visibilidade no catálogo
  const isMaterialCatalogActive = (m: Material) => {
    const vis = m.Visivel_Catalogo !== undefined ? m.Visivel_Catalogo : m.visibleInCatalog;
    const act = m.Ativo !== undefined ? m.Ativo : m.active;
    const isVis = vis === true || vis === 'SIM' || vis === 'sim';
    const isAct = act === true || act === 'SIM' || act === 'sim';
    return isVis && isAct;
  };

  const activeMaterials = materials.filter(isMaterialCatalogActive);

  // Acesso controlado estritamente pelo ModuloID
  const releasedMaterials = activeMaterials.filter((m) => {
    const modId = m.ModuloID || m.moduleId;
    return hasAccess(modId);
  });

  const lockedMaterials = activeMaterials.filter((m) => {
    const modId = m.ModuloID || m.moduleId;
    return !hasAccess(modId);
  });

  const hasBase = hasAccess('BASE');
  const allCount = 6;
  const activeCount = ['BASE', 'TREINOS30', 'PACK48', 'PROGRAMA8', 'TREINOSDIA', 'NUTRICAO'].filter(hasAccess).length;
  const allUnlocked = activeCount === allCount;

  const handleAccessClick = (e: React.MouseEvent, material: Material) => {
    e.stopPropagation();
    if (onAccessDirectMaterial) {
      onAccessDirectMaterial(material);
    } else {
      onSelectMaterial(material);
    }
  };

  const handleOpenLockedModal = (e: React.MouseEvent, material: Material) => {
    e.stopPropagation();
    const modId = material.ModuloID || material.moduleId;
    onSelectLockedItem({
      id: `LOCKED_${material.ID || material.id}`,
      title: material.Titulo || material.title,
      category: material.Categoria || material.category || material.tag || 'Material Complementar',
      type: material.Tipo || material.type || 'Material Digital',
      moduleId: modId,
      permissionName: 'Conteúdo Adicional',
      status: 'Bloqueado',
      isLockedDefault: true,
    });
  };

  const getItemIcon = (material: Material) => {
    const type = material.Tipo || material.type;
    if (type === 'Planilha') return <FileSpreadsheet size={16} className="text-emerald-400" />;
    if (type === 'Imagem') return <ImageIcon size={16} className="text-amber-400" />;
    return <BookOpen size={16} className="text-zinc-400" />;
  };

  return (
    <div id="contents-view" className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0f0f14] border border-[#262632] p-5 shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e50914]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#e50914]">Conteúdos</h2>
          </div>

          {allUnlocked ? (
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck size={12} />
              <span>Acesso Total</span>
            </span>
          ) : hasBase ? (
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck size={12} />
              <span>Base Visual Ativa</span>
            </span>
          ) : (
            <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-500/20 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldAlert size={12} />
              <span>Acesso Pendente</span>
            </span>
          )}
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white uppercase">
          Biblioteca de Conteúdos
        </h1>

        <p className="text-xs text-zinc-400 leading-relaxed mt-1">
          Acesse seus guias, planilhas e expanda seu acervo com os módulos complementares.
        </p>
      </div>

      {/* ========================================================
          1. CONTEÚDOS DISPONÍVEIS (LIBERADOS)
         ======================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 rounded-full bg-emerald-500" />
            <h2 className="text-xs uppercase font-bold text-white tracking-wider">
              Conteúdos Liberados
            </h2>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {releasedMaterials.length} disponíveis
          </span>
        </div>

        {releasedMaterials.length > 0 ? (
          <div className="grid grid-cols-1 gap-2.5">
            {releasedMaterials.map((material) => {
              const matId = material.ID || material.id;
              const isSpreadsheet = material.Tipo === 'Planilha' || material.type === 'Planilha';
              const meta = getMaterialMeta(matId, material.ModuloID || material.moduleId);

              return (
                <div
                  key={matId}
                  id={`material-card-${matId}`}
                  onClick={() => onSelectMaterial(material)}
                  className="group bg-[#111116] hover:bg-[#16161d] active:scale-[0.99] border border-[#23232e] hover:border-zinc-700/80 rounded-2xl p-3.5 flex items-center justify-between gap-3.5 cursor-pointer transition-all shadow-md"
                >
                  {/* Left: Thumbnail and info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-16 h-14 rounded-xl overflow-hidden bg-black/50 border border-[#2b2b38] shrink-0">
                      <img
                        src={meta.coverUrl}
                        alt={material.Titulo || material.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-1 right-1">
                        {getItemIcon(material)}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block truncate">
                        {material.Categoria || material.category || meta.badge}
                      </span>
                      <h3 className="text-xs font-bold text-white uppercase tracking-tight truncate mt-0.5">
                        {material.Titulo || material.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Liberado
                        </span>
                        <span className="text-zinc-600 text-[10px]">·</span>
                        <span className="text-[9px] text-zinc-400 font-medium">
                          {material.Tipo || material.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Button */}
                  <button
                    type="button"
                    id={`btn-acessar-${matId}`}
                    onClick={(e) => handleAccessClick(e, material)}
                    className="text-[10px] font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 px-3 py-2 rounded-xl shrink-0 flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-950/40"
                  >
                    {isSpreadsheet ? <ExternalLink size={12} /> : <BookOpen size={12} />}
                    <span>Acessar</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#111116] border border-[#23232e] rounded-2xl p-4 text-xs text-zinc-400 space-y-1 text-center">
            <p className="font-semibold text-zinc-200">Nenhum conteúdo disponível no momento</p>
            <p className="text-[11px] text-zinc-400">
              Seus conteúdos comprados são liberados automaticamente após a confirmação do pedido.
            </p>
          </div>
        )}
      </section>

      {/* ========================================================
          2. CONTEÚDOS ADICIONAIS BLOQUEADOS (VITRINE PREMIUM COM COMPRA)
         ======================================================== */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 rounded-full bg-[#e50914]" />
            <h2 className="text-xs uppercase font-bold text-white tracking-wider">
              Conteúdos Adicionais
            </h2>
          </div>
          <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800/60 border border-zinc-700/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {lockedMaterials.length} disponíveis para adicionar
          </span>
        </div>

        {lockedMaterials.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {lockedMaterials.map((material) => {
              const matId = material.ID || material.id;
              const modId = material.ModuloID || material.moduleId;
              const meta = getMaterialMeta(matId, modId);
              const checkoutUrl = meta.checkoutUrl || getCheckoutUrl(modId);

              return (
                <div
                  key={matId}
                  id={`locked-showcase-${matId}`}
                  className="relative overflow-hidden bg-[#111116] border border-[#262634] hover:border-red-900/40 rounded-2xl p-4 shadow-xl transition-all space-y-3.5 group"
                >
                  {/* Subtle crimson ambient light on top */}
                  <div className="absolute top-0 right-0 w-36 h-28 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Top Image Showcase Banner */}
                  <div
                    onClick={(e) => handleOpenLockedModal(e, material)}
                    className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#2b2b3a] bg-black shadow-md cursor-pointer"
                  >
                    <img
                      src={meta.coverUrl}
                      alt={material.Titulo || material.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-black/30" />

                    {/* Locked Badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/85 backdrop-blur-md border border-red-500/40 text-red-400 shadow-lg">
                        <Lock size={11} className="text-[#e50914]" />
                        <span>Módulo Exclusivo</span>
                      </span>
                    </div>

                    {/* Tag badge on bottom left */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-zinc-900/90 text-zinc-200 border border-zinc-700/80">
                        {material.Tipo || material.type}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#e50914]">
                      {material.Categoria || material.category || meta.badge}
                    </span>
                    <h3 className="text-sm font-bold text-white uppercase tracking-tight">
                      {material.Titulo || material.title}
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed pt-0.5">
                      {meta.description}
                    </p>
                  </div>

                  {/* Bullet value highlights */}
                  {meta.valueHighlights && meta.valueHighlights.length > 0 && (
                    <div className="bg-[#15151e] border border-[#22222d] rounded-xl p-3 space-y-1.5">
                      {meta.valueHighlights.map((hl, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                          <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons: Real Checkout Link + Details Modal */}
                  <div className="pt-1 flex flex-col sm:flex-row gap-2">
                    {checkoutUrl ? (
                      <a
                        id={`btn-buy-${matId}`}
                        href={checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-[#e50914] hover:bg-red-600 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 text-center cursor-pointer"
                      >
                        <Sparkles size={14} />
                        <span>Desbloquear Agora</span>
                        <ExternalLink size={13} className="opacity-90" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        id={`btn-unlock-${matId}`}
                        onClick={(e) => handleOpenLockedModal(e, material)}
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Lock size={13} />
                        <span>Ver Detalhes do Acesso</span>
                      </button>
                    )}

                    <button
                      type="button"
                      id={`btn-details-${matId}`}
                      onClick={(e) => handleOpenLockedModal(e, material)}
                      className="bg-[#181822] hover:bg-[#20202c] border border-[#282836] text-zinc-300 hover:text-white font-bold text-[11px] uppercase tracking-wider py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Detalhes</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 text-xs text-emerald-300 flex items-center gap-3">
            <ShieldCheck size={20} className="shrink-0 text-emerald-400" />
            <div>
              <p className="font-bold uppercase tracking-wide text-white text-[11px]">
                Parabéns! Acesso Completo
              </p>
              <p className="text-[11px] text-zinc-300 mt-0.5">
                Você já possui todos os módulos e conteúdos adicionais liberados na sua conta.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Link para Meu Perfil */}
      <div className="pt-2 text-center">
        <button
          id="btn-ver-acesso-perfil"
          type="button"
          onClick={onGoToProfile}
          className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1"
        >
          <span>Conferir todos os meus acessos no Perfil</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
