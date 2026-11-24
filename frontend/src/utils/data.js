// Pokémon e treinadores agora vêm da API (Spring Boot + MongoDB).
// Aqui sobrou só o endereço das imagens (PokéAPI), montado a partir do ID.
export const getPokemonImage = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
