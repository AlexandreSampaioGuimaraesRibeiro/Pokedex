package com.pokedex.controller;

import com.pokedex.model.Trainer;
import com.pokedex.service.TrainerService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trainers")
public class TrainerController {

    private final TrainerService service;

    public TrainerController(TrainerService service) {
        this.service = service;
    }

    @GetMapping
    public List<Trainer> list() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Trainer get(@PathVariable int id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Trainer create(@RequestBody Trainer trainer) {
        return service.create(trainer);
    }

    @PutMapping("/{id}")
    public Trainer update(@PathVariable int id, @RequestBody Trainer trainer) {
        return service.update(id, trainer);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable int id) {
        service.delete(id);
    }
}
