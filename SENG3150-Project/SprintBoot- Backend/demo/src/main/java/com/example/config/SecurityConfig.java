package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/user/register", 
                                 "/api/user/forgotpassword", 
                                 "/api/user/reset-password", 
                                 "/api/user/login",
                                 "/api/activityType/getAll",
                                 "/api/activityType/create",
                                 "/api/activityType/delete",
                                 "/api/activity/create",
                                 "/api/activity/getAll",
                                 "/api/activity/getByActivityType",
                                 "/api/activity/delete").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }
}