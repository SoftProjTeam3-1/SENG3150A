package com.example.entities;

import java.util.Map;
import java.util.Random;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.hash.Hashing;
import java.nio.charset.StandardCharsets;


@RestController
public class UserController {

    @Autowired
    UserService userService;
 
    //TODO: CHECK if the method name is correct
    @PostMapping("/api/user/submits")
    public boolean submits(@RequestBody User entity) {
        User user = new User();
        user.setFirstName(entity.getFirstName());
        user.setSurname(entity.getSurname());
        user.setEmail(entity.getEmail());
        user.setPassword(encryptPassword(entity.getPassword()));


        Boolean result = userService.registerUser(user);
        if (result) {
            return true;
        } else {
            return false;
        }
    }
    //TODO: CHECK if this is needed
    //private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    private String encryptPassword(String password) {
        String sha256hex = Hashing.sha256()
            .hashString(password, StandardCharsets.UTF_8)
            .toString();
        return sha256hex;
    }
    

    //login
    @PostMapping("/api/user/login")
    public boolean  login(@RequestBody User entity) {
        User user = new User();
        user.setEmail(entity.getEmail());
        user.setPassword(encryptPassword(entity.getPassword()));

        //TODO: CHECK if this is coorect
        return userService.loginUser(entity.getEmail(), entity.getPassword());

    }

    @PostMapping("/api/user/register")   
    public ResponseEntity<?> register(@RequestBody User user) {
        boolean success = userService.registerUser(user);
        if (success) {
            return ResponseEntity.ok(Map.of("message", "User registered successfully"));
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "User already exists"));
        }
    }
    
    //TODO: CHECK if this is needed
    // @GetMapping("/api/user/getEmails")
    // public String[] returrnEmails() {  return userService.getUserData(); }

  

    public String generateEmailCode() {

        Random random = new Random();
        int code = random.nextInt(900000) + 100000; // Generates a number between 100000 and 999999
        return String.valueOf(code);
        
    }
    
  
    

}


