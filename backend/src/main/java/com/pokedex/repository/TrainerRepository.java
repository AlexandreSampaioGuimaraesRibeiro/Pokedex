package com.pokedex.repository;

import com.pokedex.model.Trainer;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TrainerRepository extends MongoRepository<Trainer, Integer> {
    Optional<Trainer> findTopByOrderByIdDesc();
}
