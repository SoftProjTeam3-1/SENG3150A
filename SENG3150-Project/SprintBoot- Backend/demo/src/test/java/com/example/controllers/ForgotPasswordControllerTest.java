package com.example.controllers;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import com.example.entities.User;
import com.example.entities.UserService;


//mvn -Dtest=com.example.controllers.ForgotPasswordControllerTest test
@ExtendWith(MockitoExtension.class)
class ForgotPasswordControllerTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private UserService userService;

    @InjectMocks
    private ForgotPasswordController controller;

    private Map<String, String> payload = new HashMap<>();

    @Test
    @DisplayName("forgotpassword returns error when email missing")
    void forgotPassword_missingEmail() {
        Map<String, String> res = controller.forgotPassword(payload);
        assertEquals("Email is required.", res.get("error"));
    }

    @Test
    @DisplayName("forgotpassword returns error when user not found")
    void forgotPassword_userNotFound() {
        payload.put("email", "nouser@example.com");
        when(userService.getUserByEmail("nouser@example.com")).thenReturn(null);
        Map<String, String> res = controller.forgotPassword(payload);
        assertEquals("No account found for that email.", res.get("error"));
    }

    @Test
    @DisplayName("forgotpassword sends email and saves 4-digit code when user exists")
    void forgotPassword_success() {
        String email = "test@example.com";
        payload.put("email", email);
        User user = new User();
        user.setEmail(email);
        when(userService.getUserByEmail(email)).thenReturn(user);

        // Capture the reset token saved
        ArgumentCaptor<String> codeCaptor = ArgumentCaptor.forClass(String.class);

        Map<String, String> res = controller.forgotPassword(payload);

        // Verify email sent
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
        // Verify token saved and validate it's 4 digits
        verify(userService).saveResetToken(org.mockito.Mockito.eq(email), codeCaptor.capture());
        String code = codeCaptor.getValue();
        assertTrue(code.matches("\\d{4}"), "Reset code should be 4 digits, was: " + code);
        assertEquals("Password reset code sent to " + email, res.get("message"));
    }

    @Test
    @DisplayName("reset-password returns error for null stored code")
    void resetPassword_nullStoredCode() {
        payload.put("email", "a@b.com");
        payload.put("code", "1234");
        payload.put("newPassword", "newPass");
        when(userService.getResetToken("a@b.com")).thenReturn(null);
        Map<String, String> res = controller.resetPassword(payload);
        assertEquals("Invalid or expired reset code.", res.get("error"));
    }

    @Test
    @DisplayName("reset-password returns error for mismatched code")
    void resetPassword_mismatchedCode() {
        payload.put("email", "a@b.com");
        payload.put("code", "9999");
        payload.put("newPassword", "newPass");
        when(userService.getResetToken("a@b.com")).thenReturn("1234");
        Map<String, String> res = controller.resetPassword(payload);
        assertEquals("Invalid or expired reset code.", res.get("error"));
    }

    @Test
    @DisplayName("reset-password returns error when update fails")
    void resetPassword_updateFails() {
        payload.put("email", "a@b.com");
        payload.put("code", "1234");
        payload.put("newPassword", "newPass");
        when(userService.getResetToken("a@b.com")).thenReturn("1234");
        when(userService.updatePassword("a@b.com", "newPass")).thenReturn(false);
        Map<String, String> res = controller.resetPassword(payload);
        assertEquals("Failed to update password.", res.get("error"));
    }

    @Test
    @DisplayName("reset-password succeeds and clears token")
    void resetPassword_success() {
        payload.put("email", "a@b.com");
        payload.put("code", "1234");
        payload.put("newPassword", "newPass");
        when(userService.getResetToken("a@b.com")).thenReturn("1234");
        when(userService.updatePassword("a@b.com", "newPass")).thenReturn(true);

        Map<String, String> res = controller.resetPassword(payload);

        // Should clear token by saving "null" string
        verify(userService).saveResetToken("a@b.com", "null");
        assertEquals("Password updated successfully.", res.get("message"));
    }

    @Test
    @DisplayName("verify-reset-code returns error when fields missing")
    void verifyResetCode_missingFields() {
        Map<String, String> res = controller.verifyResetCode(new HashMap<>());
        assertEquals("Email and code are required.", res.get("error"));
    }

    @Test
    @DisplayName("verify-reset-code returns error when user not found")
    void verifyResetCode_userNotFound() {
        payload.put("email", "none@x.com");
        payload.put("code", "1111");
        when(userService.getUserByEmail("none@x.com")).thenReturn(null);
        Map<String, String> res = controller.verifyResetCode(payload);
        assertEquals("No account found for that email.", res.get("error"));
    }

    @Test
    @DisplayName("verify-reset-code returns error when code mismatched")
    void verifyResetCode_codeMismatch() {
        payload.put("email", "x@y.com");
        payload.put("code", "0000");
        User user = new User();
        user.setEmail("x@y.com");
        user.setEmailCodeSent("1234");
        when(userService.getUserByEmail("x@y.com")).thenReturn(user);
        Map<String, String> res = controller.verifyResetCode(payload);
        assertEquals("Invalid or expired reset code.", res.get("error"));
    }

    @Test
    @DisplayName("verify-reset-code succeeds when code matches")
    void verifyResetCode_success() {
        payload.put("email", "x@y.com");
        payload.put("code", "1234");
        User user = new User();
        user.setEmail("x@y.com");
        user.setEmailCodeSent("1234");
        when(userService.getUserByEmail("x@y.com")).thenReturn(user);
        Map<String, String> res = controller.verifyResetCode(payload);
        assertEquals("Code verified successfully.", res.get("message"));
    }
}
