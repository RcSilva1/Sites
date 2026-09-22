// Catálogo de benefícios disponíveis para resgate. Valores fictícios,
// usados apenas para a demonstração escolar do projeto Skyfly.
//
// category é usada para o filtro visual na página de Resgate.

export const BENEFITS = [
  {
    id: "passagem-nacional",
    name: "Passagem aérea nacional",
    category: "passagens",
    cost: 25000,
    description:
      "Uma passagem de ida e volta para destinos nacionais selecionados, sujeita a disponibilidade de assentos em milhas.",
  },
  {
    id: "passagem-internacional",
    name: "Passagem aérea internacional",
    category: "passagens",
    cost: 60000,
    description: "Passagem de ida e volta para destinos internacionais parceiros do programa.",
  },
  {
    id: "upgrade-classe",
    name: "Upgrade de classe econômica para executiva",
    category: "upgrades",
    cost: 18000,
    description: "Transforme uma passagem já emitida em uma experiência de classe executiva, sujeito a disponibilidade.",
  },
  {
    id: "hotel-diaria",
    name: "Diária de hotel parceiro",
    category: "hospedagem",
    cost: 15000,
    description: "Uma diária em hotéis parceiros do programa, em categoria standard.",
  },
  {
    id: "aluguel-carro",
    name: "Diária de aluguel de carro",
    category: "hospedagem",
    cost: 9000,
    description: "Um dia de locação de veículo econômico em locadoras parceiras.",
  },
  {
    id: "fone-viagem",
    name: "Fone de ouvido para viagem",
    category: "produtos",
    cost: 8500,
    description: "Fone com cancelamento de ruído, ideal para voos longos.",
  },
  {
    id: "mala-cabine",
    name: "Mala de cabine Skyfly",
    category: "produtos",
    cost: 11000,
    description: "Mala rígida de cabine com a identidade visual do programa.",
  },
  {
    id: "experiencia-sala-vip",
    name: "Acesso avulso à sala VIP",
    category: "experiencias",
    cost: 12000,
    description: "Um acesso avulso a salas VIP parceiras em aeroportos selecionados.",
  },
  {
    id: "experiencia-tour",
    name: "City tour guiado",
    category: "experiencias",
    cost: 14000,
    description: "Um passeio guiado de meio período em destinos parceiros selecionados.",
  },
];

export const BENEFIT_CATEGORIES = [
  { id: "todos", label: "Todos" },
  { id: "passagens", label: "Passagens" },
  { id: "upgrades", label: "Upgrades" },
  { id: "hospedagem", label: "Hospedagem" },
  { id: "produtos", label: "Produtos" },
  { id: "experiencias", label: "Experiências" },
];
