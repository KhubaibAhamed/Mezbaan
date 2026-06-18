package com.mezbaan.coreservice.setup;

import com.mezbaan.coreservice.entity.User;
import com.mezbaan.coreservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseSeeder {

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            // Check if the admin user already exists to prevent duplicate errors on restart
            if (!userRepository.existsByEmail("admin@mezbaan.com")) {
                
                System.out.println("No Admin found. Seeding initial Super Admin into PostgreSQL...");
                
                // Note: In production, passwords MUST be hashed (e.g., BCrypt). 
                // We are using plain text temporarily just to test the database connection.
                User admin = new User(
                    "System Administrator", 
                    "admin@mezbaan.com", 
                    "admin123", 
                    "SUPER_ADMIN", 
                    "+91-9999999999"
                );
                
                userRepository.save(admin);
                System.out.println("Super Admin seeded successfully!");
            } else {
                System.out.println("Database already contains Admin data. Skipping seed.");
            }
        };
    }
}