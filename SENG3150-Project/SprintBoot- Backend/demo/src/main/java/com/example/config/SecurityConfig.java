package com.example.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))  // Enable CORS  // Enable CORS
            .csrf(csrf -> csrf.disable())  // Disable CSRF for this scenario
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/user/register", 
                                 "/api/user/forgotpassword", 
                                 "/api/user/reset-password", 
                                 "/api/user/verify-reset-code",
                                 "/api/user/login",
                                 "/api/activityType/getAll",
                                 "/api/activityType/create",
                                 "/api/activityType/delete",
                                 "/api/activityType/update",
                                 "/api/activity/update",
                                 "/api/activity/create",
                                 "/api/activity/getAll",
                                 "/api/activity/getByActivityType",
                                 "/api/activity/delete").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow requests from any origin (for development/testing only) FUCK cors
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.addAllowedHeader("*");
        configuration.addExposedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}




