import { createContext, useCallback, useEffect, useState } from "react";
import { subscribeToAuthState } from "../firebase/auth";
import { getUserProfile } from "../firebase/database";

export const AuthContext = createContext(null);

/**
 * Mantém dois estados sincronizados:
 *  - `user`: o objeto do Firebase Authentication (uid, email, displayName)
 *  - `profile`: o documento correspondente em `users/{uid}` no Realtime
 *    Database (saldo de milhas, nível, histórico agregado)
 *
 * `loading` fica true enquanto o Firebase ainda não respondeu se existe
 * uma sessão ativa — isso evita um "flash" de tela de login antes do
 * redirecionamento automático de quem já está autenticado.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async (uid) => {
    if (!uid) {
      setProfile(null);
      return;
    }
    const data = await getUserProfile(uid);
    setProfile(data);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await refreshProfile(firebaseUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [refreshProfile]);

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: Boolean(user),
    refreshProfile: () => refreshProfile(user?.uid),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
