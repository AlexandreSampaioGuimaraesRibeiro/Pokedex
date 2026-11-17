import { useCallback, useEffect, useState } from "react";
import * as api from "../services/api";

export function usePokemons() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setPokemons(await api.getPokemons());
    } catch {
      setError("Não foi possível carregar os Pokémon. O backend está rodando?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (data) => {
    const created = await api.createPokemon(data);
    setPokemons((prev) => [...prev, created]);
    return created;
  };

  const edit = async (id, data) => {
    const updated = await api.updatePokemon(id, data);
    setPokemons((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const remove = async (id) => {
    await api.deletePokemon(id);
    setPokemons((prev) => prev.filter((p) => p.id !== id));
  };

  return { pokemons, loading, error, reload: load, add, edit, remove };
}
