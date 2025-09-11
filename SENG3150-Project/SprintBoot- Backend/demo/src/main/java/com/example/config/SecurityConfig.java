package com.example.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
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
                                 "/api/activity/delete",
                                 "/api/session/fetchSessions",
                                 "api/session/updateSessions").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }

@Bean
public CorsConfigurationSource corsConfigurationSource() {
  CorsConfiguration cfg = new CorsConfiguration();
  cfg.setAllowCredentials(true);
  cfg.setAllowedOriginPatterns(List.of(
      "http://localhost:5173",
      "http://127.0.0.1:5173"
      // add LAN host if you open via IP, e.g. "http://192.168.*.*:5173"
  ));
  cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS","PATCH"));
  cfg.setAllowedHeaders(List.of("*"));   // or list explicit headers you use
  cfg.setExposedHeaders(List.of("*"));

  UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
  source.registerCorsConfiguration("/**", cfg);
  return source;
}

   @Bean
public PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
}
}




