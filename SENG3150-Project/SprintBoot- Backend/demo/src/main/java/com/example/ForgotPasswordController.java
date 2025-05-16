package com.example;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import com.example.entities.User;
import com.example.entities.UserService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class ForgotPasswordController {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserService userService;

    @PostMapping("/forgotpassword")
    public Map<String, String> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");

        User user = userService.getUser(email);
        if (user == null) {
            return Map.of("error", "No account found for that email.");
        }

        int code = (int) (Math.random() * 9000 + 1000); // 4-digit code
        userService.saveResetToken(email, String.valueOf(code));

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

        return Map.of("message", "Password updated successfully.");
    }
}
