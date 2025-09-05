package com.example.stored_procedures;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import static org.mockito.ArgumentMatchers.any;

import com.example.repositories.UserRepository;
import com.example.entities.User;

public class GetUserTest {

    @Mock 
    private UserRepository userRepository;

    @BeforeEach
    public void setUp(){
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetUserSuccess() throws Exception {
        Mockito.when(userRepository.findByEmail(any())).thenReturn(new User("","","",false,""));

        GetUser getUser = new GetUser(userRepository);
        User result = getUser.getUser("");
        assert(result != null);
    }

    @Test
    public void testGetUserFailure() throws Exception {
        Mockito.when(userRepository.findByEmail(any())).thenReturn(null);

        GetUser getUser = new GetUser(userRepository);
        User result = getUser.getUser("");
        assert(result == null);
    }

    @Test
    public void testGetUserException() throws Exception {
        Mockito.when(userRepository.findByEmail(any())).thenThrow();

        GetUser getUser = new GetUser(userRepository);
        User result = getUser.getUser("");
        assert(result == null);
    }
}
