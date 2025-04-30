package com.example.entities;

import java.util.Map;
import java.util.Random;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.Model.User;


@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    //login
    @PostMapping("/api/user/login")
    public boolean login(@RequestBody User entity) {  return userService.loginUser(entity.getEmail(), entity.getPassword());}

    
    @PostMapping("/api/user/register")   
    public ResponseEntity<?> register(@RequestBody User user) {
        boolean success = userService.registerUser(user);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "User registered successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "User already exists"));
        }
    }
    
    @GetMapping("/api/user/getEmails")
    public String[] returrnEmails() {  return userService.getUserData(); }

  

    public String generateEmailCode() {

        Random random = new Random();
        int code = random.nextInt(900000) + 100000; // Generates a number between 100000 and 999999
        return String.valueOf(code);
        
    }
    
  
    

}


