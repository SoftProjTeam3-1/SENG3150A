package com.example.entities;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.repositories.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceResetPasswordTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("updatePassword returns true and saves updated password when user exists")
    void updatePassword_success() {
        String email = "user@example.com";
        User user = new User();
        user.setEmail(email);
        user.setPassword("old");
        when(userRepository.findByEmail(email)).thenReturn(user);

        boolean result = userService.updatePassword(email, "newPass");

        assertTrue(result);
        ArgumentCaptor<User> saved = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).save(saved.capture());
        assertEquals("newPass", saved.getValue().getPassword());
    }

    @Test
    @DisplayName("updatePassword returns false when user not found")
    void updatePassword_userNotFound() {
        String email = "missing@example.com";
        when(userRepository.findByEmail(email)).thenReturn(null);

        boolean result = userService.updatePassword(email, "newPass");

        assertFalse(result);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("saveResetToken sets token and recipient then persists when user exists")
    void saveResetToken_userExists() {
        String email = "user@example.com";
        User user = new User();
        user.setEmail(email);
        when(userRepository.findByEmail(email)).thenReturn(user);

        userService.saveResetToken(email, "1234");

        ArgumentCaptor<User> saved = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(saved.capture());
        User savedUser = saved.getValue();
        assertEquals("1234", savedUser.getEmailCodeSent());
        assertEquals(email, savedUser.getEmailCodeSentTo());
    }

    @Test
    @DisplayName("saveResetToken is no-op when user missing")
    void saveResetToken_userMissing() {
        String email = "missing@example.com";
        when(userRepository.findByEmail(email)).thenReturn(null);

        userService.saveResetToken(email, "9999");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("getResetToken returns token when user exists")
    void getResetToken_exists() {
        String email = "user@example.com";
        User user = new User();
        user.setEmail(email);
        user.setEmailCodeSent("5555");
        when(userRepository.findByEmail(email)).thenReturn(user);

        String token = userService.getResetToken(email);
        assertEquals("5555", token);
    }

    @Test
    @DisplayName("getResetToken returns null when user missing")
    void getResetToken_missing() {
        when(userRepository.findByEmail("none@example.com")).thenReturn(null);
        String token = userService.getResetToken("none@example.com");
        assertNull(token);
    }
}
