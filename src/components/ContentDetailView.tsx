import React from 'react';
import {
  ArrowLeft,
  Lock,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  FileSpreadsheet,
  BookOpen,
  Sparkles,
  Flame,
  Zap,
  Target,
  CheckCircle2,
  Clock,
  Unlock,
} from 'lucide-react';
import { Material } from '../types';

interface ContentDetailViewProps {
  material: Material;
  isUnlocked: boolean;
  onBack: () => void;
  onAccessMaterial: (material: Material) => void;
  onUnlockContent?: (material: Material) => void;
}

export const ContentDetailView: React.FC<ContentDetailViewProps> = ({
  material,
  isUnlocked,
  onBack,
  onAccessMaterial,
  onUnlockContent,
}) => {
  const materialTitle = material.Titulo || material.title;
  const materialDesc = material.descricaoCurta || material.subtitle || material.Categoria || material.category || '';
  const isSpreadsheet = material.Tipo === 'Planilha' || material.type === 'Planilha';
  const isShape90 =
    material.ID === 'MAT_SHAPE90' ||
    material.id === 'MAT_SHAPE90' ||
    material.ModuloID === 'SHAPE90' ||
    material.moduleId === 'SHAPE90' ||
    Boolean(material.isPromo);

  const handleAcquireShape90 = () => {
    const targetUrl = material.acquireUrl || 'https://primeiroshapeacesso.ai.studio/';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="content-detail-view" className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Botão voltar */}
      <div>
        <button
          id="btn-back-content"
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white text-[11px] font-bold uppercase tracking-wider py-1 mb-2 transition-colors active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Voltar para Conteúdos</span>
        </button>
      </div>

      {/* ==================================================
         CASO ESPECIAL: PROJETO PRIMEIRO SHAPE EM 90 DIAS
         ================================================== */}
      {isShape90 ? (
        <div className="space-y-4">
          {/* Header Card com Estilo Especial */}
          <div className="bg-gradient-to-b from-[#1E110E] via-[#140B09] to-[#0E0706] border border-[#3E251E] rounded-2xl p-5 shadow-2xl space-y-3 relative overflow-hidden">
            {/* Subtle ambient glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#CC0000]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF3333] bg-[#CC0000]/15 border border-[#CC0000]/30 px-3 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
                <Flame size={13} className="text-[#FF4444]" />
                <span>Conteúdo Extra Exclusivo</span>
              </span>

              {isUnlocked ? (
                <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck size={12} />
                  <span>Liberado no seu App</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">
                  Oferta Disponível
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-white uppercase leading-tight pt-1">
                {materialTitle}
              </h1>
              <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                Um método estruturado para alcançar o seu primeiro shape notável até 3x mais rápido do que quem treina normalmente sem planejamento na academia.
              </p>
            </div>

            {/* Special Pricing Box */}
            <div className="bg-[#1C1210] border border-[#3A221C] rounded-xl p-4 mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Condição Especial de Acesso
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  61% de Desconto
                </span>
              </div>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-xs text-zinc-500 line-through font-mono">
                  De R$ 97,90
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-emerald-400 font-bold">Por apenas</span>
                  <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
                    R$ 37,90
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400">
                Pagamento único · Acesso completo ao projeto e cronograma
              </p>
            </div>
          </div>

          {/* Explanation Card: Por que este projeto funciona mais rápido */}
          <div className="bg-[#16100E] border border-[#2B1F1C] rounded-2xl p-5 space-y-3.5 shadow-xl">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#CC0000]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                Como o projeto acelera seus resultados
              </h2>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              A grande maioria das pessoas que entra na academia passa meses ou anos sem mudanças visíveis porque treina de forma genérica, sem periodização e errando o volume nas séries que realmente importam.
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#CC0000]/15 flex items-center justify-center shrink-0 text-[#FF4444] mt-0.5">
                  <Target size={12} />
                </div>
                <div className="text-[11px] leading-relaxed">
                  <strong className="text-white block font-bold">Foco nos Músculos Visuais do Shape</strong>
                  <span className="text-zinc-400">
                    Construção prioritária de deltoides laterais, peitoral superior e dorsais para gerar o impacto visual do corpo atlético em poucas semanas.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#CC0000]/15 flex items-center justify-center shrink-0 text-[#FF4444] mt-0.5">
                  <CheckCircle2 size={12} />
                </div>
                <div className="text-[11px] leading-relaxed">
                  <strong className="text-white block font-bold">Fim do Efeito Platô em 90 Dias</strong>
                  <span className="text-zinc-400">
                    Três ciclos progressivos de 30 dias que alternam estímulos neuromusculares e metabólicos sem deixar seu corpo se acostumar com a carga.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#CC0000]/15 flex items-center justify-center shrink-0 text-[#FF4444] mt-0.5">
                  <Clock size={12} />
                </div>
                <div className="text-[11px] leading-relaxed">
                  <strong className="text-white block font-bold">Evolução Muito Mais Rápida</strong>
                  <span className="text-zinc-400">
                    Otimizado para quem tem tempo limitado e busca máxima eficiência biomecânica em cada sessão de treino.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Card: Botão de Adquirir & Opção de Desbloquear */}
          <div className="bg-[#16100E] border border-[#2B1F1C] rounded-2xl p-5 space-y-3.5 shadow-xl">
            {/* Primary Acquire CTA */}
            <button
              id="btn-adquirir-projeto"
              type="button"
              onClick={handleAcquireShape90}
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-black text-xs uppercase tracking-widest py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-950/50 cursor-pointer"
            >
              <ExternalLink size={16} />
              <span>Adquirir Projeto — De 97,90 por R$ 37,90</span>
            </button>

            <p className="text-[10px] text-center text-zinc-500">
              Você será direcionado para a página oficial do projeto:{' '}
              <span className="text-zinc-400 font-mono">primeiroshapeacesso.ai.studio</span>
            </p>

            {/* Opção de Desbloquear */}
            <div className="pt-2 border-t border-[#2A1F1C] flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">
                {isUnlocked ? 'Projeto já desbloqueado na sua conta' : 'Já comprou ou quer testar o acesso?'}
              </span>
              <button
                id="btn-desbloquear-shape90"
                type="button"
                onClick={() => {
                  if (onUnlockContent) {
                    onUnlockContent(material);
                  }
                }}
                className="text-[11px] font-bold uppercase tracking-wider text-[#FF4444] hover:text-white px-2.5 py-1 rounded bg-[#201513] hover:bg-[#2B1B18] border border-[#3E251E] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Unlock size={12} />
                <span>{isUnlocked ? 'Acesso Ativo' : 'Desbloquear no App'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : isUnlocked ? (
        /* ==================================================
           CONTEÚDOS LIBERADOS PADRÃO
           ================================================== */
        <div className="space-y-4">
          {/* Header Card */}
          <div className="bg-[#120907] border border-[#2D2421] rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded flex items-center gap-1.5">
                <ShieldCheck size={12} />
                <span>Disponível no seu acesso</span>
              </span>
              <span className="text-[10px] font-mono text-zinc-500 font-bold">
                {material.ID || material.id}
              </span>
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-white uppercase leading-tight">
                {materialTitle}
              </h1>
              {materialDesc && (
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {materialDesc}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-[#2D2421] flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="text-zinc-500">Módulo:</span>
              <span className="font-bold text-[#CC0000] font-mono">
                {material.ModuloID || material.moduleId}
              </span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-500">Formato:</span>
              <span className="font-medium text-zinc-300">
                {material.Tipo || material.type}
              </span>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-[#1A1412] border border-[#2D2421] rounded-xl p-4 shadow-md space-y-3">
            {isSpreadsheet ? (
              /* PLANILHA */
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase">
                      Planilha Interativa
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Controle de RIR, RPE e volume de treino
                    </p>
                  </div>
                </div>

                <button
                  id="btn-abrir-planilha"
                  type="button"
                  onClick={() => onAccessMaterial(material)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
                >
                  <ExternalLink size={15} />
                  <span>Abrir planilha</span>
                </button>
              </div>
            ) : (
              /* PDF OU IMAGEM */
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase">
                      Leitura e Visualização
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Visualizador interno integrado no aplicativo
                    </p>
                  </div>
                </div>

                <button
                  id="btn-acessar-material"
                  type="button"
                  onClick={() => onAccessMaterial(material)}
                  className="w-full bg-[#CC0000] hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 cursor-pointer"
                >
                  <BookOpen size={15} />
                  <span>Acessar material</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ==================================================
           CONTEÚDOS BLOQUEADOS PADRÃO
           ================================================== */
        <div className="space-y-4">
          <div className="bg-[#120907] border border-[#2D2421] rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-[#1A1412] border border-[#2D2421] px-2.5 py-1 rounded">
                Conteúdo adicional
              </span>
              <span className="text-[10px] font-mono text-zinc-600 font-bold">
                {material.ID || material.id}
              </span>
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-white uppercase leading-tight">
                {materialTitle}
              </h1>
              {materialDesc && (
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {materialDesc}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-[#2D2421] flex items-center gap-2 text-[11px] text-zinc-500">
              <span>Módulo necessário:</span>
              <span className="font-bold text-[#CC0000] font-mono">
                {material.ModuloID || material.moduleId}
              </span>
            </div>
          </div>

          <div className="bg-[#1A1412] border border-red-500/20 rounded-xl p-5 shadow-md space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                <Lock size={18} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white uppercase">
                  Este conteúdo não está incluso no seu acesso.
                </p>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Para visualizar este material, você precisa possuir a permissão do módulo{' '}
                  <strong className="text-white">{material.ModuloID || material.moduleId}</strong> liberada em sua conta.
                </p>
              </div>
            </div>

            <button
              id="btn-desbloquear-conteudo"
              type="button"
              onClick={() => onUnlockContent?.(material)}
              className="w-full bg-[#CC0000] hover:bg-red-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 cursor-pointer"
            >
              <ShieldAlert size={15} />
              <span>Desbloquear conteúdo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
