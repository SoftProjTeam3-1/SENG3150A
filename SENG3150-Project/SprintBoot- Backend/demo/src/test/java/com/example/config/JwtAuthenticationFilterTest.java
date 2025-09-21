package com.example.config;

import java.io.IOException;

import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.services.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;

public class JwtAuthenticationFilterTest {

    private JwtService jwtService;
    private JwtAuthenticationFilter filter;

    @BeforeEach
    void setup() {
        jwtService = mock(JwtService.class);
        filter = new JwtAuthenticationFilter(jwtService);
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void cleanup() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Sets authentication for valid Bearer token")
    void testValidBearerToken_setsAuthentication() throws ServletException, IOException {
        String token = "valid-token";
        when(jwtService.getSubjectFromAccess(token)).thenReturn("user@example.com");

        MockHttpServletRequest req = new MockHttpServletRequest();
        req.addHeader("Authorization", "Bearer " + token);
        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilterInternal(req, res, chain);

        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals("user@example.com", SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        verify(chain, times(1)).doFilter(req, res);
    }

    @Test
    @DisplayName("Does not authenticate when token is invalid")
    void testInvalidToken_doesNotAuthenticate() throws ServletException, IOException {
        String token = "invalid";
        when(jwtService.getSubjectFromAccess(token)).thenThrow(new RuntimeException("bad token"));

        MockHttpServletRequest req = new MockHttpServletRequest();
        req.addHeader("Authorization", "Bearer " + token);
        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilterInternal(req, res, chain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(chain, times(1)).doFilter(req, res);
    }

    @Test
    @DisplayName("Skips when Authorization header missing")
    void testNoHeader_skips() throws ServletException, IOException {
        MockHttpServletRequest req = new MockHttpServletRequest();
        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilterInternal(req, res, chain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(chain, times(1)).doFilter(req, res);
    }

    @Test
    @DisplayName("Does not override existing authentication")
    void testExistingAuthentication_notOverridden() throws ServletException, IOException {
        // Pre-set authentication
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("preset", null));

        MockHttpServletRequest req = new MockHttpServletRequest();
        req.addHeader("Authorization", "Bearer some-token");
        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        // Even if service would return a subject, filter should not replace existing auth
        when(jwtService.getSubjectFromAccess("some-token")).thenReturn("another@example.com");

        filter.doFilterInternal(req, res, chain);

        assertEquals("preset", SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        verify(chain, times(1)).doFilter(req, res);
    }
}
