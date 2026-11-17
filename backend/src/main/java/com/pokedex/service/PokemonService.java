package com.pokedex.service;

import com.pokedex.model.Pokemon;
import com.pokedex.repository.PokemonRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PokemonService {

    private final PokemonRepository repository;

    public PokemonService(PokemonRepository repository) {
        this.repository = repository;
    }

    public List<Pokemon> findAll() {
        return repository.findAll(Sort.by("id"));
    }

    public Pokemon findById(int id) {
        return repository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Pokémon não encontrado: " + id));
    }

    public Pokemon create(Pokemon p) {
        int nextId = repository.findTopByOrderByIdDesc().map(Pokemon::id).orElse(0) + 1;
        return repository.save(new Pokemon(nextId, p.name(), p.stats(), p.types()));
    }

    public Pokemon update(int id, Pokemon p) {
        findById(id); // lança 404 se não existir
        return repository.save(new Pokemon(id, p.name(), p.stats(), p.types()));
    }

    public void delete(int id) {
        findById(id);
        repository.deleteById(id);
    }
}
