package com.example.entities;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.stored_procedures.CreateUser;
import com.example.stored_procedures.GetUser;

import com.example.repositories.UserRepository;

import org.springframework.stereotype.Service;

@Service
public  class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Boolean registerUser(User user) {
        CreateUser createUser = new CreateUser(userRepository);
        boolean isCreated = createUser.createUser(user);
        return isCreated;
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
        GetUser getUserInstance = new GetUser(userRepository);
        return getUserInstance.getUser(email);
    }    
}