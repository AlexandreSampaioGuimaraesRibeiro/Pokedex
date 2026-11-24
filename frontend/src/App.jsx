import { useState, useEffect, useMemo } from "react";
import SearchBar from "./components/SearchBar";
import TypeFilter from "./components/TypeFilter";
import PokemonList from "./components/PokemonList";
import PokemonDetails from "./components/PokemonDetails";
import TrainersPanel from "./components/TrainersPanel";
import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import { usePokemons } from "./hooks/usePokemons";
import PokemonForm from "./components/PokemonForm";
import { useTrainers } from "./hooks/useTrainers";
import TrainerForm from "./components/TrainerForm";

export default function App() {
  const { pokemons, loading, error, edit, remove } = usePokemons();
  const {
    trainers, loading: trainersLoading, error: trainersError,
    add: addTrainer, edit: editTrainer, remove: removeTrainer,
  } = useTrainers();
  const [editingTrainer, setEditingTrainer] = useState(null); // null | {} (novo) | treinador

  const handleSaveTrainer = async (data) => {
    if (editingTrainer?.id) await editTrainer(editingTrainer.id, data);
    else await addTrainer(data);
    setEditingTrainer(null);
  };

  const handleDeleteTrainer = async (t) => {
    if (!window.confirm(`Excluir o treinador ${t.name}?`)) return;
    await removeTrainer(t.id);
  };
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
  const updated = await edit(editing.id, data);
  if (selected?.id === updated.id) setSelected(updated);
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
          <Toolbar sortBy={sortBy} onSortChange={setSortBy} onRandom={handleRandom} onlyFavorites={onlyFavorites} onToggleOnlyFavorites={() => setOnlyFavorites((v) => !v)} />
          <PokemonList pokemons={sorted} onSelect={setSelected} favorites={favorites} onToggleFavorite={toggleFavorite} />
        </>
      ) : (
          <TrainersPanel
            trainers={trainers} pokemons={pokemons}
            loading={trainersLoading} error={trainersError}
            onSelectPokemon={setSelected}
            onAdd={() => setEditingTrainer({})}
            onEdit={setEditingTrainer}
            onDelete={handleDeleteTrainer}
          />
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
          initial={editing}
          typeOptions={typeOptions}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
      {editingTrainer && (
        <TrainerForm
          initial={editingTrainer.id ? editingTrainer : null}
          pokemons={pokemons}
          onSubmit={handleSaveTrainer}
          onCancel={() => setEditingTrainer(null)}
        />
      )}
    </div>
  );
}
