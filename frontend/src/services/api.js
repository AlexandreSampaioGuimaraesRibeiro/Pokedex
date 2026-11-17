const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

async function request(path, options) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Erro ${res.status} ao acessar ${path}`);
  return res.status === 204 ? null : res.json();
}

export const getPokemons = () => request("/pokemons");
export const getPokemon = (id) => request(`/pokemons/${id}`);
export const createPokemon = (pokemon) =>
  request("/pokemons", { method: "POST", body: JSON.stringify(pokemon) });
export const updatePokemon = (id, pokemon) =>
  request(`/pokemons/${id}`, { method: "PUT", body: JSON.stringify(pokemon) });
export const deletePokemon = (id) => request(`/pokemons/${id}`, { method: "DELETE" });
