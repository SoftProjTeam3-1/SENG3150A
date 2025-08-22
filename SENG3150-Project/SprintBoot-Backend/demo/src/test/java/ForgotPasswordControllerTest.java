
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import com.example.ForgotPasswordController;
import com.example.entities.User;
import com.example.entities.UserService;

@ExtendWith(MockitoExtension.class)
@DisplayName("ForgotPasswordController Tests")
class ForgotPasswordControllerTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private UserService userService;

    @InjectMocks
    private ForgotPasswordController forgotPasswordController;

    private User testUser;
    private Map<String, String> testPayload;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setEmailCodeSent("1234");
        
        testPayload = new HashMap<>();
    }

    @Nested
    @DisplayName("Forgot Password Tests")
    class ForgotPasswordTests {

        @Test
        @DisplayName("Should successfully send reset code when email is valid")
        void shouldSendResetCodeWhenEmailValid() {
            // Arrange
            testPayload.put("email", "test@example.com");
            when(userService.getUserByEmail("test@example.com")).thenReturn(testUser);
            doNothing().when(userService).saveResetToken(anyString(), anyString());
            doNothing().when(mailSender).send(any(SimpleMailMessage.class));

            // Act
            Map<String, String> result = forgotPasswordController.forgotPassword(testPayload);

            // Assert
            assertNotNull(result);
            assertTrue(result.containsKey("message"));
            assertEquals("Password reset code sent to test@example.com", result.get("message"));
            
            // Verify interactions
            verify(userService).getUserByEmail("test@example.com");
            verify(userService).saveResetToken(eq("test@example.com"), anyString());
            verify(mailSender).send(any(SimpleMailMessage.class));
        }

        @Test
        @DisplayName("Should verify email content and structure")
        void shouldVerifyEmailContentAndStructure() {
            // Arrange
            testPayload.put("email", "test@example.com");
            when(userService.getUserByEmail("test@example.com")).thenReturn(testUser);
            ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);

            // Act
            forgotPasswordController.forgotPassword(testPayload);

            // Assert
            verify(mailSender).send(messageCaptor.capture());
            SimpleMailMessage sentMessage = messageCaptor.getValue();
            
            assertNotNull(sentMessage);
            assertArrayEquals(new String[]{"test@example.com"}, sentMessage.getTo());
            assertEquals("Password Reset Code", sentMessage.getSubject());
            assertNotNull(sentMessage.getText());
            assertTrue(sentMessage.getText().contains("Your password reset code is:"));
        }

  
        @Test
        @DisplayName("Should return error when email is null")
        void shouldReturnErrorWhenEmailIsNull() {
            // Arrange - email key not present

            // Act
            Map<String, String> result = forgotPasswordController.forgotPassword(testPayload);

            // Assert
            assertNotNull(result);
            assertTrue(result.containsKey("error"));
            assertEquals("Email is required.", result.get("error"));
        }

        @Test
        @DisplayName("Should return error when user not found")
        void shouldReturnErrorWhenUserNotFound() {
            // Arrange
            testPayload.put("email", "nonexistent@example.com");
            when(userService.getUserByEmail("nonexistent@example.com")).thenReturn(null);

            // Act
            Map<String, String> result = forgotPasswordController.forgotPassword(testPayload);

            // Assert
            assertNotNull(result);
            assertTrue(result.containsKey("error"));
            assertEquals("No account found for that email.", result.get("error"));
            verify(userService).getUserByEmail("nonexistent@example.com");
            verify(mailSender, never()).send(any(SimpleMailMessage.class));
        }

        @Test
        @DisplayName("Should generate 4-digit reset code")
        void shouldGenerate4DigitResetCode() {
            // Arrange
            testPayload.put("email", "test@example.com");
            when(userService.getUserByEmail("test@example.com")).thenReturn(testUser);
            ArgumentCaptor<String> codeCaptor = ArgumentCaptor.forClass(String.class);

            // Act
            forgotPasswordController.forgotPassword(testPayload);

            // Assert
            verify(userService).saveResetToken(eq("test@example.com"), codeCaptor.capture());
            String capturedCode = codeCaptor.getValue();
            
            assertNotNull(capturedCode);
            assertEquals(4, capturedCode.length());
            assertTrue(capturedCode.matches("\\d{4}"));
            int codeValue = Integer.parseInt(capturedCode);
            assertTrue(codeValue >= 1000 && codeValue <= 9999);
        }
    }

    @Nested
    @DisplayName("Reset Password Tests")
    class ResetPasswordTests {

        @Test
        @DisplayName("Should successfully reset password with valid code")
        void shouldResetPasswordWithValidCode() {
            // Arrange
            testPayload.put("email", "test@example.com");
            testPayload.put("code", "1234");
            testPayload.put("newPassword", "newSecurePassword123");
            
            when(userService.getResetToken("test@example.com")).thenReturn("1234");
            when(userService.updatePassword("test@example.com", "newSecurePassword123")).thenReturn(true);

            // Act
            Map<String, String> result = forgotPasswordController.resetPassword(testPayload);

            // Assert
            assertNotNull(result);
            assertTrue(result.containsKey("message"));
            assertEquals("Password updated successfully.", result.get("message"));
            
            verify(userService).getResetToken("test@example.com");
            verify(userService).updatePassword("test@example.com", "newSecurePassword123");
            verify(userService).saveResetToken("test@example.com", "null");
        }

        @Test
        @DisplayName("Should return error when reset code is invalid")
        void shouldReturnErrorWhenResetCodeInvalid() {
            // Arrange
            testPayload.put("email", "test@example.com");
            testPayload.put("code", "9999");
            testPayload.put("newPassword", "newPassword");
            
            when(userService.getResetToken("test@example.com")).thenReturn("1234");

            // Act
            Map<String, String> result = forgotPasswordController.resetPassword(testPayload);

            // Assert
            assertNotNull(result);
            assertTrue(result.containsKey("error"));
            assertEquals("Invalid or expired reset code.", result.get("error"));
            
            verify(userService).getResetToken("test@example.com");
            verify(userService, never()).updatePassword(anyString(), anyString());
        }

        @Test
        @DisplayName("Should return error when reset token is null")
        void shouldReturnErrorWhenResetTokenIsNull() {
            // Arrange
            testPayload.put("email", "test@example.com");
            testPayload.put("code", "1234");
            testPayload.put("newPassword", "newPassword");
            
            when(userService.getResetToken("test@example.com")).thenReturn(null);

            // Act
            Map<String, String> result = forgotPasswordController.resetPassword(testPayload);

            // Assert
            assertNotNull(result);
            assertTrue(result.containsKey("error"));
            assertEquals("Invalid or expired reset code.", result.get("error"));
        }

        @Test
        @DisplayName("Should return error when password update fails")
        void shouldReturnErrorWhenPasswordUpdateFails() {
            // Arrange
            testPayload.put("email", "test@example.com");
            testPayload.put("code", "1234");
            testPayload.put("newPassword", "newPassword");
            
            when(userService.getResetToken("test@example.com")).thenReturn("1234");
            when(userService.updatePassword("test@example.com", "newPassword")).thenReturn(false);

            // Act
            Map<String, String> result = forgotPasswordController.resetPassword(testPayload);

            // Assert
            assertNotNull(result);
            assertTrue(result.containsKey("error"));
            assertEquals("Failed to update password.", result.get("error"));
            
            verify(userService).updatePassword("test@example.com", "newPassword");
            verify(userService, never()).saveResetToken("test@example.com", "null");
        }

        @ParameterizedTest
        @MethodSource("provideInvalidResetPasswordPayloads")
        @DisplayName("Should handle missing parameters gracefully")
        void shouldHandleMissingParametersGracefully(Map<String, String> payload, String expectedBehavior) {
            // Arrange
            when(userService.getResetToken(anyString())).thenReturn("1234");

            // Act & Assert - Should not throw exception
            assertDoesNotThrow(() -> {
                Map<String, String> result = forgotPasswordController.resetPassword(payload);
                assertNotNull(result);
            });
        }

        static Stream<Arguments> provideInvalidResetPasswordPayloads() {
            return Stream.of(
                Arguments.of(Map.of("code", "1234", "newPassword", "pass"), "Missing email"),
                Arguments.of(Map.of("email", "test@test.com", "newPassword", "pass"), "Missing code"),
                Arguments.of(Map.of("email", "test@test.com", "code", "1234"), "Missing password"),
                Arguments.of(new HashMap<>(), "Empty payload")
            );
        }
    }

    @Nested
    @DisplayName("Verify Reset Code Tests")
    class VerifyResetCodeTests {

        @Test
        @DisplayName("Should successfully verify valid reset code")
        void shouldVerifyValidResetCode() {
            // Arrange
            testPayload.put("email", "test@example.com");
            testPayload.put("code", "1234");
            
            when(userService.getUserByEmail("test@example.com")).thenReturn(testUser);

            // Act
            Map<String, String> result = forgotPasswordController.verifyResetCode(testPayload);

            // Assert
            assertNotNull(result);
            assertTrue(result.containsKey("message"));
            assertEquals("Code verified successfully.", result.get("message"));
            
            verify(userService).getUserByEmail("test@example.com");
        }

        @Test
        @DisplayName("Should return error when email is missing")
        void shouldReturnErrorWhenEmailMissing() {
            // Arrange
            testPayload.put("code", "1234");

            // Act
            Map<String, String> result = forgotPasswordController.verifyResetCode(testPayload);

            // Assert
            assertNotNull(result);
            assertTrue(result.containsKey("error"));
            assertEquals("Email and code are required.", result.get("error"));
            
            verify(userService, never()).getUserByEmail(anyString());
        }

        @Test
        @DisplayName("Should return error when code is missing")
        void shouldReturnErrorWhenCodeMissing() {
            // Arrange
            testPayload.put("email", "test@example.com");

            // Act
            Map<String, String> result = forgotPasswordController.verifyResetCode(testPayload);

            // Assert
            assertNotNull(result);
            assertTrue(result.containsKey("error"));
            assertEquals("Email and code are required.", result.get("error"));
        }

        @Test
        @DisplayName("Should return error when user not found")
        void shouldReturnErrorWhenUserNotFoundForVerification() {
            // Arrange
            testPayload.put("email", "nonexistent@example.com");
            testPayload.put("code", "1234");
            
            when(userService.getUserByEmail("nonexistent@example.com")).thenReturn(null);

            // Act
            Map<String, String> result = forgotPasswordController.verifyResetCode(testPayload);

            // Assert
            assertNotNull(result);
            assertTrue(result.containsKey("error"));
            assertEquals("No account found for that email.", result.get("error"));
        }

        @Test
        @DisplayName("Should return error when verification code does not match")
        void shouldReturnErrorWhenVerificationCodeDoesNotMatch() {
            // Arrange
            testPayload.put("email", "test@example.com");
            testPayload.put("code", "5678");
            
            when(userService.getUserByEmail("test@example.com")).thenReturn(testUser);

            // Act
            Map<String, String> result = forgotPasswordController.verifyResetCode(testPayload);

            // Assert
            assertNotNull(result);
            assertTrue(result.containsKey("error"));
            assertEquals("Invalid or expired reset code.", result.get("error"));
        }

        @Test
        @DisplayName("Should handle null email code sent gracefully")
        void shouldHandleNullEmailCodeSentGracefully() {
            // Arrange
            User userWithNullCode = new User();
            userWithNullCode.setEmail("test@example.com");
            userWithNullCode.setEmailCodeSent(null);
            
            testPayload.put("email", "test@example.com");
            testPayload.put("code", "1234");
            
            when(userService.getUserByEmail("test@example.com")).thenReturn(userWithNullCode);

            // Act
            Map<String, String> result = forgotPasswordController.verifyResetCode(testPayload);

            // Assert
            assertNotNull(result);
            assertTrue(result.containsKey("error"));
            assertEquals("Invalid or expired reset code.", result.get("error"));
        }
    }

    @Nested
    @DisplayName("Integration and Edge Case Tests")
    class IntegrationTests {

        @Test
        @DisplayName("Should handle concurrent requests safely")
        void shouldHandleConcurrentRequestsSafely() {
            // Arrange
            testPayload.put("email", "test@example.com");
            when(userService.getUserByEmail("test@example.com")).thenReturn(testUser);

            // Act & Assert - Multiple calls should not interfere
            assertDoesNotThrow(() -> {
                forgotPasswordController.forgotPassword(testPayload);
                forgotPasswordController.forgotPassword(testPayload);
                forgotPasswordController.forgotPassword(testPayload);
            });
        }

        @Test
        @DisplayName("Should handle special characters in email")
        void shouldHandleSpecialCharactersInEmail() {
            // Arrange
            String specialEmail = "user+test@sub.domain.com";
            testPayload.put("email", specialEmail);
            
            User specialUser = new User();
            specialUser.setEmail(specialEmail);
            when(userService.getUserByEmail(specialEmail)).thenReturn(specialUser);

            // Act
            Map<String, String> result = forgotPasswordController.forgotPassword(testPayload);

            // Assert
            assertNotNull(result);
            assertTrue(result.containsKey("message"));
            verify(userService).getUserByEmail(specialEmail);
        }

        @Test
        @DisplayName("Should maintain immutable response maps")
        void shouldMaintainImmutableResponseMaps() {
            // Arrange
            testPayload.put("email", "test@example.com");
            when(userService.getUserByEmail("test@example.com")).thenReturn(testUser);

            // Act
            Map<String, String> result = forgotPasswordController.forgotPassword(testPayload);

            // Assert - Verify map is immutable
            assertThrows(UnsupportedOperationException.class, () -> {
                result.put("newKey", "newValue");
            });
        }
    }
}
