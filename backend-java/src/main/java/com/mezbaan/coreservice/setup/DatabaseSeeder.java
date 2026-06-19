package com.mezbaan.coreservice.setup;

import com.mezbaan.coreservice.entity.User;
import com.mezbaan.coreservice.entity.Restaurant;
import com.mezbaan.coreservice.entity.RestaurantTable;
import com.mezbaan.coreservice.repository.UserRepository;
import com.mezbaan.coreservice.repository.RestaurantRepository;
import com.mezbaan.coreservice.repository.RestaurantTableRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final RestaurantTableRepository tableRepository;

    public DatabaseSeeder(UserRepository userRepository, RestaurantRepository restaurantRepository, RestaurantTableRepository tableRepository) {
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.tableRepository = tableRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Super Admin
        if (userRepository.findByEmail("superadmin@mezbaan.com").isEmpty()) {
            User admin = new User("superadmin@mezbaan.com", "admin123", "ADMIN");
            userRepository.save(admin);
            System.out.println("Super Admin seeded successfully!");
        }

        // 2. Seed a Real Restaurant into PostgreSQL!
        if (restaurantRepository.count() == 0) {
            Restaurant rest1 = new Restaurant();
            rest1.setName("The Royal Biryani Durbar");
            rest1.setLocation("Sardar Marg, Civil Lines");
            restaurantRepository.save(rest1);

            // 3. Seed Live Tables for this Restaurant!
            RestaurantTable t1 = new RestaurantTable();
            t1.setRestaurant(rest1);
            t1.setTableNumber(1);
            t1.setCapacity(2);
            t1.setStatus("FREE");
            tableRepository.save(t1);

            RestaurantTable t2 = new RestaurantTable();
            t2.setRestaurant(rest1);
            t2.setTableNumber(2);
            t2.setCapacity(4);
            t2.setStatus("OCCUPIED");
            tableRepository.save(t2);

            System.out.println("Mock Restaurant and Tables seeded successfully into PostgreSQL!");
        }
    }
}
