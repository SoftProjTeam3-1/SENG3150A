package com.example.entities;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
//import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.example.responses.RegisterResponse;
import com.example.responses.LoginResponse;


@RestController
public class UserController {

    @Autowired
    UserService userService;

    
    @PostMapping("api/user/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody User entity) {
        User user = new User();
        user.setFirstName(entity.getFirstName());
        user.setSurname(entity.getSurname());
        user.setEmail(entity.getEmail());
        user.setPassword(entity.getPassword());

        System.out.println("User object created: " + user);

        Boolean result = userService.registerUser(user);
        if (result) {
            return new ResponseEntity<>(new RegisterResponse(true, "User registered successfully"), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new RegisterResponse(false, "User registration failed"), HttpStatus.OK);
        }
    }

    // login
    @PostMapping("/api/user/login")
    public ResponseEntity<LoginResponse> login(@RequestBody User entity) {
        User user = new User();
        user.setEmail(entity.getEmail());
        user.setPassword(entity.getPassword());

        System.out.println("Login Temp User: " + user.getEmail() + " " + user.getPassword());

        User result = userService.getUser(user.getEmail());

        if (result != null && result.getPassword().equals(user.getPassword())) {
            System.err.println("User found: " + result.getFirstName());
            LoginResponse loginResponse = new LoginResponse(true, "Login successful");
            return new ResponseEntity<>(loginResponse, HttpStatus.OK);

        } else {
            System.out.println("User not found " + user.getEmail() + " " + user.getPassword());
            LoginResponse loginResponse = new LoginResponse(false, "Login failed");
            return new ResponseEntity<>(loginResponse, HttpStatus.OK);
        }
    }
}


