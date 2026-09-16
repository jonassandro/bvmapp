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
  FileText,
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
    return <FileText size={16} className="text-[#CC0000]" />;
  };

  return (
    <div id="contents-view" className="space-y-4 pb-8 animate-in fade-in duration-200">
      {/* Top Header & Counter */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase leading-none">
            Conteúdos
          </h1>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Guias, fichas e planilhas de musculação
          </p>
        </div>
        <span className="text-[11px] text-zinc-400 bg-[#1A1412] border border-[#2D2421] px-2.5 py-1 rounded font-bold uppercase tracking-wider">
          {releasedMaterials.length} liberados
        </span>
      </div>

      {/* Banner de Status de Acesso */}
      <div className="bg-[#120907] border border-[#2D2421] rounded-2xl p-4 space-y-2 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#CC0000]/10 text-[#CC0000] flex items-center justify-center">
              <BookOpen size={16} />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Materiais e Fichas do Aluno
              </h2>
              <p className="text-[11px] text-zinc-400">
                Você possui acesso completo a todos os materiais, fichas e planilhas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Materiais Liberados */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-green-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-green-400">
            Materiais Disponíveis ({releasedMaterials.length})
          </h2>
        </div>

        {releasedMaterials.length === 0 ? (
          <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-4 text-center text-xs text-zinc-500">
            Nenhum conteúdo encontrado.
          </div>
        ) : (
          <div className="space-y-2">
            {releasedMaterials.map((mat) => (
              <div
                key={mat.ID || mat.id}
                id={`unlocked-material-${mat.ID || mat.id}`}
                onClick={() => onSelectMaterial(mat)}
                className="bg-[#1A1412] border border-[#2D2421] hover:border-[#CC0000]/60 rounded-xl p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99] group shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-[#120907] border border-[#2D2421] flex items-center justify-center shrink-0">
                    {getItemIcon(mat)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">
                        {mat.Categoria || mat.category || 'Material'}
                      </span>
                      <span className="text-zinc-600 text-[9px]">·</span>
                      <span className="text-[9px] font-mono text-zinc-500 font-bold">
                        {mat.Tipo || mat.type}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white uppercase group-hover:text-red-300 transition-colors truncate">
                      {mat.Titulo || mat.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleAccessClick(e, mat)}
                    className="bg-[#CC0000] hover:bg-[#b30000] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Acessar
                  </button>
                  <ChevronRight size={15} className="text-zinc-500 group-hover:text-white" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
