package com.example.responses;

import org.junit.jupiter.api.Test;

public class AddSessionActivityResponseTest {
    
    private AddSessionActivityResponse response = new AddSessionActivityResponse("Yes", true);
    
    @Test
    public void getMessage(){
        assert(response.getMessage().equals("Yes"));
    }

    @Test
    public void setMessage(){
        response.setMessage("No");
        assert(!response.getMessage().equals("Yes"));
        assert(response.getMessage().equals("No"));
    }

    @Test
    public void getResponse(){
        assert(response.isResponse()==true);
    }

    @Test
    public void setResponse(){
        response.setResponse(false);
        assert(response.isResponse()!=true);
        assert(response.isResponse()==false);
    }
}
