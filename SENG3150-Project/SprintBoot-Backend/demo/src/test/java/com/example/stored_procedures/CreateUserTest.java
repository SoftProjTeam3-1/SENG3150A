package com.example.stored_procedures;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import static org.mockito.ArgumentMatchers.any;

import com.example.repositories.UserRepository;
import com.example.entities.User;

public class CreateUserTest {
    
    @Mock 
    private UserRepository userRepository;

    @BeforeEach
    public void setUp(){
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateUserSuccess() throws Exception {
        Mockito.when(userRepository.save(any())).thenReturn(null);

        CreateUser createUser = new CreateUser(userRepository);
        boolean result = createUser.createUser("", "", "", false, "");
        assert(result == true);
    }

    @Test
    public void testCreateUserFailure() throws Exception {
        Mockito.when(userRepository.save(any())).thenThrow();

        CreateUser createUser = new CreateUser(userRepository);
        boolean result = createUser.createUser("", "", "", false, "");
        assert(result == false);
    }

    @Test
    public void testCreateUserClass() throws Exception {
        Mockito.when(userRepository.save(any())).thenReturn(null);

        CreateUser createUser = new CreateUser(userRepository);
        boolean result = createUser.createUser(new User("", "", "", false, ""));
        assert(result == true);
    }

    @Test
    public void testCreateUserClassFailure() throws Exception {
        Mockito.when(userRepository.save(any())).thenThrow();

        CreateUser createUser = new CreateUser(userRepository);
        boolean result = createUser.createUser(new User("", "", "", false, ""));
        assert(result == false);
    }
}