package com.example.controllers;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.example.entities.User;
import com.example.entities.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class ForgotPasswordControllerTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private UserService userService;

    @InjectMocks
    private ForgotPasswordController forgotPasswordController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(forgotPasswordController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void testForgotPassword_UserExists_SendsEmailSuccessfully() throws Exception {
        // Given
        String email = "test@example.com";
        User mockUser = new User("John", "Doe", email, true, "hashedPassword");
        Map<String, String> payload = new HashMap<>();
        payload.put("email", email);

        when(userService.getUserByEmail(email)).thenReturn(mockUser);
        doNothing().when(userService).saveResetToken(eq(email), anyString());
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        // When & Then
        mockMvc.perform(post("/api/user/forgotpassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password reset code sent to " + email));

        verify(userService, times(1)).getUserByEmail(email);
        verify(userService, times(1)).saveResetToken(eq(email), anyString());
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testForgotPassword_UserDoesNotExist_ReturnsError() throws Exception {
        // Given
        String email = "nonexistent@example.com";
        Map<String, String> payload = new HashMap<>();
        payload.put("email", email);

        when(userService.getUserByEmail(email)).thenReturn(null);

        mockMvc.perform(post("/api/user/forgotpassword")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.error").value("No account found for that email."));

        verify(userService, times(1)).getUserByEmail(email);
        verify(userService, never()).saveResetToken(anyString(), anyString());
        verify(mailSender, never()).send(any(SimpleMailMessage.class));
    }

    @Test
    void testForgotPassword_EmailSendingFails_HandlesException() throws Exception {
        // Given
        String email = "test@example.com";
        User mockUser = new User("John", "Doe", email, true, "hashedPassword");
        Map<String, String> payload = new HashMap<>();
        payload.put("email", email);

        when(userService.getUserByEmail(email)).thenReturn(mockUser);
        doNothing().when(userService).saveResetToken(eq(email), anyString());
        doThrow(new RuntimeException("Email service error")).when(mailSender).send(any(SimpleMailMessage.class));

        try {
            mockMvc.perform(post("/api/user/forgotpassword")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(payload)));
        } catch (Exception e) {
            // Expected behavior
        }

        verify(userService, times(1)).getUserByEmail(email);
        verify(userService, times(1)).saveResetToken(eq(email), anyString());
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testResetPassword_ValidCode_UpdatesPasswordSuccessfully() throws Exception {
        // Given
        String email = "test@example.com";
        String code = "1234";
        String newPassword = "newPassword123";
        Map<String, String> payload = new HashMap<>();
        payload.put("email", email);
        payload.put("code", code);
        payload.put("newPassword", newPassword);

        when(userService.getResetToken(email)).thenReturn(code);
        when(userService.updatePassword(email, newPassword)).thenReturn(true);

        mockMvc.perform(post("/api/user/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password updated successfully."));

        // Verify interactions
        verify(userService, times(1)).getResetToken(email);
        verify(userService, times(1)).updatePassword(email, newPassword);
    }

    @Test
    void testResetPassword_InvalidCode_ReturnsError() throws Exception {
        // Given
        String email = "test@example.com";
        String code = "1234";
        String storedCode = "5678";
        String newPassword = "newPassword123";
        Map<String, String> payload = new HashMap<>();
        payload.put("email", email);
        payload.put("code", code);
        payload.put("newPassword", newPassword);

        when(userService.getResetToken(email)).thenReturn(storedCode);

        mockMvc.perform(post("/api/user/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.error").value("Invalid or expired reset code."));

        // Verify interactions
        verify(userService, times(1)).getResetToken(email);
        verify(userService, never()).updatePassword(anyString(), anyString());
    }

    @Test
    void testResetPassword_NoStoredCode_ReturnsError() throws Exception {
        String email = "test@example.com";
        String code = "1234";
        String newPassword = "newPassword123";
        Map<String, String> payload = new HashMap<>();
        payload.put("email", email);
        payload.put("code", code);
        payload.put("newPassword", newPassword);

        when(userService.getResetToken(email)).thenReturn(null);
        mockMvc.perform(post("/api/user/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.error").value("Invalid or expired reset code."));

        verify(userService, times(1)).getResetToken(email);
        verify(userService, never()).updatePassword(anyString(), anyString());
    }

    @Test
    @DisplayName("forgotPassword returns error when email missing")
    void testForgotPassword_missingEmail() {
        Map<String, String> payload = new HashMap<>();
        Map<String, String> resp = forgotPasswordController.forgotPassword(payload);
        assertEquals("Email is required.", resp.get("error"));
    }

    @Test
    @DisplayName("forgotPassword returns error when user not found")
    void testForgotPassword_userNotFound() {
        when(userService.getUserByEmail("nouser@example.com")).thenReturn(null);
        Map<String, String> payload = new HashMap<>();
        payload.put("email", "nouser@example.com");
        Map<String, String> resp = forgotPasswordController.forgotPassword(payload);
        assertEquals("No account found for that email.", resp.get("error"));
    }

    @Test
    @DisplayName("forgotPassword sends email and saves 4-digit code when user exists")
    void testForgotPassword_success() {
        User u = new User();
        u.setEmail("user@example.com");
        when(userService.getUserByEmail("user@example.com")).thenReturn(u);
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        Map<String, String> payload = new HashMap<>();
        payload.put("email", "user@example.com");
        Map<String, String> resp = forgotPasswordController.forgotPassword(payload);

        assertTrue(resp.get("message").contains("Password reset code sent"));

        ArgumentCaptor<String> codeCap = ArgumentCaptor.forClass(String.class);
        verify(userService).saveResetToken(eq("user@example.com"), codeCap.capture());
        assertTrue(codeCap.getValue().matches("\\d{4}"));

        ArgumentCaptor<SimpleMailMessage> msgCap = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender, times(1)).send(msgCap.capture());
        assertArrayEquals(new String[]{"user@example.com"}, msgCap.getValue().getTo());
    }

    @Test
    @DisplayName("reset-password returns error when code mismatch")
    void testResetPassword_invalidCode() {
        when(userService.getResetToken("user@example.com")).thenReturn("9999");
        Map<String, String> payload = new HashMap<>();
        payload.put("email", "user@example.com");
        payload.put("code", "1234");
        payload.put("newPassword", "newpass");
        Map<String, String> resp = forgotPasswordController.resetPassword(payload);
        assertEquals("Invalid or expired reset code.", resp.get("error"));
    }

    @Test
    @DisplayName("reset-password updates password and clears token on success")
    void testResetPassword_success() {
        when(userService.getResetToken("user@example.com")).thenReturn("1234");
        when(userService.updatePassword("user@example.com", "newpass")).thenReturn(true);

        Map<String, String> payload = new HashMap<>();
        payload.put("email", "user@example.com");
        payload.put("code", "1234");
        payload.put("newPassword", "newpass");
        Map<String, String> resp = forgotPasswordController.resetPassword(payload);

        assertEquals("Password updated successfully.", resp.get("message"));
        verify(userService).saveResetToken("user@example.com", "null");
    }

    @Test
    @DisplayName("verify-reset-code returns error when email or code missing")
    void testVerifyReset_missingFields() {
        Map<String, String> payload = new HashMap<>();
        Map<String, String> resp = forgotPasswordController.verifyResetCode(payload);
        assertEquals("Email and code are required.", resp.get("error"));
    }

    @Test
    @DisplayName("verify-reset-code returns error when user not found")
    void testVerifyReset_userNotFound() {
        when(userService.getUserByEmail("nouser@example.com")).thenReturn(null);
        Map<String, String> payload = new HashMap<>();
        payload.put("email", "nouser@example.com");
        payload.put("code", "1111");
        Map<String, String> resp = forgotPasswordController.verifyResetCode(payload);
        assertEquals("No account found for that email.", resp.get("error"));
    }

    @Test
    @DisplayName("verify-reset-code returns error when code mismatch")
    void testVerifyReset_codeMismatch() {
        User u = new User();
        u.setEmail("user@example.com");
        u.setEmailCodeSent("2222");
        when(userService.getUserByEmail("user@example.com")).thenReturn(u);
        Map<String, String> payload = new HashMap<>();
        payload.put("email", "user@example.com");
        payload.put("code", "1111");
        Map<String, String> resp = forgotPasswordController.verifyResetCode(payload);
        assertEquals("Invalid or expired reset code.", resp.get("error"));
    }

    @Test
    @DisplayName("verify-reset-code success when code matches")
    void testVerifyReset_success() {
        User u = new User();
        u.setEmail("user@example.com");
        u.setEmailCodeSent("1111");
        when(userService.getUserByEmail("user@example.com")).thenReturn(u);
        Map<String, String> payload = new HashMap<>();
        payload.put("email", "user@example.com");
        payload.put("code", "1111");
        Map<String, String> resp = forgotPasswordController.verifyResetCode(payload);
        assertEquals("Code verified successfully.", resp.get("message"));
    }
}