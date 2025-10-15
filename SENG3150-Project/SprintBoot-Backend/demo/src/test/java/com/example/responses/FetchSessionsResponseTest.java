package com.example.responses;

import com.example.entities.SessionType;
import com.example.entities.SessionActivity;

import java.sql.Date;
import java.util.ArrayList;

import org.junit.jupiter.api.Test;

public class FetchSessionsResponseTest {
    
    private FetchSessionsResponse responseDefault = new FetchSessionsResponse();
    //constructor
    private FetchSessionsResponse response = new FetchSessionsResponse(1, 
        new Date(1746118800000L), 
        new SessionType("", ""),
        new ArrayList<>(),
        new ArrayList<>());

@Test
    public void getId(){
        assert(response.getSessionID()==1);
    }

    @Test
    public void setId(){
        response.setSessionID(2);
        assert(response.getSessionID()!=1);
        assert(response.getSessionID()==2);
    }

    @Test
    public void getDate(){
        assert(response.getDate().equals(new Date(1746118800000L)));
    }

    @Test
    public void setDate(){
        response.setDate(new Date(1746118800001L));
        assert(!response.getDate().equals(new Date(1746118800000L)));
        assert(response.getDate().equals(new Date(1746118800001L)));
    }

    @Test
    public void getSessionType(){
        assert(response.getSessionTypeId().equals(""));
    }


    @Test
    public void setSessionType(){
        response.setSessionTypeId("new name");
        assert(!response.getSessionTypeId().equals("name"));
        assert(response.getSessionTypeId().equals("new name"));
    }

    @Test
    public void getList(){
        assert(response.getActivities().equals(new ArrayList<>()));
    }

    @Test
    public void setList(){
        ArrayList<SessionActivity> newList = new ArrayList<>();
        newList.add(new SessionActivity());
        response.setActivities(newList);

        assert(response.getActivities().equals(newList));
    } 
}
