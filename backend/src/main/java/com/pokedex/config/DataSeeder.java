package com.pokedex.config;

import com.pokedex.model.Pokemon;
import com.pokedex.model.PokemonType;
import com.pokedex.model.Stats;
import com.pokedex.model.Trainer;
import com.pokedex.repository.PokemonRepository;
import com.pokedex.repository.TrainerRepository;
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
 * Popula as coleções "pokemons" e "trainers" a partir do Script_Pokedex.sql
 * (em src/main/resources), adaptando as tabelas relacionais para documentos:
 *  - Pokemon + Rel_Pokemon_Type + Types      -> um documento por Pokémon (stats e types embutidos)
 *  - Trainers + Rel_Trainer_Pokemon          -> um documento por treinador (com a lista pokemonIds)
 * Cada coleção só é importada quando está vazia.
 */
@Configuration
public class DataSeeder {

    private static final String SCRIPT = "/Script_Pokedex.sql";

    @Bean
    CommandLineRunner seed(PokemonRepository pokemonRepository, TrainerRepository trainerRepository) {
        return args -> {
            boolean needPokemons = pokemonRepository.count() == 0;
            boolean needTrainers = trainerRepository.count() == 0;
            if (!needPokemons && !needTrainers) return;

            try (InputStream in = getClass().getResourceAsStream(SCRIPT)) {
                if (in == null) {
                    System.out.println("Script_Pokedex.sql não encontrado em src/main/resources: nada para importar.");
                    return;
                }
                String sql = new String(in.readAllBytes(), StandardCharsets.UTF_8);
                Map<String, List<Map<String, String>>> tables = SqlInsertParser.parse(sql);

                if (needPokemons) {
                    List<Pokemon> pokemons = buildPokemons(tables);
                    pokemonRepository.saveAll(pokemons);
                    System.out.println(pokemons.size() + " Pokémon importados do Script_Pokedex.sql para o MongoDB.");
                }
                if (needTrainers) {
                    List<Trainer> trainers = buildTrainers(tables);
                    trainerRepository.saveAll(trainers);
                    System.out.println(trainers.size() + " treinadores importados do Script_Pokedex.sql para o MongoDB.");
                }
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

        // Pokemon: um documento por linha (sem tipo no script = lista vazia)
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

    static List<Trainer> buildTrainers(Map<String, List<Map<String, String>>> tables) {
        // Rel_Trainer_Pokemon: ID_Trainer -> IDs dos Pokémon (ordem e repetições do script)
        Map<Integer, List<Integer>> teams = new HashMap<>();
        for (Map<String, String> r : tables.getOrDefault("Rel_Trainer_Pokemon", List.of())) {
            teams.computeIfAbsent(num(r, "ID_Trainer"), k -> new ArrayList<>()).add(num(r, "ID_Pokemon"));
        }

        List<Trainer> trainers = new ArrayList<>();
        for (Map<String, String> r : tables.getOrDefault("Trainers", List.of())) {
            int id = num(r, "ID_Trainer");
            trainers.add(new Trainer(id, r.get("Trainer"), num(r, "Badges"), teams.getOrDefault(id, List.of())));
        }
        return trainers;
    }

    private static int num(Map<String, String> row, String column) {
        return Integer.parseInt(row.get(column));
    }
}
