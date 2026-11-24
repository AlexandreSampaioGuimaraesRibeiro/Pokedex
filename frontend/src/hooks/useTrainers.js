import { useCallback, useEffect, useState } from "react";
import * as api from "../services/api";

export function useTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setTrainers(await api.getTrainers());
    } catch {
      setError("Não foi possível carregar os treinadores. O backend está rodando?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (data) => {
    const created = await api.createTrainer(data);
    setTrainers((prev) => [...prev, created]);
    return created;
  };

  const edit = async (id, data) => {
    const updated = await api.updateTrainer(id, data);
    setTrainers((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const remove = async (id) => {
    await api.deleteTrainer(id);
    setTrainers((prev) => prev.filter((t) => t.id !== id));
  };

  return { trainers, loading, error, add, edit, remove };
}
