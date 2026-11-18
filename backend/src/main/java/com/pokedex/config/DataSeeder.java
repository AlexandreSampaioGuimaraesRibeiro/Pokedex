package com.pokedex.config;

import com.pokedex.model.Pokemon;
import com.pokedex.model.PokemonType;
import com.pokedex.model.Stats;
import com.pokedex.repository.PokemonRepository;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Popula a coleção "pokemons" a partir do Script_Pokedex.sql (em src/main/resources),
 * adaptando as tabelas relacionais para documentos do MongoDB:
 * Pokemon + Rel_Pokemon_Type + Types  ->  um documento por Pokémon, com stats e types embutidos.
 * Só roda quando a coleção está vazia.
 */
@Configuration
public class DataSeeder {

    private static final String SCRIPT = "/Script_Pokedex.sql";

    @Bean
    CommandLineRunner seed(PokemonRepository repository) {
        return args -> {
            if (repository.count() > 0) return;

            try (InputStream in = getClass().getResourceAsStream(SCRIPT)) {
                if (in == null) {
                    System.out.println("Script_Pokedex.sql não encontrado em src/main/resources: nada para importar.");
                    return;
                }
                String sql = new String(in.readAllBytes(), StandardCharsets.UTF_8);
                List<Pokemon> pokemons = buildPokemons(SqlInsertParser.parse(sql));
                repository.saveAll(pokemons);
                System.out.println(pokemons.size() + " Pokémon importados do Script_Pokedex.sql para o MongoDB.");
            }
        };
    }

    static List<Pokemon> buildPokemons(Map<String, List<Map<String, String>>> tables) {
        // Types: ID_Type -> nome
        Map<Integer, String> typeNames = new HashMap<>();
        for (Map<String, String> r : tables.getOrDefault("Types", List.of())) {
            typeNames.put(num(r, "ID_Type"), r.get("Type"));
        }

        // Rel_Pokemon_Type: ID_Pokemon -> lista de tipos (na ordem do script)
        Map<Integer, List<PokemonType>> typesByPokemon = new HashMap<>();
        for (Map<String, String> r : tables.getOrDefault("Rel_Pokemon_Type", List.of())) {
            int typeId = num(r, "ID_Type");
            typesByPokemon
                .computeIfAbsent(num(r, "ID_Pokemon"), k -> new ArrayList<>())
                .add(new PokemonType(typeId, typeNames.get(typeId)));
        }

        // Pokemon: um documento por linha (Pokémon sem tipo, como o Mew, ficam com lista vazia)
        List<Pokemon> pokemons = new ArrayList<>();
        for (Map<String, String> r : tables.getOrDefault("Pokemon", List.of())) {
            int id = num(r, "ID_Pokemon");
            Stats stats = new Stats(
                num(r, "HP"), num(r, "Attack"), num(r, "Defense"),
                num(r, "Special_Attack"), num(r, "Special_Defense"), num(r, "Speed"));
            pokemons.add(new Pokemon(id, r.get("Pokemon"), stats, typesByPokemon.getOrDefault(id, List.of())));
        }
        return pokemons;
    }

    private static int num(Map<String, String> row, String column) {
        return Integer.parseInt(row.get(column));
    }
}
