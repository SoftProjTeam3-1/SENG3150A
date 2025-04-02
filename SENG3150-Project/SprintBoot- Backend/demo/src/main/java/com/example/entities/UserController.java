package com.example.entities;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;





@RestController
public class UserController {
    UserService userService = new UserService();

 

    @PostMapping("/api/user/submits")
    public String register(@RequestBody User entity) {
        User user = new User();
        user.setFirstName(entity.getFirstName());
        user.setSurname(entity.getSurname());
        user.setEmail(entity.getEmail());
        user.setPassword(entity.getPassword());


        Boolean result = userService.registerUser(user);
        if (result) {
            return "User registered successfully!";
        } else {
            return "User already exists!";
        }
    }

    
    @GetMapping("/api/user/getEmails")
    public String[] returrnEmails() {
        return userService.getUserData();
    }

      
    
  
    

}


