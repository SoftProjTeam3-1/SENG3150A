package com.example.services;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;

public class JwtServiceTest {

    // 32+ char secrets for HS256
    private static final String ACCESS_SECRET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123";
    private static final String REFRESH_SECRET = "abcdefghijklmnopqrstuvwxyz012345678901";

    @Test
    @DisplayName("generateAccess and parseAccess should return the correct subject")
    void testGenerateAndParseAccessToken_returnsSubject() {
        JwtService jwtService = new JwtService(ACCESS_SECRET, REFRESH_SECRET, 10L, 1L);
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "USER");
        String token = jwtService.generateAccess("user@example.com", claims);

        Jws<Claims> parsed = jwtService.parseAccess(token);
        assertEquals("user@example.com", parsed.getBody().getSubject());
        assertEquals("USER", parsed.getBody().get("role"));

        // Also verify via convenience method
        assertEquals("user@example.com", jwtService.getSubjectFromAccess(token));
    }

    @Test
    @DisplayName("generateRefresh and parseRefresh should return the correct subject")
    void testGenerateAndParseRefreshToken_returnsSubject() {
        JwtService jwtService = new JwtService(ACCESS_SECRET, REFRESH_SECRET, 10L, 1L);
        String token = jwtService.generateRefresh("refresh-user@example.com");

        Jws<Claims> parsed = jwtService.parseRefresh(token);
        assertEquals("refresh-user@example.com", parsed.getBody().getSubject());

        // Also verify via convenience method
        assertEquals("refresh-user@example.com", jwtService.getSubjectFromRefresh(token));
    }

    @Test
    @DisplayName("getSubjectFromAccess should throw on invalid token")
    void testInvalidAccessToken_throwsRuntimeException() {
        JwtService jwtService = new JwtService(ACCESS_SECRET, REFRESH_SECRET, 10L, 1L);
        RuntimeException ex = assertThrows(RuntimeException.class, () -> jwtService.getSubjectFromAccess("not-a-real-token"));
        assertTrue(ex.getMessage().toLowerCase().contains("invalid"));
    }

    @Test
    @DisplayName("getSubjectFromRefresh should throw on invalid token")
    void testInvalidRefreshToken_throwsRuntimeException() {
        JwtService jwtService = new JwtService(ACCESS_SECRET, REFRESH_SECRET, 10L, 1L);
        RuntimeException ex = assertThrows(RuntimeException.class, () -> jwtService.getSubjectFromRefresh("bad-token"));
        assertTrue(ex.getMessage().toLowerCase().contains("invalid"));
    }

    @Test
    @DisplayName("Alias methods should call underlying generators")
    void testAliasGenerators() {
        JwtService jwtService = new JwtService(ACCESS_SECRET, REFRESH_SECRET, 10L, 1L);
        Map<String, Object> claims = Map.of("a", 1);
        String access = jwtService.generateAccessToken("alias@example.com", claims);
        assertEquals("alias@example.com", jwtService.getSubjectFromAccess(access));

        String refresh = jwtService.generateRefreshToken("alias-refresh@example.com");
        assertEquals("alias-refresh@example.com", jwtService.getSubjectFromRefresh(refresh));
    }
}
