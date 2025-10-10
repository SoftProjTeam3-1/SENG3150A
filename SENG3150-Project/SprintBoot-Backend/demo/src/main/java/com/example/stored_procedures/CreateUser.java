package com.example.stored_procedures;

import com.example.entities.User;
import com.example.repositories.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class CreateUser {

    private final UserRepository userRepository;

    public CreateUser(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean createUser(String firstName, String surname, String email, boolean verified, String password) {
        try {
            User user = new User(firstName, surname, email, verified, password);
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            System.out.println("Error while saving user: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public boolean createUser(User user) {
        try {
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            System.out.println("Error while saving user: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}