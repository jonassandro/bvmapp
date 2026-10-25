import React from 'react';
import { ExternalLink, Flame } from 'lucide-react';
import { Material } from '../types';

export function ShapePurchaseOffer({ material }: { material: Material }) {
  return (
    <section id="shape90-purchase-offer" className="rounded-2xl border border-[#4A261F] bg-gradient-to-br from-[#241310] to-[#120907] p-5 space-y-4 shadow-xl">
      <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#FF4444]">
        <Flame size={14} /> Projeto opcional · Compra à parte
      </span>
      <div className="space-y-2">
        <h2 className="text-lg font-black uppercase tracking-tight text-white">{material.Titulo || material.title}</h2>
        <p className="text-xs leading-relaxed text-zinc-300">{material.promoDescription || material.descricaoCurta || material.subtitle}</p>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-xs text-zinc-500 line-through">R$ {material.originalPrice}</span>
        <span className="text-2xl font-black text-emerald-400">R$ {material.discountPrice}</span>
      </div>
      <p className="text-xs text-zinc-400">Pagamento único. Projeto vendido separadamente dos materiais da biblioteca.</p>
      <a
        id="btn-comprar-shape90"
        href={material.acquireUrl || material.URL || material.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-400 transition-colors"
      >
        <ExternalLink size={15} /> Comprar Primeiro Shape
      </a>
    </section>
  );
}
