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
} from 'lucide-react';
import { Material, CatalogItem } from '../types';

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

  const handleUnlockClick = (e: React.MouseEvent, material: Material) => {
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
    <div id="contents-view" className="space-y-5 pb-12 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-[#120907] rounded-2xl border border-[#2D2421] p-5 shadow-xl space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#CC0000]">Conteúdos</h2>
          {allUnlocked ? (
            <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/20 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>Acesso Total</span>
            </span>
          ) : hasBase ? (
            <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/20 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck size={12} />
              <span>Acesso Base Visual</span>
            </span>
          ) : (
            <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-widest flex items-center gap-1">
              <ShieldAlert size={12} />
              <span>Acesso Pendente</span>
            </span>
          )}
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white uppercase pt-0.5">
          Biblioteca de Conteúdos
        </h1>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Acervo oficial com todos os materiais, guias ilustrados e planilhas de treinamento.
        </p>
      </div>

      {/* Conteúdos Liberados Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Conteúdos Liberados
          </h2>
          <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">
            {releasedMaterials.length} disponíveis
          </span>
        </div>

        {releasedMaterials.length > 0 ? (
          <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl divide-y divide-[#2D2421] overflow-hidden shadow-md">
            {releasedMaterials.map((material) => {
              const matId = material.ID || material.id;
              const isSpreadsheet = material.Tipo === 'Planilha' || material.type === 'Planilha';

              return (
                <div
                  key={matId}
                  id={`material-row-${matId}`}
                  onClick={() => onSelectMaterial(material)}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#231b18] active:bg-[#2a201c] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#120907] border border-[#2D2421] flex items-center justify-center shrink-0">
                      {getItemIcon(material)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-white uppercase truncate">
                        {material.Titulo || material.title}
                      </h3>
                      <p className="text-[10px] text-green-400 font-semibold mt-0.5 truncate">
                        Disponível
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    id={`btn-acessar-${matId}`}
                    onClick={(e) => handleAccessClick(e, material)}
                    className="text-[10px] font-bold uppercase tracking-wider text-white bg-green-600 hover:bg-green-500 active:scale-95 px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 transition-all cursor-pointer shadow-sm shadow-green-950/40"
                  >
                    {isSpreadsheet ? <ExternalLink size={12} /> : <BookOpen size={12} />}
                    <span>Acessar</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-4 text-xs text-zinc-400 space-y-1">
            <p className="font-semibold text-zinc-300">Nenhum conteúdo disponível no momento</p>
            <p className="text-[11px] text-zinc-500">
              Seus conteúdos comprados serão liberados automaticamente após a confirmação do pedido.
            </p>
          </div>
        )}
      </div>

      {/* Conteúdos Adicionais (Bloqueados) Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Conteúdos Adicionais
          </h2>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            {lockedMaterials.length} adicionais
          </span>
        </div>

        {lockedMaterials.length > 0 ? (
          <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl divide-y divide-[#2D2421] overflow-hidden shadow-md">
            {lockedMaterials.map((material) => {
              const matId = material.ID || material.id;

              return (
                <div
                  key={matId}
                  id={`catalog-row-${matId}`}
                  onClick={() => onSelectMaterial(material)}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#201815] active:bg-[#251d1a] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#120907] border border-[#2D2421] flex items-center justify-center shrink-0 text-zinc-600">
                      <Lock size={15} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-medium text-zinc-300 truncate">
                        {material.Titulo || material.title}
                      </h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5 truncate">
                        Conteúdo adicional
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    id={`btn-desbloquear-${matId}`}
                    onClick={(e) => handleUnlockClick(e, material)}
                    className="text-[10px] font-bold uppercase tracking-wider text-zinc-300 bg-[#241a17] hover:bg-[#2e211e] hover:text-white border border-[#3d2e29] active:scale-95 px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Lock size={11} className="text-[#CC0000]" />
                    <span>Desbloquear</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 text-xs text-green-300 flex items-center gap-2.5">
            <ShieldCheck size={18} className="shrink-0 text-green-400" />
            <span>Todos os conteúdos do acervo estão liberados para a sua conta!</span>
          </div>
        )}
      </div>

      {/* Link para Meu Perfil */}
      <div className="pt-1">
        <button
          id="btn-ver-acesso-perfil"
          type="button"
          onClick={onGoToProfile}
          className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Ver meus acessos no Perfil</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
