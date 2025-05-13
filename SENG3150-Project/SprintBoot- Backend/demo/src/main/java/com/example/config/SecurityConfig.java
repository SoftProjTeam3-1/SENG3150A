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
            .csrf(csrf -> csrf.disable()) // Disable CSRF (fine for JSON APIs during dev)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/user/register",
                    "/api/user/forgotpassword",
                    "/api/user/reset-password",
                    "/api/user/login"  // ✅ Allow login without authentication
                ).permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(httpBasic -> httpBasic.disable()); // ✅ Disable browser basic auth popup

        return http.build();
    }
}

