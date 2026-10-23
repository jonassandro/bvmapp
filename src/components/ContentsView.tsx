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
  Flame,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Material, CatalogItem } from '../types';

interface ContentsViewProps {
  materials: Material[];
  catalogItems: CatalogItem[];
  hasAccess: (moduleId: string) => boolean;
  onSelectMaterial: (material: Material) => void;
  onAccessDirectMaterial?: (material: Material) => void;
  onSelectLockedItem: (item: CatalogItem) => void;
  onGoToProfile: () => void;
}

export const ContentsView: React.FC<ContentsViewProps> = ({
  materials,
  catalogItems,
  hasAccess,
  onSelectMaterial,
  onAccessDirectMaterial,
  onGoToProfile,
}) => {
  // Find the special Projeto Primeiro Shape em 90 Dias
  const shape90Material = materials.find(
    (m) =>
      m.ID === 'MAT_SHAPE90' ||
      m.id === 'MAT_SHAPE90' ||
      m.ModuloID === 'SHAPE90' ||
      m.moduleId === 'SHAPE90'
  );

  const hasShape90Access = hasAccess('SHAPE90');

  // Visivel_Catalogo e Ativo definem visibilidade no catálogo, NÃO acesso
  const isMaterialCatalogActive = (m: Material) => {
    const vis = m.Visivel_Catalogo !== undefined ? m.Visivel_Catalogo : m.visibleInCatalog;
    const act = m.Ativo !== undefined ? m.Ativo : m.active;
    const isVis = vis === true || vis === 'SIM' || vis === 'sim';
    const isAct = act === true || act === 'SIM' || act === 'sim';
    return isVis && isAct;
  };

  const activeMaterials = materials.filter(isMaterialCatalogActive);

  // Filter regular materials vs promo
  const standardMaterials = activeMaterials.filter(
    (m) => m.ID !== 'MAT_SHAPE90' && m.id !== 'MAT_SHAPE90'
  );

  const releasedMaterials = standardMaterials.filter((m) => {
    const modId = m.ModuloID || m.moduleId;
    return hasAccess(modId);
  });

  const lockedMaterials = standardMaterials.filter((m) => {
    const modId = m.ModuloID || m.moduleId;
    return !hasAccess(modId);
  });

  const hasBase = hasAccess('BASE');
  const allCount = 7;
  const activeCount = [
    'BASE',
    'TREINOS30',
    'PACK48',
    'PROGRAMA8',
    'TREINOSDIA',
    'NUTRICAO',
    'SHAPE90',
  ].filter(hasAccess).length;
  const allUnlocked = activeCount >= 6;

  const handleButtonClick = (e: React.MouseEvent, material: Material) => {
    e.stopPropagation();
    if (onAccessDirectMaterial) {
      onAccessDirectMaterial(material);
    } else {
      onSelectMaterial(material);
    }
  };

  const getItemIcon = (material: Material) => {
    if (material.ID === 'MAT_SHAPE90' || material.id === 'MAT_SHAPE90') {
      return <Flame size={18} className="text-[#FF4444]" />;
    }
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
              <span>Sem Módulos Ativos</span>
            </span>
          )}
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white uppercase pt-0.5">
          Biblioteca de Conteúdos
        </h1>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Biblioteca oficial com todos os materiais, projetos acelerados e planilhas oficiais.
        </p>

        <p className="text-[11px] text-zinc-500 leading-relaxed">
          Cada material é liberado exclusivamente mediante permissão ativa no seu usuário.
        </p>
      </div>

      {/* Featured Spotlight: Projeto Primeiro Shape em 90 Dias */}
      {shape90Material && (
        <div
          id="featured-shape90-card"
          onClick={() => onSelectMaterial(shape90Material)}
          className="bg-gradient-to-br from-[#241310] via-[#1A0E0C] to-[#120807] border border-[#4A261F] hover:border-[#CC0000] rounded-2xl p-4 shadow-xl transition-all cursor-pointer relative overflow-hidden group active:scale-[0.99]"
        >
          {/* Ambient red flare */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#CC0000]/15 rounded-full blur-2xl pointer-events-none group-hover:bg-[#CC0000]/25 transition-all" />

          <div className="relative space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF4444] bg-[#CC0000]/15 border border-[#CC0000]/30 px-2.5 py-0.5 rounded flex items-center gap-1">
                <Flame size={12} />
                <span>Conteúdo Extra em Destaque</span>
              </span>

              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                61% OFF
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-white uppercase tracking-tight group-hover:text-red-200 transition-colors">
                Projeto Primeiro Shape em 90 Dias
              </h3>
              <p className="text-xs text-zinc-300 mt-0.5 line-clamp-2 leading-relaxed">
                Um método estruturado para alcançar o primeiro shape mais rápido do que quem treina normalmente na academia sem planejamento.
              </p>
            </div>

            {/* Price tag strip */}
            <div className="flex items-center justify-between pt-1 border-t border-[#3A1F19]">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-zinc-500 line-through font-mono">
                  De R$ 97,90
                </span>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  R$ 37,90
                </span>
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-[#CC0000] hover:bg-red-700 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md shadow-red-950/40">
                <span>Ver & Desbloquear</span>
                <ChevronRight size={13} />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdos Liberados Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Conteúdos Liberados
          </h2>
          <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">
            {releasedMaterials.length + (hasShape90Access ? 1 : 0)} liberados
          </span>
        </div>

        {releasedMaterials.length > 0 || hasShape90Access ? (
          <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl divide-y divide-[#2D2421] overflow-hidden shadow-md">
            {/* Show shape90 in released if unlocked */}
            {hasShape90Access && shape90Material && (
              <div
                id="material-row-MAT_SHAPE90"
                onClick={() => onSelectMaterial(shape90Material)}
                className="p-3.5 flex items-center justify-between gap-3 bg-[#241310]/50 hover:bg-[#281613] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#120907] border border-[#4A261F] flex items-center justify-center shrink-0">
                    <Flame size={16} className="text-[#FF4444]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white uppercase truncate">
                      {shape90Material.Titulo}
                    </h3>
                    <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                      Projeto Acelerador · 90 Dias
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-acessar-shape90"
                  onClick={(e) => handleButtonClick(e, shape90Material)}
                  className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 active:scale-95 px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 transition-all cursor-pointer"
                >
                  <ExternalLink size={12} />
                  <span>Acessar</span>
                </button>
              </div>
            )}

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
                      <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                        {material.descricaoCurta || material.subtitle} · {material.Tipo || material.type}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    id={`btn-acessar-${matId}`}
                    onClick={(e) => handleButtonClick(e, material)}
                    className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 active:scale-95 px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    {isSpreadsheet ? <ExternalLink size={12} /> : <BookOpen size={12} />}
                    <span>{isSpreadsheet ? 'Planilha' : 'Acessar'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-4 text-xs text-zinc-400 space-y-1">
            <p className="font-semibold text-zinc-300">Nenhum conteúdo liberado no momento</p>
            <p className="text-[11px] text-zinc-500">
              Sua conta ainda não possui permissões ativas. Ative a permissão <strong>BASE</strong> para liberar os guias e exercícios.
            </p>
          </div>
        )}
      </div>

      {/* Outros Conteúdos (Bloqueados) Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Outros Conteúdos do Ecossistema
          </h2>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            {lockedMaterials.length + (!hasShape90Access && shape90Material ? 1 : 0)} disponíveis
          </span>
        </div>

        <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl divide-y divide-[#2D2421] overflow-hidden shadow-md">
          {/* If Shape 90 is locked, show it in the catalog list too */}
          {!hasShape90Access && shape90Material && (
            <div
              id="catalog-row-MAT_SHAPE90"
              onClick={() => onSelectMaterial(shape90Material)}
              className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#201815] active:bg-[#251d1a] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#120907] border border-[#4A261F] flex items-center justify-center shrink-0 text-[#FF4444]">
                  <Flame size={15} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-white truncate">
                    {shape90Material.Titulo}
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5 truncate">
                    De R$ 97,90 por R$ 37,90 · Projeto Acelerado
                  </p>
                </div>
              </div>

              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-[#CC0000]/15 text-[#FF5555] border border-[#CC0000]/30 shrink-0 flex items-center gap-1">
                <span>Desbloquear</span>
              </span>
            </div>
          )}

          {lockedMaterials.map((material) => {
            const matId = material.ID || material.id;
            const modId = material.ModuloID || material.moduleId;

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
                      Conteúdo adicional · Módulo {modId}
                    </p>
                  </div>
                </div>

                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-[#120907] text-zinc-500 border border-[#2D2421] shrink-0 flex items-center gap-1">
                  <Lock size={10} />
                  <span>Bloqueado</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Link: Gerenciar permissões no Perfil */}
      <div className="pt-1">
        <button
          id="btn-ver-acesso-perfil"
          type="button"
          onClick={onGoToProfile}
          className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>Gerenciar permissões no Perfil</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
