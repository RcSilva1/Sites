// Camada de autenticação — envolve o Firebase Authentication com funções
// simples que o resto da aplicação consome (context, páginas de login).
//
// Nenhuma senha, token ou credencial é armazenada manualmente: o SDK do
// Firebase cuida da sessão (via IndexedDB do navegador) e do refresh do
// token automaticamente.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./config";
import { createUserProfile } from "./database";

/**
 * Cria uma conta nova no Firebase Authentication e, em seguida, cria o
 * documento de perfil correspondente no Realtime Database (saldo inicial,
 * nível, data de cadastro etc). As duas escritas não são atômicas — se a
 * segunda falhar, o app trata isso como um erro de cadastro (ver Register.jsx)
 * e orienta o usuário a tentar novamente. Numa versão de produção, esse
 * tipo de operação em duas etapas seria idealmente movido para uma Cloud
 * Function acionada por `onCreate` do Authentication, para garantir
 * atomicidade — ver nota em README.md, seção "Limitações conhecidas".
 */
export async function registerUser({ name, email, password }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  await createUserProfile(credential.user.uid, { name, email });
  return credential.user;
}

export async function loginUser({ email, password }) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export function logoutUser() {
  return signOut(auth);
}

export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

/**
 * Assina mudanças de estado de autenticação. Usado pelo AuthContext para
 * saber, a qualquer momento, se há um usuário logado.
 */
export function subscribeToAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Traduz os códigos de erro do Firebase Auth para mensagens em português,
 * legíveis para quem está preenchendo o formulário.
 */
export function translateAuthError(error) {
  const code = error?.code || "";
  const map = {
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/invalid-email": "Digite um e-mail válido.",
    "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
    "auth/user-not-found": "Não encontramos uma conta com este e-mail.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde um momento e tente novamente.",
    "auth/network-request-failed": "Falha de conexão. Verifique sua internet.",
  };
  return map[code] || "Não foi possível concluir a operação. Tente novamente.";
}
