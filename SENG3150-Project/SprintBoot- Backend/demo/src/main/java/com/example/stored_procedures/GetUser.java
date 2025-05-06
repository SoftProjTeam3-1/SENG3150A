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
        return userRepository.findByEmail(email);
    }
}