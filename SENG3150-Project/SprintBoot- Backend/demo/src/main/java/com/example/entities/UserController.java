package com.example.entities;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;





@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    //login
    @PostMapping("/api/user/login")
    public boolean login(@RequestBody User entity) {  return userService.loginUser(entity.getEmail(), entity.getPassword());}

    
    //register
    @PostMapping("/api/user/register")
    public boolean registerUser(@RequestBody User entity) { return userService.registerUser(entity); }

    
    @GetMapping("/api/user/getEmails")
    public String[] returrnEmails() {  return userService.getUserData(); }

      
    
  
    

}


