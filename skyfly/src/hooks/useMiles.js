import { useState } from "react";
import { accumulateMiles, redeemMiles } from "../firebase/database";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";

/**
 * Centraliza as duas operações que alteram o saldo de milhas do usuário.
 * Depois de cada operação bem-sucedida, chama `refreshProfile` para que o
 * dashboard e a navbar reflitam o novo saldo imediatamente.
 */
export function useMiles() {
  const { user, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);

  async function accumulate({ amount, description }) {
    if (!user) return;
    setPending(true);
    try {
      await accumulateMiles(user.uid, { amount, description });
      await refreshProfile();
      showToast(`+${amount.toLocaleString("pt-BR")} milhas creditadas`, { type: "success" });
      return true;
    } catch (error) {
      showToast(error.message || "Não foi possível acumular milhas agora.", { type: "error" });
      return false;
    } finally {
      setPending(false);
    }
  }

  async function redeem({ amount, description }) {
    if (!user) return false;
    setPending(true);
    try {
      await redeemMiles(user.uid, { amount, description });
      await refreshProfile();
      showToast("Benefício resgatado com sucesso", { type: "success" });
      return true;
    } catch (error) {
      const message =
        error.code === "insufficient-balance"
          ? "Saldo insuficiente para este resgate."
          : error.message || "Não foi possível concluir o resgate.";
      showToast(message, { type: "error" });
      return false;
    } finally {
      setPending(false);
    }
  }

  return { accumulate, redeem, pending };
}
