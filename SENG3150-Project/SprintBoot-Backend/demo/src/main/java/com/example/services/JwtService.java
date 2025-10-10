package com.example.services;

import java.time.Instant;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

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
        Claims c = Jwts.claims(claims);
        c.setSubject(subject);
    
        return Jwts.builder()
            .setClaims(c)
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(now.plusMillis(accessTtlMs)))
            .signWith(accessKey, SignatureAlgorithm.HS256)
            .compact();
    }
    
    public String generateRefresh(String subject) {
        Instant now = Instant.now();
        return Jwts.builder()
            .setSubject(subject) 
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(now.plusMillis(refreshTtlMs)))
            .signWith(refreshKey, SignatureAlgorithm.HS256)
            .compact();
    }
    

    public Jws<Claims> parseAccess(String token) {
        return Jwts.parserBuilder().setSigningKey(accessKey).build().parseClaimsJws(token);
    }

    public Jws<Claims> parseRefresh(String token) {
        return Jwts.parserBuilder().setSigningKey(refreshKey).build().parseClaimsJws(token);
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
            return claims.getBody().getSubject();
        } catch (JwtException e) {
            throw new RuntimeException("Invalid refresh token", e);
        }
    }

    public String getSubjectFromAccess(String accessToken) {
        try {
            Jws<Claims> claims = parseAccess(accessToken);
            return claims.getBody().getSubject();
        } catch (JwtException e) {
            throw new RuntimeException("Invalid access token", e);
        }
    }
}