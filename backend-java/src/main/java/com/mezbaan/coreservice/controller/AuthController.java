package com.mezbaan.coreservice.controller;

import com.mezbaan.coreservice.entity.User;
import com.mezbaan.coreservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class AuthController {

    // 🚀 Injecting the Database connection here!
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("Real DB Login request received for: " + request.email());

        // 1. Search the PostgreSQL database for the user's email
        Optional<User> userOptional = userRepository.findByEmail(request.email());

        // 2. If the user exists in the database
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            // 3. Verify the password (Note: We will add encryption/Bcrypt later)
            if (user.getPassword().equals(request.password())) {
                System.out.println("Login Success! Role: " + user.getRole());
                
                return ResponseEntity.ok(Map.of(
                    "token", "real-database-jwt-coming-soon",
                    "role", user.getRole(),
                    "message", "Welcome back!"
                ));
            }
        }

        System.out.println("Login Failed: Invalid credentials.");
        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }

    public record LoginRequest(String email, String password) {}
}
