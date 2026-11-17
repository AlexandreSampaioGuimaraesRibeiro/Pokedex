import { useState, useEffect, useMemo } from "react";
import { pokemons, trainers, pokemonTypes } from "./utils/data";
import SearchBar from "./components/SearchBar";
import TypeFilter from "./components/TypeFilter";
import PokemonList from "./components/PokemonList";
import PokemonDetails from "./components/PokemonDetails";
import TrainersPanel from "./components/TrainersPanel";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import { usePokemons } from "./hooks/usePokemons";
import PokemonForm from "./components/PokemonForm";

export default function App() {
  const { pokemons, loading, error, add, edit, remove } = usePokemons();
  const [editing, setEditing] = useState(null); // null | {} (novo) | pokemon (edição)

  const typeOptions = useMemo(() => {
    const map = new Map();
    pokemons.forEach((p) => p.types.forEach((t) => map.set(t.id, t)));
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [pokemons]);
  const pokemonTypes = typeOptions.map((t) => t.name);

  const [view, setView] = useState("pokedex");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState("id");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites")) ?? [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // estado derivado, sem useEffect
  const filtered = pokemons.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      String(p.id).includes(search);
    const matchesType = !selectedType || p.types.some((t) => t.name === selectedType);
    const matchesFavorite = !onlyFavorites || favorites.includes(p.id);
    return matchesSearch && matchesType && matchesFavorite;
  });

  const sorted = [...filtered].sort((a, b) => {
  if (sortBy === "id") return a.id - b.id;
  if (sortBy === "name") return a.name.localeCompare(b.name);
  return b.stats[sortBy] - a.stats[sortBy];
});

const handleRandom = () => {
  if (!pokemons.length) return;
  setSelected(pokemons[Math.floor(Math.random() * pokemons.length)]);
};

const handleSave = async (data) => {
  if (editing?.id) {
    const updated = await edit(editing.id, data);
    if (selected?.id === updated.id) setSelected(updated);
  } else {
    await add(data);
  }
  setEditing(null);
};

const handleDelete = async (p) => {
  if (!window.confirm(`Excluir ${p.name}?`)) return;
  await remove(p.id);
  setFavorites((prev) => prev.filter((f) => f !== p.id));
  setSelected(null);
};

if (loading) return <p className="empty">Carregando...</p>;
if (error) return <p className="empty">{error}</p>;

  return (
    <div className="app">
      <Header view={view} onChangeView={setView} />
      {view === "pokedex" ? (
        <>
          <SearchBar value={search} onChange={setSearch} />
          <TypeFilter types={pokemonTypes} selected={selectedType} onChange={setSelectedType} />
          <button className="btn-new" onClick={() => setEditing({})}>➕ Novo Pokémon</button>
          <Toolbar sortBy={sortBy} onSortChange={setSortBy} onRandom={handleRandom} onlyFavorites={onlyFavorites} onToggleOnlyFavorites={() => setOnlyFavorites((v) => !v)} />
          <PokemonList pokemons={sorted} onSelect={setSelected} favorites={favorites} onToggleFavorite={toggleFavorite} />
        </>
      ) : (
        <TrainersPanel trainers={trainers} pokemons={pokemons} onSelectPokemon={setSelected} />
      )}

      {selected && (
        <PokemonDetails
          pokemon={selected}
          onClose={() => setSelected(null)}
          onEdit={(p) => { setSelected(null); setEditing(p); }}
          onDelete={handleDelete}
        />
      )}
      {editing && (
        <PokemonForm
          initial={editing.id ? editing : null}
          typeOptions={typeOptions}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}
