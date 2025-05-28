package com.example.entities;

import org.springframework.stereotype.Service;

import com.example.repositories.UserRepository;
import com.example.stored_procedures.CreateUser;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Boolean registerUser(User user) {
        CreateUser createUser = new CreateUser(userRepository);
        return createUser.createUser(user);
    }

    public User getUser(String email) {
        return userRepository.findByEmail(email);
    }

    public void saveResetToken(String email, String code) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setEmailCodeSent(code);  // Store code in DB
            userRepository.save(user);    // Persist it
        }
    }

    public String getResetToken(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            return user.getEmailCodeSent();  // Retrieve from DB
        }
        return null;
    }

    public boolean updatePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setPassword(newPassword);   // Save new password (hash it if needed)
            user.setEmailCodeSent(null);     // Clear the reset code
            userRepository.save(user);       // Persist changes
            return true;
        }
        return false;
    }
}
