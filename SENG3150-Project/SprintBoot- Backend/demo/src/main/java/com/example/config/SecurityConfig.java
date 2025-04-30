package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // For API use without CSRF token (OK for development)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/user/register", "/api/user/forgotpassword", "/api/user/reset-password").permitAll() // ✅ Public endpoints
                .anyRequest().authenticated() // Other endpoints require login
            )
            .httpBasic(Customizer.withDefaults()); // Use basic auth if needed (for testing)

        return http.build();
    }
}
