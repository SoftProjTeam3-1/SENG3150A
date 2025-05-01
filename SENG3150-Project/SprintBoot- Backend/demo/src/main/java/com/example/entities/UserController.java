package com.example.entities;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.hash.Hashing;

@RestController
public class UserController {

    UserService userService = new UserService();

 

    @PostMapping("/api/user/submits")
    public boolean register(@RequestBody User entity) {
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

        User result = userService.getUser(user.getEmail());
        if (result != null && result.getPassword().equals(user.getPassword())) {
            System.err.println("User found: " + result.getFirstName());
            return true;

        } else {
            System.out.println("User not found " + user.getEmail() + " " + user.getPassword());
            return false;
        }
       
       
    }
    
    @GetMapping("/api/user/getEmails")
    public String[] returrnEmails() {
        return userService.getUserData();
    }

      
    
  
    

}


