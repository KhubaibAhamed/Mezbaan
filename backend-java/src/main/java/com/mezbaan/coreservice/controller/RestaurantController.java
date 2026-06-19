package com.mezbaan.coreservice.controller;

import com.mezbaan.coreservice.entity.Restaurant;
import com.mezbaan.coreservice.entity.RestaurantTable;
import com.mezbaan.coreservice.repository.RestaurantRepository;
import com.mezbaan.coreservice.repository.RestaurantTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class RestaurantController {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private RestaurantTableRepository tableRepository;

    // Fetch all restaurants
    @GetMapping
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantRepository.findAll());
    }

    // Fetch tables for a specific restaurant
    @GetMapping("/{restaurantId}/tables")
    public ResponseEntity<List<RestaurantTable>> getTablesByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(tableRepository.findByRestaurantId(restaurantId));
    }
}
