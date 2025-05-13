package com.example.entities;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class UserController {

    @Autowired
    UserService userService;

    
    @PostMapping("api/user/register")
    public boolean register(@RequestBody User entity) {
        System.out.println("Register endpoint hit");
        System.out.println("Received user details: " + entity);

        User user = new User();
        user.setFirstName(entity.getFirstName());
        user.setSurname(entity.getSurname());
        user.setEmail(entity.getEmail());
        user.setPassword(entity.getPassword());

        System.out.println("User object created: " + user);

        Boolean result = userService.registerUser(user);
        if (result) {
            System.out.println("User registration successful");
            return true;
        } else {
            System.out.println("User registration failed");
            return false;
        }
    }

    // login
    @PostMapping("/api/user/login")
    public boolean login(@RequestBody User entity) {
        System.out.println("Login endpoint hit");
        System.out.println("Received login details: " + entity);
        System.out.println("Email received: " + entity.getEmail());
        String email = entity.getEmail();
        String hashedPassword = entity.getPassword(); // Already hashed in frontend

        System.out.println("Fetching user from database for email: " + email);
        User result = userService.getUser(email); // Fetch user from DB
        System.out.println("User fetched from database: " + result);

        if (result != null) {
            System.out.println("User found in database: " + result);
            if (result.getPassword().equals(hashedPassword)) {
                System.out.println("Password match. User logged in: " + result.getEmail());
                return true;
            } else {
                System.out.println("Password mismatch for user: " + email);
                return false;
            }
        } else {
            System.out.println("No user found with email: " + email);
            return false;
        }
    }
}


