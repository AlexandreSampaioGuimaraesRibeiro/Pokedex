package com.pokedex.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

// Mesmo formato do pokedex-data.json: o React quase não muda.
@Document("pokemons")
public record Pokemon(@Id Integer id, String name, Stats stats, List<PokemonType> types) {}
