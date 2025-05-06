package com.example.entities;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Model.User;

@Service
public  class UserService {


    private final Map<String, User> userStore = new HashMap<>();
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final Map<String, String> resetCodeStore = new HashMap<>();


    

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

    

    public boolean registerUser(User entity) {

        if (userStore.containsKey(entity.getEmail())) {
            return false; // User already exists
        }
        // Encode the password before storing
        String encodedPassword = passwordEncoder.encode(entity.getPassword());
        entity.setPassword(encodedPassword);

        userStore.put(entity.getEmail(), entity);
        return true; // User registered successfully
    }

    
    
    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(userStore.get(email));
    }


    // public Optional<String> getEmailByToken(String token) {
    //     return Optional.ofNullable(resetCodeStore.get(token));
    // }

    public void saveResetToken(String email, String code) {
        resetCodeStore.put(email, code);
    }
    
    public String getResetToken(String email) {
        return resetCodeStore.get(email);
    }
    
    public void updatePassword(String email, String newPassword) {
        User user = userStore.get(email);
        if (user != null) {
            String encodedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encodedPassword);
        }
    }


  


    
}