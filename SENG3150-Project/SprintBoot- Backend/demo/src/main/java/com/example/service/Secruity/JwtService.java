package com.example.service.Secruity;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {
    private final SecretKey accessKey;
    private final SecretKey refreshKey;
    private final long accessTtlMs;
    private final long refreshTtlMs;

    public JwtService(
            @Value("${app.jwt.access-secret}") String accessSecret,
            @Value("${app.jwt.refresh-secret}") String refreshSecret,
            @Value("${app.jwt.access-minutes}") long accessMinutes,
            @Value("${app.jwt.refresh-days}") long refreshDays
    ) {
        this.accessKey = Keys.hmacShaKeyFor(accessSecret.getBytes());
        this.refreshKey = Keys.hmacShaKeyFor(refreshSecret.getBytes());
        this.accessTtlMs = accessMinutes * 60_000L;
        this.refreshTtlMs = refreshDays * 24 * 60 * 60_000L;
    }

    public String generateAccess(String subject, Map<String, Object> claims) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(subject)
                .claims(claims)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(accessTtlMs)))
                .signWith(accessKey, Jwts.SIG.HS256)
                .compact();
    }

    public String generateRefresh(String subject) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(subject)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(refreshTtlMs)))
                .signWith(refreshKey, Jwts.SIG.HS256)
                .compact();
    }

    public Jws<Claims> parseAccess(String token) {
        return Jwts.parser().verifyWith(accessKey).build().parseSignedClaims(token);
    }

    public Jws<Claims> parseRefresh(String token) {
        return Jwts.parser().verifyWith(refreshKey).build().parseSignedClaims(token);
    }

    public String generateAccessToken(String subject, Map<String, Object> claims) {
        return generateAccess(subject, claims);
    }

    public String generateRefreshToken(String subject) {
        return generateRefresh(subject);
    }

    public String getSubjectFromRefresh(String refreshToken) {
        try {
            Jws<Claims> claims = parseRefresh(refreshToken);
            return claims.getPayload().getSubject();
        } catch (JwtException e) {
            throw new RuntimeException("Invalid refresh token", e);
        }
    }

    public String getSubjectFromAccess(String accessToken) {
        try {
            Jws<Claims> claims = parseAccess(accessToken);
            return claims.getPayload().getSubject();
        } catch (JwtException e) {
            throw new RuntimeException("Invalid access token", e);
        }
    }
}