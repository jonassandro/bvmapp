import React from 'react';
import {
  BookOpen,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  FileSpreadsheet,
  Image as ImageIcon,
} from 'lucide-react';
import { Material, CatalogItem } from '../types';
import { getMaterialMeta } from '../data/contentCovers';

interface ContentsViewProps {
  materials: Material[];
  catalogItems?: CatalogItem[];
  hasAccess?: (moduleId: string) => boolean;
  onSelectMaterial: (material: Material) => void;
  onAccessDirectMaterial?: (material: Material) => void;
  onSelectLockedItem?: (item: CatalogItem) => void;
  onGoToProfile: () => void;
}

export const ContentsView: React.FC<ContentsViewProps> = ({
  materials,
  onSelectMaterial,
  onAccessDirectMaterial,
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

  const handleAccessClick = (e: React.MouseEvent, material: Material) => {
    e.stopPropagation();
    if (onAccessDirectMaterial) {
      onAccessDirectMaterial(material);
    } else {
      onSelectMaterial(material);
    }
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

          <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck size={12} />
            <span>Acesso Total Liberado</span>
          </span>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white uppercase">
          Biblioteca de Conteúdos
        </h1>

        <p className="text-xs text-zinc-400 leading-relaxed mt-1">
          Acesse todos os seus guias, planilhas e módulos complementares inclusos no app.
        </p>
      </div>

      {/* ========================================================
          CONTEÚDOS DISPONÍVEIS (TODOS LIBERADOS)
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
            {activeMaterials.length} disponíveis
          </span>
        </div>

        {activeMaterials.length > 0 ? (
          <div className="grid grid-cols-1 gap-2.5">
            {activeMaterials.map((material) => {
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
