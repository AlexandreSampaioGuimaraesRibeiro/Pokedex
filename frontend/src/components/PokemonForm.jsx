import { useState } from "react";
import "../css/Form.css";

const STAT_FIELDS = [
  ["hp", "HP"], ["attack", "Attack"], ["defense", "Defense"],
  ["specialAttack", "Special Attack"], ["specialDefense", "Special Defense"], ["speed", "Speed"],
];

const DEFAULT_STATS = { hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 50 };

// initial = Pokémon existente (edição) ou null (cadastro)
// typeOptions = [{ id, name }]
export default function PokemonForm({ initial, typeOptions, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [stats, setStats] = useState(initial?.stats ?? DEFAULT_STATS);
  const [types, setTypes] = useState(initial?.types ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleType = (t) =>
    setTypes((prev) =>
      prev.some((x) => x.id === t.id)
        ? prev.filter((x) => x.id !== t.id)
        : prev.length < 2 ? [...prev, t] : prev
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Informe o nome do Pokémon.");
    setSaving(true);
    try {
      await onSubmit({ name: name.trim(), stats, types });
    } catch {
      setError("Erro ao salvar. Verifique se o backend está rodando.");
      setSaving(false);
    }
  };

  return (
    <div className="overlay" onClick={onCancel}>
      <form className="modal form-modal" style={{ "--c": "#ffcb05" }}
            onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <button type="button" className="close" onClick={onCancel} aria-label="Fechar">✕</button>
        <h2>{initial ? `Editar #${initial.id}` : "Novo Pokémon"}</h2>

        <label className="field">
          <span>Nome</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Pikachu" />
        </label>

        <div className="field">
          <span>Tipos (até 2)</span>
          <div className="type-filter">
            {typeOptions.map((t) => (
              <button type="button" key={t.id}
                      className={types.some((x) => x.id === t.id) ? "chip active" : "chip"}
                      onClick={() => toggleType(t)}>
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="stat-inputs">
          {STAT_FIELDS.map(([key, label]) => (
            <label className="field" key={key}>
              <span>{label}</span>
              <input type="number" min="0" max="255" value={stats[key]}
                     onChange={(e) => setStats({ ...stats, [key]: Number(e.target.value) })} />
            </label>
          ))}
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
