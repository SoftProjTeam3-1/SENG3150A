package com.example;

import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.entities.User;
import com.example.entities.UserService;

@RestController
@RequestMapping("/api/user")
public class ForgotPasswordController {

    @Autowired
    private JavaMailSender mailSender;  // TEMP: sanity check

    @Autowired
    private UserService userService;

    @PostMapping("/forgotpassword")
    public Map<String, String> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
    
        if (email == null || email.isEmpty()) {
            return Map.of("error", "Email is required.");
        }
    
        User user = userService.getUserByEmail(email);
        if (user == null) {
            return Map.of("error", "No account found for that email.");
        }
    
        String code = String.valueOf(new Random().nextInt(9000) + 1000);
        userService.saveResetToken(email, code); 
    
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset Code");
        message.setText("Your password reset code is: " + code);
        mailSender.send(message);
    
        return Map.of("message", "Password reset code sent to " + email);
    }


    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String code = payload.get("code");
        String newPassword = payload.get("newPassword");

        String storedCode = userService.getResetToken(email);
        if (storedCode == null || !storedCode.equals(code)) {
            return Map.of("error", "Invalid or expired reset code.");
        }

        boolean updated = userService.updatePassword(email, newPassword);
        if (!updated) {
            return Map.of("error", "Failed to update password.");
        }
        userService.saveResetToken(email, "null");
        return Map.of("message", "Password updated successfully.");
    }

    @PostMapping("/verify-reset-code")
    public Map<String, String> verifyResetCode(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String code = payload.get("code");
    
        if (email == null || code == null) {
            return Map.of("error", "Email and code are required.");
        }
    
        User user = userService.getUserByEmail(email);
        if (user == null) {
            return Map.of("error", "No account found for that email.");
        }
    
        if (!code.equals(user.getEmailCodeSent())) {
            return Map.of("error", "Invalid or expired reset code.");
        }
    
        return Map.of("message", "Code verified successfully.");
    }
    
}
