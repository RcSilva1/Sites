// Configuração central do Firebase.
//
// Este é o ÚNICO lugar do projeto onde o firebaseConfig é declarado.
// Todos os outros arquivos (auth.js, database.js, hooks, páginas) importam
// `app`, `auth` e `db` a partir daqui — nunca colamos a config em outro lugar.
//
// Os valores vêm de variáveis de ambiente (.env), não estão hardcoded no
// código-fonte. Veja `.env.example` na raiz do projeto para o formato
// esperado e o README para instruções de configuração no Firebase Console.
//
// IMPORTANTE sobre segurança:
// A `apiKey` do Firebase Web NÃO é um segredo — ela identifica o projeto,
// não autoriza acesso por si só. Quem protege os dados são as Security
// Rules do Realtime Database (veja `database.rules.json` na raiz) e as
// regras do Firebase Authentication. Por isso este arquivo pode ir para o
// frontend com segurança, mas nenhuma credencial administrativa (Admin SDK,
// service account) deve JAMAIS ser colocada aqui ou em qualquer arquivo
// que rode no navegador.

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Evita inicializar o app duas vezes durante hot-reload no desenvolvimento.
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
