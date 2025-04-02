package com.example.entities;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.google.common.hash.Hashing;

@Service
public  class UserService {

    private final Map<String, User> userStore = new HashMap<>();


    public Boolean registerUser(User user) {
        if (userStore.containsKey(user.getEmail())) {

            return false; // User already exists
        }
        userStore.put(user.getEmail(), user);
        return true; // User registered successfully
    }

    public String[] getUserData() {
        List<String> userData = new ArrayList<>();
        for (User user : userStore.values()) {
            String data = "Name: " + user.getFirstName() + " " + user.getSurname() + ", Email: " + user.getEmail() + ", Password: " + user.getPassword();
            userData.add(data);
        }
        return userData.toArray(new String[0]);
        

    }

    private String encryptPassword(String password) {
        String sha256hex = Hashing.sha256()
            .hashString(password, StandardCharsets.UTF_8)
            .toString();
        return sha256hex;
    }

    
    public User getUser(String email) {
        return userStore.get(email);
    }


    
}