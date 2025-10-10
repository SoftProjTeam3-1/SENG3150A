package com.example.responses;

import org.junit.jupiter.api.Test;

public class RegisterResponseTest {
    
    private RegisterResponse responseDefault = new RegisterResponse();
    private RegisterResponse response = new RegisterResponse(true, "message");

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
}
