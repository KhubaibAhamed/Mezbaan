package com.mezbaan.coreservice.controller;

import com.mezbaan.coreservice.entity.User;
import com.mezbaan.coreservice.repository.UserRepository;
import com.mezbaan.coreservice.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") 
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("Real DB Login request received for: " + request.email());

        Optional<User> userOptional = userRepository.findByEmail(request.email());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            // Verifying the password
            if (user.getPassword().equals(request.password())) {
                System.out.println("Login Success! Role: " + user.getRole());
                
                // 🚀 Generate a REAL Cryptographic JWT Token!
                String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
                
                return ResponseEntity.ok(Map.of(
                    "token", token,
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
