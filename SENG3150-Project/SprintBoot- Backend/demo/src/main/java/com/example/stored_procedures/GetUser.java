/*
 * Author: Harrison Armstrong
 */

package com.example.stored_procedures;

import com.example.entities.User;
import com.example.repositories.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class GetUser{

    private final UserRepository userRepository;

    public GetUser(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUser(String email) {
        try{
            // Check if the user exists in the database
            User user = userRepository.findByEmail(email);
            if (user == null) {
                System.out.println("User not found: " + email);
                return null;
            }
            return user;
        } catch (Exception e) {
            System.out.println("Error retrieving user: " + e.getMessage());
            return null;
        }
    }
}