// RequestUserService.java
package com.example.session_controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.entities.User;
import com.example.entities.UserService;
import com.example.services.JwtService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

/**
 * The Service for the User Requests.
 */
@Service
public class RequestUserService {

    private final JwtService jwt;         // your existing JWT helper/service
    private final UserService userService;

    public RequestUserService(JwtService jwt, UserService userService) {
        this.jwt = jwt;
        this.userService = userService;
    }

    /**
     * Return the User from the request.
     * @param request The request must be a JWT or a cookie.
     * @return {@link User}; Otherwise {@link ResponseStatusException} with an error message.
     */
    public User requireUser(HttpServletRequest request) {
        // 1) Prefer Authorization: Bearer <access>
        String auth = request.getHeader(HttpHeaders.AUTHORIZATION);

        System.out.println(" PART 1 ");

        if (auth != null && auth.startsWith("Bearer ")) {
            String accessToken = auth.substring(7);
            String subject = jwt.getSubjectFromAccess(accessToken); // implement if needed
            User user = userService.getUserByEmail(subject);
            if (user != null) return user;
        }

        // 2) Otherwise, use refresh cookie (correct name!)
        String refresh = getCookie(request, "refreshToken");
        if (refresh != null) {
            String subject = jwt.getSubjectFromRefresh(refresh);
            User user = userService.getUserByEmail(subject);
            if (user != null) return user;
        }

        // 3) Legacy fallback: userId cookie
        String userId = getCookie(request, "userId");
        if (userId != null && !userId.isBlank()) {
            try {
                User user = userService.getUserByID(Integer.parseInt(userId));
                if (user != null) return user;
            } catch (NumberFormatException ignore) { /* fallthrough */ }
        }

        // If we got here, the request isn’t authenticated
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
    }

    /**
     * Return the JWT from the cookie.
     * @param request The cookie.
     * @param name The name of the header the cookie is under.
     * @return {@link String}; Otherwise null.
     */
    private String getCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie c : cookies) {
            if (name.equals(c.getName())) return c.getValue();
        }
        return null;
    }
}
