package com.pokedex.service;

import com.pokedex.model.Trainer;
import com.pokedex.repository.PokemonRepository;
import com.pokedex.repository.TrainerRepository;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class TrainerService {

    private static final int MAX_TEAM = 6;

    private final TrainerRepository trainers;
    private final PokemonRepository pokemons;

    public TrainerService(TrainerRepository trainers, PokemonRepository pokemons) {
        this.trainers = trainers;
        this.pokemons = pokemons;
    }

    public List<Trainer> findAll() {
        return trainers.findAll(Sort.by("id"));
    }

    public Trainer findById(int id) {
        return trainers.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Treinador não encontrado: " + id));
    }

    public Trainer create(Trainer t) {
        validate(t);
        int nextId = trainers.findTopByOrderByIdDesc().map(Trainer::id).orElse(0) + 1;
        return trainers.save(new Trainer(nextId, t.name().trim(), t.badges(), team(t)));
    }

    public Trainer update(int id, Trainer t) {
        findById(id); // lança 404 se não existir
        validate(t);
        return trainers.save(new Trainer(id, t.name().trim(), t.badges(), team(t)));
    }

    public void delete(int id) {
        findById(id);
        trainers.deleteById(id);
    }

    private List<Integer> team(Trainer t) {
        return t.pokemonIds() == null ? List.of() : t.pokemonIds();
    }

    private void validate(Trainer t) {
        if (t.name() == null || t.name().isBlank()) {
            throw bad("O nome do treinador é obrigatório.");
        }
        if (t.badges() < 0) {
            throw bad("O número de insígnias não pode ser negativo.");
        }
        List<Integer> team = team(t);
        if (team.size() > MAX_TEAM) {
            throw bad("Um treinador pode ter no máximo " + MAX_TEAM + " Pokémon.");
        }
        Set<Integer> distinct = new HashSet<>(team);
        if (pokemons.findAllById(distinct).size() != distinct.size()) {
            throw bad("O time contém Pokémon que não existem.");
        }
    }

    private ResponseStatusException bad(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
