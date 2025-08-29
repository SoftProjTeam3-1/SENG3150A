package com.example.entities;

import com.example.responses.RegisterResponse;
import com.example.service.Secruity.JwtService; // keep your existing (typo) package name
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.Map;

@RestController
public class UserController {

    private final UserService userService;
    private final JwtService jwt;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.cookies.secure:false}") private boolean cookieSecure; // true in HTTPS prod
    @Value("${app.cookies.same-site:Lax}") private String sameSite;     // None in HTTPS prod

    public UserController(UserService userService, JwtService jwt, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwt = jwt;
        this.passwordEncoder = passwordEncoder;
    }

    // ---------------- Register ----------------
    @PostMapping("/api/user/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody User entity) {
        User user = new User();
        user.setFirstName(entity.getFirstName());
        user.setSurname(entity.getSurname());
        user.setEmail(entity.getEmail());
        // hash the password before save (fallback to plain if you haven't migrated yet)
        user.setPassword(passwordEncoder.encode(entity.getPassword()));

        boolean ok = userService.registerUser(user);
        return ResponseEntity.ok(
            ok ? new RegisterResponse(true, "User registered successfully")
               : new RegisterResponse(false, "User registration failed")
        );
    }

    @PostMapping("/api/user/login")
    public ResponseEntity<?> login(@RequestBody User entity, HttpServletResponse response) {
    User u = userService.getUser(entity.getEmail());
    System.out.println("User fetched from DB: " + (u != null ? u.getEmail() : "null"));
    if (u == null) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    // bcrypt(raw) only
    if (!passwordEncoder.matches(entity.getPassword(), u.getPassword())) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    String access  = jwt.generateAccessToken(u.getEmail(), Map.of("uid", u.getId(), "email", u.getEmail()));
    String refresh = jwt.generateRefreshToken(u.getEmail());

    ResponseCookie cookie = ResponseCookie.from("refreshToken", refresh)
            .httpOnly(true)
            .secure(cookieSecure)      // set true in HTTPS prod
            .sameSite(sameSite)        // "None" in HTTPS cross-site
            .path("/api/auth")
            .maxAge(Duration.ofDays(30))
            .build();
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

    // keep response simple; frontend already expects accessToken at top level
    return ResponseEntity.ok(Map.of(
            "accessToken", access,
            "user", Map.of("id", u.getId(), "email", u.getEmail(), "firstName", u.getFirstName())
    ));
}

    // ---------------- Refresh: rotates cookie and returns a fresh access token ----------------
  @PostMapping("/api/auth/refresh")
public ResponseEntity<?> refresh(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
    if (refreshToken == null) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No refresh token");
    }
    String subject = jwt.getSubjectFromRefresh(refreshToken);
    var user = userService.getUserByEmail(subject);

    Map<String, Object> claims = Map.of("uid", user.getId(), "email", user.getEmail());
    String newAccess = jwt.generateAccessToken(user.getEmail(), claims);

    return ResponseEntity.ok(Map.of("accessToken", newAccess));
}

    // ---------------- Logout: clears refresh cookie ----------------
    @PostMapping("/api/auth/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie clear = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(sameSite)
                .path("/api/auth")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, clear.toString());
        return ResponseEntity.noContent().build();
    }
}
