package com.example.config;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

public class SecurityConfigTest {

    @Test
    @DisplayName("passwordEncoder bean encodes and matches passwords")
    void testPasswordEncoder() {
        SecurityConfig cfg = new SecurityConfig(mock(JwtAuthenticationFilter.class));
        PasswordEncoder encoder = cfg.passwordEncoder();
        String raw = "secret123";
        String encoded = encoder.encode(raw);
        assertNotEquals(raw, encoded);
        assertTrue(encoder.matches(raw, encoded));
    }

    @Test
    @DisplayName("corsConfigurationSource provides expected settings")
    void testCorsConfigurationSource() {
        SecurityConfig cfg = new SecurityConfig(mock(JwtAuthenticationFilter.class));
        CorsConfigurationSource source = cfg.corsConfigurationSource();
        MockHttpServletRequest request = new MockHttpServletRequest();
        CorsConfiguration c = source.getCorsConfiguration(request);
        assertTrue(c.getAllowCredentials());
        List<String> origins = c.getAllowedOriginPatterns();
        assertTrue(origins.contains("http://localhost:5173"));
        assertTrue(origins.contains("http://127.0.0.1:5173"));
        assertTrue(c.getAllowedMethods().containsAll(List.of("GET","POST","PUT","DELETE","OPTIONS","PATCH")));
        assertEquals(List.of("*"), c.getAllowedHeaders());
        assertEquals(List.of("*"), c.getExposedHeaders());
    }
}
