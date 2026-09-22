import { BRAND_NAME } from "./brand";

// Sistema de categorias do programa. Cada nível é definido pela quantidade
// mínima de milhas ACUMULADAS (histórico total, não o saldo atual) — assim
// resgatar milhas não faz o usuário perder o nível, como costuma acontecer
// em programas reais de fidelidade.
//
// Alterar limites, benefícios ou adicionar um novo nível é feito apenas
// neste arquivo.

export const LEVELS = [
  {
    id: "basic",
    name: `${BRAND_NAME} Basic`,
    threshold: 0,
    description: "O ponto de partida de todo mundo que cria uma conta.",
    benefits: ["Acúmulo padrão de milhas", "Acesso ao histórico completo", "Ofertas por e-mail"],
  },
  {
    id: "silver",
    name: `${BRAND_NAME} Silver`,
    threshold: 10000,
    description: "Para quem já viaja com alguma frequência.",
    benefits: ["5% a mais de milhas em compras parceiras", "Prioridade no check-in online", "1 franquia extra de bagagem"],
  },
  {
    id: "gold",
    name: `${BRAND_NAME} Gold`,
    threshold: 40000,
    description: "Reconhecimento para quem viaja regularmente.",
    benefits: ["10% a mais de milhas em todas as compras", "Acesso a salas VIP selecionadas", "Upgrade sujeito à disponibilidade"],
  },
  {
    id: "platinum",
    name: `${BRAND_NAME} Platinum`,
    threshold: 100000,
    description: "O nível mais alto do programa, para quem vive viajando.",
    benefits: ["15% a mais de milhas em todas as compras", "Acesso ilimitado a salas VIP parceiras", "Atendimento prioritário dedicado"],
  },
];

export function getLevelForMiles(accumulatedMiles) {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (accumulatedMiles >= level.threshold) {
      current = level;
    }
  }
  return current;
}

export function getNextLevel(levelId) {
  const index = LEVELS.findIndex((l) => l.id === levelId);
  if (index === -1 || index === LEVELS.length - 1) return null;
  return LEVELS[index + 1];
}

/**
 * Retorna o progresso (0 a 1) do usuário dentro do nível atual em direção
 * ao próximo, junto com a quantidade de milhas que faltam.
 */
export function getLevelProgress(accumulatedMiles) {
  const current = getLevelForMiles(accumulatedMiles);
  const next = getNextLevel(current.id);

  if (!next) {
    return { current, next: null, progress: 1, remaining: 0 };
  }

  const span = next.threshold - current.threshold;
  const gained = accumulatedMiles - current.threshold;
  const progress = Math.min(1, Math.max(0, gained / span));
  const remaining = Math.max(0, next.threshold - accumulatedMiles);

  return { current, next, progress, remaining };
}
