import { useState } from "react";
import { getPokemonImage } from "../utils/data";
import "../css/Form.css";
import "../css/Trainers.css";

const MAX_TEAM = 6;

// initial = treinador existente (edição) ou null (cadastro)
// pokemons = lista completa vinda da API
export default function TrainerForm({ initial, pokemons, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [badges, setBadges] = useState(initial?.badges ?? 0);
  const [team, setTeam] = useState(initial?.pokemonIds ?? []);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const byId = new Map(pokemons.map((p) => [p.id, p]));
  const term = search.trim().toLowerCase();

  // só mostra resultados depois que o usuário digita (evita listar todos os Pokémon)
  const results = term
    ? pokemons
        .filter((p) => p.name.toLowerCase().includes(term) || String(p.id).includes(term))
        .slice(0, 8)
    : [];

  const addToTeam = (id) => {
    if (team.length < MAX_TEAM) setTeam([...team, id]);
  };
  const removeFromTeam = (index) => setTeam(team.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Informe o nome do treinador.");
    setSaving(true);
    try {
      await onSubmit({ name: name.trim(), badges: Number(badges) || 0, pokemonIds: team });
    } catch (err) {
      setError(err.message || "Erro ao salvar. Verifique se o backend está rodando.");
      setSaving(false);
    }
  };

  return (
    <div className="overlay" onClick={onCancel}>
      <form className="modal form-modal" style={{ "--c": "#3b4cca" }}
            onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <button type="button" className="close" onClick={onCancel} aria-label="Fechar">✕</button>
        <h2>{initial ? `Editar ${initial.name}` : "Novo treinador"}</h2>

        <label className="field">
          <span>Nome</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Ash" />
        </label>

        <label className="field">
          <span>Insígnias</span>
          <input type="number" min="0" value={badges} onChange={(e) => setBadges(e.target.value)} />
        </label>

        <div className="field">
          <span>Time ({team.length}/{MAX_TEAM})</span>
          <div className="team-picked">
            {team.length === 0 && <em className="hint">Nenhum Pokémon escolhido.</em>}
            {team.map((id, i) => (
              <button type="button" key={`${id}-${i}`} className="member"
                      onClick={() => removeFromTeam(i)} title="Clique para remover">
                <img src={getPokemonImage(id)} alt={byId.get(id)?.name ?? `#${id}`} />
                <span>{byId.get(id)?.name ?? `#${id}`} ✕</span>
              </button>
            ))}
          </div>

          <input
            placeholder="Buscar Pokémon por nome ou ID para adicionar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {       // Enter adiciona o primeiro resultado, sem enviar o formulário
                e.preventDefault();
                if (results[0]) addToTeam(results[0].id);
              }
            }}
          />
          {term && results.length === 0 && <p className="hint">Nenhum Pokémon encontrado.</p>}
          {results.length > 0 && (
            <ul className="pick-list">
              {results.map((p) => (
                <li key={p.id}>
                  <button type="button" onClick={() => addToTeam(p.id)} disabled={team.length >= MAX_TEAM}>
                    <img src={getPokemonImage(p.id)} alt={p.name} loading="lazy" />
                    <span>#{p.id} {p.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
