package com.example.entities;

import com.example.repositories.UserRepository;
import com.example.stored_procedures.CreateUser;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockConstruction;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedConstruction;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doNothing;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    private UserRepository userRepository = mock(UserRepository.class);
    
    private UserService userService = new UserService(userRepository);

    /*
     * REGISTER SERVICE TESTS
     */

    @Test
    public void registerUser_success() {
        User newUser = new User();

        try (MockedConstruction<CreateUser> mocked = mockConstruction(CreateUser.class,
                (mock, context) -> when(mock.createUser(any(User.class))).thenReturn(true))) {

            boolean result = userService.registerUser(newUser);

            assert(result); // passes
            verify(mocked.constructed().get(0)).createUser(any(User.class));
        }
    }

    @Test
    public void registerUser_failure(){
        User newUser = new User();

        try (MockedConstruction<CreateUser> mocked = mockConstruction(CreateUser.class,
                (mock, context) -> when(mock.createUser(any(User.class))).thenReturn(false))) {

            boolean result = userService.registerUser(newUser);

            assert(!result);
            verify(mocked.constructed().get(0)).createUser(any(User.class));
        }  
    }

    /*
     * GET USER BY EMAIL
     */

    @Test
    public void getUser(){
        when(userRepository.findByEmail(any(String.class))).thenReturn(new User());

        User result = userService.getUser("");
        assertNotNull(result);
    }

    @Test
    public void getUserByEmail(){
        when(userRepository.findByEmail(any(String.class))).thenReturn(new User());

        User result = userService.getUserByEmail("");
        assertNotNull(result);
    }

    /*
     * UPDATE PASSWORD
     * SUCCESS AND FAILED
     */

    @Test
    public void updatePassword_success(){
        when(userRepository.findByEmail(any(String.class))).thenReturn(new User());
        when(userRepository.save(any(User.class))).thenReturn(new User());

        boolean result = userService.updatePassword("", "new password");
        assert(result);
    }

    @Test
    public void updatePassword_failure(){
        when(userRepository.findByEmail(any(String.class))).thenReturn(null);

        boolean result = userService.updatePassword("", "new password");
        assert(!result);
    }

    /*
     * save success
     */
    @Test
    public void saveUser(){
        when(userRepository.save(any(User.class))).thenReturn(new User());
        
        userService.save(new User());
    }

    /*
     * getUserbyId
     * success
     * failure
     */

    @Test
    public void getUserById(){
        when(userRepository.findById(anyInt())).thenReturn(new User());

        User result = userService.getUserByID(1);
        assertNotNull(result);
    }

    @Test
    public void getUserById_failure(){
        when(userRepository.findById(any(Integer.class))).thenReturn(null);

        User result = userService.getUserByID(1);
        assertNull(result);    
    }

    /*
     * reset token 
     * success
     */

    @Test
    public void saveResetToken_success(){
        when(userRepository.findByEmail(any(String.class))).thenReturn(new User());

        userService.saveResetToken("null", "");
    }

    /*
     * GET TOKEN
     * success
     * failure
     */

    @Test
    public void getToken_success(){
        User testUser = new User();
        testUser.setEmailCodeSent("ooft");
        when(userRepository.findByEmail(any(String.class))).thenReturn(testUser);

        String result = userService.getResetToken("");
        assertNotNull(result);
        assert(result.equals("ooft"));
    }

    @Test
    public void getToken_failure(){
        when(userRepository.findByEmail(any(String.class))).thenReturn(null);

        String result = userService.getResetToken("");
        assertNull(result);
    }
}
