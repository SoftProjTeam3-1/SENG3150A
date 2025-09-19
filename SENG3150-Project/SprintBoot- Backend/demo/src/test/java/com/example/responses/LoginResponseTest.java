package com.example.responses;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.example.entities.User;



public class LoginResponseTest {
    
    private LoginResponse response = new LoginResponse(true, "message", new User());
    private LoginResponse responseDefault = new LoginResponse();

    @Test
    public void getResponse(){
        assert(response.isResponse()==true);
    }

    @Test
    public void setResponse(){
        response.setResponse(false);
        assert(!response.isResponse()==true);
        assert(response.isResponse()==false);
    }

    @Test
    public void getMessage(){
        assert(response.getMessage().equals("message"));
    }

    @Test
    public void setMessage(){
        response.setMessage("new message");
        assert(!response.getMessage().equals("message"));
        assert(response.getMessage().equals("new message"));
    }

    @Test
    public void getUser(){
        assertNotNull(response.getUser());
    }

    @Test
    public void setUser(){
        User newUser = new User();
        newUser.setFirstName("fName");
        response.setUser(newUser);

        assert(!response.getUser().equals(new User()));
        assert(response.getUser().equals(newUser));
    }
}
