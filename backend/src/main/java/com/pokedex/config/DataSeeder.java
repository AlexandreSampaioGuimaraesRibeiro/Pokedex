package com.pokedex.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pokedex.model.Pokemon;
import com.pokedex.repository.PokemonRepository;
import java.io.InputStream;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seed(PokemonRepository repository, ObjectMapper mapper) {
        return args -> {
            if (repository.count() > 0) return;
            try (InputStream in = getClass().getResourceAsStream("/pokedex-data.json")) {
                if (in == null) {
                    System.out.println("pokedex-data.json não encontrado em resources: nada para importar.");
                    return;
                }
                JsonNode list = mapper.readTree(in).get("pokemon");
                List<Pokemon> pokemons = List.of(mapper.treeToValue(list, Pokemon[].class));
                repository.saveAll(pokemons);
                System.out.println(pokemons.size() + " Pokémon importados para o MongoDB.");
            }
        };
    }
}
