/*
 * Author: Harrison Armstrong
 */

package com.example.stored_procedures;

import com.example.entities.User;
import com.example.repositories.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class ValidateUser {

    private final UserRepository userRepository;


    public ValidateUser(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean validateUser(String email, String password) {
        User retrievedUser = userRepository.findByEmail(email);

        if (retrievedUser != null && retrievedUser.getPassword().equals(password)) {
            System.out.println("User is valid");
            return true;
        } else {
            System.out.println("User is invalid");
            return false;
        }
    }
}
