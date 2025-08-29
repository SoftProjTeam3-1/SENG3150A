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

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
  http
    .cors(c -> c.configurationSource(corsConfigurationSource()))
    .csrf(csrf -> csrf.disable())
    .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .authorizeHttpRequests(auth -> auth
        // allow preflight + error page
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .requestMatchers("/error").permitAll()
        // public endpoints
        .requestMatchers(
            "/api/user/register",
            "/api/user/forgotpassword",
            "/api/user/reset-password",
            "/api/user/verify-reset-code",
            "/api/user/login",
            "/api/auth/refresh",
            "/api/auth/logout"
        ).permitAll()
        .anyRequest().authenticated()
    )
    .exceptionHandling(e -> e
        .authenticationEntryPoint((req, res, ex) -> res.sendError(HttpStatus.UNAUTHORIZED.value()))
    )
    .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
    .httpBasic(h -> h.disable());
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




