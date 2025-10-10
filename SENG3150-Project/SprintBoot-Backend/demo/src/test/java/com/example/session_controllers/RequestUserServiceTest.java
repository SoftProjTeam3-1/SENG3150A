package com.example.session_controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.server.ResponseStatusException;

import com.example.entities.User;
import com.example.entities.UserService;
import com.example.services.JwtService;

import jakarta.servlet.http.Cookie;

public class RequestUserServiceTest {

    @Test
    @DisplayName("Prefers Authorization Bearer token to resolve user")
    void testRequireUser_withAuthorizationHeader() {
        JwtService jwt = mock(JwtService.class);
        UserService users = mock(UserService.class);
        RequestUserService svc = new RequestUserService(jwt, users);

        MockHttpServletRequest req = new MockHttpServletRequest();
        req.addHeader("Authorization", "Bearer abc.def.ghi");

        when(jwt.getSubjectFromAccess("abc.def.ghi")).thenReturn("u@example.com");
        User u = new User();
        u.setEmail("u@example.com");
        when(users.getUserByEmail("u@example.com")).thenReturn(u);

        User got = svc.requireUser(req);
        assertEquals("u@example.com", got.getEmail());
        verify(users, times(1)).getUserByEmail("u@example.com");
        verifyNoMoreInteractions(users);
    }

    @Test
    @DisplayName("Falls back to refresh cookie when no Authorization header")
    void testRequireUser_withRefreshCookie() {
        JwtService jwt = mock(JwtService.class);
        UserService users = mock(UserService.class);
        RequestUserService svc = new RequestUserService(jwt, users);

        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setCookies(new Cookie("refreshToken", "refresh.jwt.token"));

        when(jwt.getSubjectFromRefresh("refresh.jwt.token")).thenReturn("r@example.com");
        User u = new User();
        u.setEmail("r@example.com");
        when(users.getUserByEmail("r@example.com")).thenReturn(u);

        User got = svc.requireUser(req);
        assertEquals("r@example.com", got.getEmail());
        verify(users, times(1)).getUserByEmail("r@example.com");
    }

    @Test
    @DisplayName("Uses userId cookie as legacy fallback when tokens absent")
    void testRequireUser_withUserIdCookie() {
        JwtService jwt = mock(JwtService.class);
        UserService users = mock(UserService.class);
        RequestUserService svc = new RequestUserService(jwt, users);

        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setCookies(new Cookie("userId", "42"));

        User u = new User();
        u.setEmail("id42@example.com");
        when(users.getUserByID(42)).thenReturn(u);

        User got = svc.requireUser(req);
        assertEquals("id42@example.com", got.getEmail());
        verify(users, times(1)).getUserByID(42);
    }

    @Test
    @DisplayName("Throws 401 when no credentials present")
    void testRequireUser_unauthorized() {
        JwtService jwt = mock(JwtService.class);
        UserService users = mock(UserService.class);
        RequestUserService svc = new RequestUserService(jwt, users);

        MockHttpServletRequest req = new MockHttpServletRequest();
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> svc.requireUser(req));
        assertEquals(401, ex.getStatusCode().value());
    }
}
