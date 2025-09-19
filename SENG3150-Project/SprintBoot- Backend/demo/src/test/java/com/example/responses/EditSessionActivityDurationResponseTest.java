package com.example.responses;

import org.junit.jupiter.api.Test;

public class EditSessionActivityDurationResponseTest {

    private EditSessionActivityDurationResponse response = new EditSessionActivityDurationResponse("message", true);

    @Test
    public void getResponse(){
        assert(response.isSuccess()==true);
    }

    @Test
    public void setResponse(){
        response.setSuccess(false);
        assert(!response.isSuccess()==true);
        assert(response.isSuccess()==false);
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
