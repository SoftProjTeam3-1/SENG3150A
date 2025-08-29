// package com.example.controllers;

// import com.example.entities.User;
// import com.example.entities.UserService;
// import com.fasterxml.jackson.databind.ObjectMapper;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;
// import org.springframework.http.MediaType;
// import org.springframework.mail.SimpleMailMessage;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.test.web.servlet.MockMvc;
// import org.springframework.test.web.servlet.setup.MockMvcBuilders;

// import java.util.HashMap;
// import java.util.Map;

// import static org.mockito.ArgumentMatchers.*;
// import static org.mockito.Mockito.*;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// @ExtendWith(MockitoExtension.class)
// class ForgotPasswordControllerTest {

//     @Mock
//     private JavaMailSender mailSender;

//     @Mock
//     private UserService userService;

//     @InjectMocks
//     private ForgotPasswordController forgotPasswordController;

//     private MockMvc mockMvc;
//     private ObjectMapper objectMapper;

//     @BeforeEach
//     void setUp() {
//         mockMvc = MockMvcBuilders.standaloneSetup(forgotPasswordController).build();
//         objectMapper = new ObjectMapper();
//     }

//     @Test
//     void testForgotPassword_UserExists_SendsEmailSuccessfully() throws Exception {
//         // Given
//         String email = "test@example.com";
//         User mockUser = new User("John", "Doe", email, true, "hashedPassword");
//         Map<String, String> payload = new HashMap<>();
//         payload.put("email", email);

//         when(userService.getUser(email)).thenReturn(mockUser);
//         doNothing().when(userService).saveResetToken(eq(email), anyString());
//         doNothing().when(mailSender).send(any(SimpleMailMessage.class));

//         // When & Then
//         mockMvc.perform(post("/api/user/forgotpassword")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(objectMapper.writeValueAsString(payload)))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.message").value("Password reset code sent to " + email));

//         verify(userService, times(1)).getUser(email);
//         verify(userService, times(1)).saveResetToken(eq(email), anyString());
//         verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
//     }

//     @Test
//     void testForgotPassword_UserDoesNotExist_ReturnsError() throws Exception {
//         // Given
//         String email = "nonexistent@example.com";
//         Map<String, String> payload = new HashMap<>();
//         payload.put("email", email);

//         when(userService.getUser(email)).thenReturn(null);

//         mockMvc.perform(post("/api/user/forgotpassword")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(objectMapper.writeValueAsString(payload)))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.error").value("No account found for that email."));

//         verify(userService, times(1)).getUser(email);
//         verify(userService, never()).saveResetToken(anyString(), anyString());
//         verify(mailSender, never()).send(any(SimpleMailMessage.class));
//     }

//     @Test
//     void testForgotPassword_EmailSendingFails_HandlesException() throws Exception {
//         // Given
//         String email = "test@example.com";
//         User mockUser = new User("John", "Doe", email, true, "hashedPassword");
//         Map<String, String> payload = new HashMap<>();
//         payload.put("email", email);

//         when(userService.getUser(email)).thenReturn(mockUser);
//         doNothing().when(userService).saveResetToken(eq(email), anyString());
//         doThrow(new RuntimeException("Email service error")).when(mailSender).send(any(SimpleMailMessage.class));

//         try {
//             mockMvc.perform(post("/api/user/forgotpassword")
//                     .contentType(MediaType.APPLICATION_JSON)
//                     .content(objectMapper.writeValueAsString(payload)));
//         } catch (Exception e) {
//             // Expected behavior
//         }

//         verify(userService, times(1)).getUser(email);
//         verify(userService, times(1)).saveResetToken(eq(email), anyString());
//         verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
//     }

//     @Test
//     void testResetPassword_ValidCode_UpdatesPasswordSuccessfully() throws Exception {
//         // Given
//         String email = "test@example.com";
//         String code = "1234";
//         String newPassword = "newPassword123";
//         Map<String, String> payload = new HashMap<>();
//         payload.put("email", email);
//         payload.put("code", code);
//         payload.put("newPassword", newPassword);

//         when(userService.getResetToken(email)).thenReturn(code);
//         when(userService.updatePassword(email, newPassword)).thenReturn(true);

//         mockMvc.perform(post("/api/user/reset-password")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(objectMapper.writeValueAsString(payload)))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.message").value("Password updated successfully."));

//         // Verify interactions
//         verify(userService, times(1)).getResetToken(email);
//         verify(userService, times(1)).updatePassword(email, newPassword);
//     }

//     @Test
//     void testResetPassword_InvalidCode_ReturnsError() throws Exception {
//         // Given
//         String email = "test@example.com";
//         String code = "1234";
//         String storedCode = "5678";
//         String newPassword = "newPassword123";
//         Map<String, String> payload = new HashMap<>();
//         payload.put("email", email);
//         payload.put("code", code);
//         payload.put("newPassword", newPassword);

//         when(userService.getResetToken(email)).thenReturn(storedCode);

//         mockMvc.perform(post("/api/user/reset-password")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(objectMapper.writeValueAsString(payload)))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.error").value("Invalid or expired reset code."));

//         // Verify interactions
//         verify(userService, times(1)).getResetToken(email);
//         verify(userService, never()).updatePassword(anyString(), anyString());
//     }

//     @Test
//     void testResetPassword_NoStoredCode_ReturnsError() throws Exception {
//         String email = "test@example.com";
//         String code = "1234";
//         String newPassword = "newPassword123";
//         Map<String, String> payload = new HashMap<>();
//         payload.put("email", email);
//         payload.put("code", code);
//         payload.put("newPassword", newPassword);

//         when(userService.getResetToken(email)).thenReturn(null);
//         mockMvc.perform(post("/api/user/reset-password")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(objectMapper.writeValueAsString(payload)))
//                 .andExpect(status().isOk())
//                 .andExpect(jsonPath("$.error").value("Invalid or expired reset code."));

//         verify(userService, times(1)).getResetToken(email);
//         verify(userService, never()).updatePassword(anyString(), anyString());
//     }

 
// }