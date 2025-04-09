package com.example.entities;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public  class UserService {


    private final Map<String, User> userStore = new HashMap<>();
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Boolean registerUser(User user) {
        if (userStore.containsKey(user.getEmail())) {
            return false; // User already exists
        }

        // Encode the password before storing
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        userStore.put(user.getEmail(), user);
        return true; // User registered successfully
    }
    

   public boolean loginUser(String email, String password) {
        User existingUser = userStore.get(email);

        if (existingUser != null && passwordEncoder.matches(password, existingUser.getPassword())) {
            System.err.println("User found: " + existingUser.getFirstName());
            return true;
        } else {
            System.out.println("User not found " + email);
            return false;
        }
    }


    public String[] getUserData() {
        List<String> userData = new ArrayList<>();
        for (User user : userStore.values()) {
            String data = "Name: " + user.getFirstName() + " " + user.getSurname() + ", Email: " + user.getEmail() + ", Password: " + user.getPassword();
            userData.add(data);
        }
        return userData.toArray(new String[0]);
        
    }
    
    public User getUser(String email) {
        return userStore.get(email);
    }


    
}