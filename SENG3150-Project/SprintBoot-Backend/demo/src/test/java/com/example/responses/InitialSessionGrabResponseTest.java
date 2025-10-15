package com.example.responses;

import com.example.entities.Session;
import com.example.entities.SessionActivity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.ArrayList;
import java.sql.Date;

public class InitialSessionGrabResponseTest {
    
    private InitialSessionGrabResponse response = new InitialSessionGrabResponse(new Session(), 
    new ArrayList<Session>(), 
    "message", 
    true);

    @Test
    public void getGameSession() {
        Session actualSession = response.getGameSession();
        assertNotNull(actualSession);
    }

    @Test
    public void setGameSession(){
        Session edittedSession = response.getGameSession();
        edittedSession.setDate(new Date(1746118800000L));
        response.setGameSession(edittedSession);

        assert(response.getGameSession().equals(edittedSession));
    }

@Test
    public void getList(){
        assert(response.getTrainingSessions().equals(new ArrayList<>()));
    }

    @Test
    public void setList(){
        ArrayList<Session> newList = new ArrayList<>();
        newList.add(new Session());
        response.setTrainingSessions(newList);

        assert(response.getTrainingSessions().equals(newList));
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
