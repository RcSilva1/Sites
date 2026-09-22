import { useCallback, useEffect, useState } from "react";
import { getTransactions } from "../firebase/database";
import { useAuth } from "./useAuth";

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const list = await getTransactions(user.uid);
      setTransactions(list);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  return { transactions, loading, error, reload: load };
}
