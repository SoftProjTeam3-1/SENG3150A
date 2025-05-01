package com.example.entities;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.stored_procedures.CreateUser;
import com.example.stored_procedures.GetUser;

import org.springframework.stereotype.Service;

@Service
public  class UserService {

    public Boolean registerUser(User user) {
        /*
         * if (userStore.containsKey(user.getEmail())) {

            return false; // User already exists
        }
        userStore.put(user.getEmail(), user);
        return true; // User registered successfully
         */

        CreateUser newUser = new CreateUser(user);
        return newUser.processTransaction();
    }

/*     public String[] getUserData() {
        List<String> userData = new ArrayList<>();
        for (User user : userStore.values()) {
            String data = "Name: " + user.getFirstName() + " " + user.getSurname() + ", Email: " + user.getEmail() + ", Password: " + user.getPassword();
            userData.add(data);
        }
        return userData.toArray(new String[0]);
        

    } */

    
    public User getUser(String email) {
        GetUser getUserInstance = new GetUser();
        return getUserInstance.getUser(email);
    }


    
}