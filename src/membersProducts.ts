export interface MemberProduct {
  id: string;
  title: string;
  description: string;
  url: string;
  /** Coloque aqui o caminho ou URL da imagem de logo do produto (ex: "/assets/logo-cozinha.png") */
  logoUrl: string;
  badge?: string;
}

export const MEMBERS_AREA_PRODUCTS: MemberProduct[] = [
  {
    id: "cozinha-do-shape",
    title: "Cozinha do Shape - OFERTA 40% OFF",
    description:
      "Receitas anabólicas, práticas e saborosas para secar e definir sem passar fome, com 40% de desconto exclusivo.",
    url: "https://primeiroshapeacesso.ai.studio",
    logoUrl: "",
    badge: "Oferta 40% OFF",
  },
  {
    id: "projeto-primeiro-shape",
    title: "Projeto Primeiro Shape",
    description:
      "O plano estratégico passo a passo para conquistar seu primeiro shape estético e definido no menor tempo possível.",
    url: "https://pay.wiapy.com/_akvGPnUP-4e",
    logoUrl: "",
  },
  {
    id: "segredo-da-insulina",
    title: "O Segredo da Insulina",
    description:
      "Domine o controle da insulina para destravar a queima de gordura corporal e melhorar a absorção de nutrientes.",
    url: "https://pay.wiapy.com/9TzbfEBoELNz",
    logoUrl: "",
  },
  {
    id: "protocolo-acelera-7-dias",
    title: "Protocolo Acelera 7 dias",
    description:
      "Protocolo prático de 7 dias para desinchar rápido, reativar o metabolismo e gerar resultados visíveis já na primeira semana.",
    url: "https://pay.wiapy.com/ZVx-WFYoSTSi",
    logoUrl: "",
  },
  {
    id: "1000-receitas-low-carb",
    title: "1000 Receitas Low Carb",
    description:
      "Acervo completo com 1.000 opções de refeições low carb rápidas e acessíveis para variar o cardápio sem sair da meta.",
    url: "https://pay.wiapy.com/3WXe74-LNBGs",
    logoUrl: "",
  },
  {
    id: "40-exercicios-pilates-em-casa",
    title: "40 Exercícios de Pilates em casa",
    description:
      "Rotina guiada com 40 exercícios de Pilates para fortalecer o abdômen, corrigir a postura e ganhar mobilidade treinando em casa.",
    url: "https://pay.wiapy.com/xLHs3h7hk8V4",
    logoUrl: "",
  },
];
