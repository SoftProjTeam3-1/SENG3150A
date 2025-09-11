package com.example.stored_procedures;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import static org.mockito.ArgumentMatchers.any;

import com.example.repositories.UserRepository;
import com.example.entities.User;

public class ValidateUserTest {

    @Mock 
    private UserRepository userRepository;

    @BeforeEach
    public void setUp(){
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    public void testValidateUserSuccess() throws Exception {
        Mockito.when(userRepository.findByEmail(any())).thenReturn(new User("","","",false,""));

        ValidateUser validateUser = new ValidateUser(userRepository);
        boolean result = validateUser.validateUser("", "");
        assert(result == true);
    }

    @Test
    public void testValidateUserFailure() throws Exception {
        Mockito.when(userRepository.findByEmail(any())).thenReturn(null);

        ValidateUser validateUser = new ValidateUser(userRepository);
        boolean result = validateUser.validateUser("", "");
        assert(result == false);
    }
}
