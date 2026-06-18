package com.mezbaan.coreservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF (Cross-Site Request Forgery) as we will use JWT tokens
            .csrf(csrf -> csrf.disable())
            
            // 2. Configure Endpoint Access Rules
            .authorizeHttpRequests(auth -> auth
                // Allow anyone to access our test endpoint and future login endpoints
                .requestMatchers("/api/test", "/api/auth/**").permitAll()
                // Require authentication for every other request
                .anyRequest().authenticated()
            )
            
            // 3. Disable the default Spring Security HTML Login page and Browser Popup
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}