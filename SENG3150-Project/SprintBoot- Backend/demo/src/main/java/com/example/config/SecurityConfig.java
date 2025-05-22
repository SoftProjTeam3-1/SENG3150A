package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;


//Dont fuq wit dis
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors() 
            .and()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/user/forgotpassword", "/api/user/reset-password", "/api/user/register", "/api/user/login").permitAll()
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
