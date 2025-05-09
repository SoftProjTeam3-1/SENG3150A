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
        User user = new User();
        user.setFirstName(entity.getFirstName());
        user.setSurname(entity.getSurname());
        user.setEmail(entity.getEmail());
        user.setPassword(entity.getPassword());

        System.out.println("User: " + user.getFirstName() + " " + user.getSurname() + " " + user.getEmail() + " " + user.getPassword());

        Boolean result = userService.registerUser(user);
        if (result) {
            return true;
        } else {
            return false;
        }
    }
    

    //login
    @PostMapping("/api/user/login")
    public boolean  login(@RequestBody User entity) {
        User user = new User();
        user.setEmail(entity.getEmail());
        user.setPassword(entity.getPassword());

        System.out.println("Login Temp User: " + user.getEmail() + " " + user.getPassword());

        User result = userService.getUser(user.getEmail());

        System.out.println("Login User: " + result.getEmail() + " " + result.getPassword());

        if (result != null && result.getPassword().equals(user.getPassword())) {
            System.err.println("User found: " + result.getFirstName());
            return true;

        } else {
            System.out.println("User not found " + user.getEmail() + " " + user.getPassword());
            return false;
        }
       
       
    }
    
/*     @GetMapping("/api/user/getEmails")
    public String[] returrnEmails() {
        return userService.getUserData();
    } */

      
    
  
    

}


