import { getPokemonImage } from "../utils/data";
import "../css/Form.css";
import "../css/Trainers.css";

// agrupa repetidos: [48,48,48,49] -> [{id:48,count:3},{id:49,count:1}]
const group = (ids) => {
  const map = new Map();
  ids.forEach((id) => map.set(id, (map.get(id) ?? 0) + 1));
  return [...map].map(([id, count]) => ({ id, count }));
};

export default function TrainersPanel({
  trainers, pokemons, loading, error,
  onSelectPokemon, onAdd, onEdit, onDelete,
}) {
  if (loading) return <p className="empty">Carregando treinadores...</p>;
  if (error) return <p className="empty">{error}</p>;

  const byId = new Map(pokemons.map((p) => [p.id, p]));

  return (
    <>
      <div className="panel-actions">
        <button className="btn-new" onClick={onAdd}>➕ Novo treinador</button>
      </div>

      {trainers.length === 0 && <p className="empty">Nenhum treinador cadastrado.</p>}

      <section className="trainers">
        {trainers.map((t) => (
          <div className="trainer" key={t.id}>
            <h3>🧑‍🚀 {t.name} <small>🏅 {t.badges}</small></h3>
            <div className="team">
              {group(t.pokemonIds ?? []).map(({ id, count }) => {
                const p = byId.get(id);
                if (!p) return null;
                return (
                  <button key={id} className="member" onClick={() => onSelectPokemon(p)} title={p.name}>
                    <img src={getPokemonImage(id)} alt={p.name} loading="lazy" />
                    <span>{p.name}{count > 1 ? ` x${count}` : ""}</span>
                  </button>
                );
              })}
            </div>
            <div className="trainer-actions">
              <button className="btn-edit" onClick={() => onEdit(t)}>✏️ Editar</button>
              <button className="btn-delete" onClick={() => onDelete(t)}>🗑️ Excluir</button>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
