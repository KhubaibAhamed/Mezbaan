package com.mezbaan.coreservice.repository;

import com.mezbaan.coreservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Spring Data JPA magic: It automatically writes the SQL query just from this method name!
    // Equivalent to: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);
    
    // Check if an email exists (useful for registration)
    boolean existsByEmail(String email);
}