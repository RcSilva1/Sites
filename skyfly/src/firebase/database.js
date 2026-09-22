// Camada de dados — todo acesso ao Realtime Database passa por aqui.
//
// Estrutura de dados utilizada:
//
//   users/{uid}
//     ├── name
//     ├── email
//     ├── milesBalance      (number)
//     ├── milesAccumulated  (number, total histórico acumulado)
//     ├── milesRedeemed     (number, total histórico resgatado)
//     ├── level             (string: basic | silver | gold | platinum)
//     └── createdAt         (timestamp)
//
//   transactions/{uid}/{transactionId}
//     ├── type          ("accumulate" | "redeem")
//     ├── amount        (number, sempre positivo — o sinal é dado por `type`)
//     ├── description
//     └── date          (timestamp)
//
// As transações ficam separadas de `users` para que a lista de histórico
// possa crescer sem precisar carregar o documento inteiro do usuário, e
// para que as Security Rules possam tratar leitura/escrita de saldo e de
// histórico com regras diferentes (ver database.rules.json).

import { ref, set, get, update, push, runTransaction, query, orderByChild } from "firebase/database";
import { db } from "./config";
import { getLevelForMiles } from "../data/levels";

const INITIAL_BONUS = 5000;

export function createUserProfile(uid, { name, email }) {
  const profile = {
    name,
    email,
    milesBalance: INITIAL_BONUS,
    milesAccumulated: INITIAL_BONUS,
    milesRedeemed: 0,
    level: getLevelForMiles(INITIAL_BONUS).id,
    createdAt: Date.now(),
  };

  const writes = {
    [`users/${uid}`]: profile,
    [`transactions/${uid}/${push(ref(db, `transactions/${uid}`)).key}`]: {
      type: "accumulate",
      amount: INITIAL_BONUS,
      description: "Bônus de cadastro",
      date: Date.now(),
    },
  };

  return update(ref(db), writes);
}

export async function getUserProfile(uid) {
  const snapshot = await get(ref(db, `users/${uid}`));
  return snapshot.exists() ? snapshot.val() : null;
}

export function updateUserProfileFields(uid, fields) {
  // Apenas campos "seguros para edição" devem chegar aqui — a página de
  // Perfil já filtra isso, mas a regra de segurança do Firebase (ver
  // database.rules.json) é a verdadeira barreira: ela impede a escrita de
  // milesBalance, level e demais campos sensíveis por este caminho.
  return update(ref(db, `users/${uid}`), fields);
}

/**
 * Registra um evento de acúmulo de milhas (ex.: simulador, compra) e
 * incrementa o saldo do usuário de forma atômica usando runTransaction,
 * para evitar condição de corrida caso duas operações aconteçam ao mesmo
 * tempo (ex.: duas abas abertas).
 */
export async function accumulateMiles(uid, { amount, description }) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Quantidade de milhas inválida.");
  }

  const balanceRef = ref(db, `users/${uid}/milesBalance`);
  const accumulatedRef = ref(db, `users/${uid}/milesAccumulated`);

  await runTransaction(balanceRef, (current) => (current || 0) + amount);
  await runTransaction(accumulatedRef, (current) => (current || 0) + amount);
  await syncLevel(uid);
  await logTransaction(uid, { type: "accumulate", amount, description });
}

/**
 * Registra um resgate de benefício. A verificação de saldo suficiente é
 * feita dentro do runTransaction (não apenas no frontend antes de chamar
 * esta função), porque um valor checado no cliente pode estar desatualizado
 * ou ser manipulado. Em produção, essa validação também deveria ser
 * espelhada nas Security Rules (ver database.rules.json) ou movida para uma
 * Cloud Function, já que o cliente ainda pode, em teoria, escrever
 * diretamente no banco contornando este arquivo.
 */
export async function redeemMiles(uid, { amount, description }) {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Quantidade de milhas inválida.");
  }

  const balanceRef = ref(db, `users/${uid}/milesBalance`);

  const result = await runTransaction(balanceRef, (current) => {
    const balance = current || 0;
    if (balance < amount) {
      // Retornar undefined cancela a transação sem alterar o valor.
      return undefined;
    }
    return balance - amount;
  });

  if (!result.committed) {
    const error = new Error("Saldo de milhas insuficiente para este resgate.");
    error.code = "insufficient-balance";
    throw error;
  }

  await runTransaction(ref(db, `users/${uid}/milesRedeemed`), (current) => (current || 0) + amount);
  await logTransaction(uid, { type: "redeem", amount, description });
}

function logTransaction(uid, { type, amount, description }) {
  const txRef = push(ref(db, `transactions/${uid}`));
  return set(txRef, {
    type,
    amount,
    description,
    date: Date.now(),
  });
}

async function syncLevel(uid) {
  const snapshot = await get(ref(db, `users/${uid}/milesAccumulated`));
  const accumulated = snapshot.exists() ? snapshot.val() : 0;
  const level = getLevelForMiles(accumulated).id;
  await update(ref(db, `users/${uid}`), { level });
}

export async function getTransactions(uid) {
  const q = query(ref(db, `transactions/${uid}`), orderByChild("date"));
  const snapshot = await get(q);
  if (!snapshot.exists()) return [];

  const list = [];
  snapshot.forEach((child) => {
    list.push({ id: child.key, ...child.val() });
  });
  return list.reverse(); // mais recente primeiro
}
