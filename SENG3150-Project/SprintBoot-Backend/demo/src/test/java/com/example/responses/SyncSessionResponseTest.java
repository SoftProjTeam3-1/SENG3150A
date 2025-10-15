package com.example.responses;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;

public class SyncSessionResponseTest {
    //int date int list
    private SyncSessionsResponse responseDefault = new SyncSessionsResponse();
    private SyncSessionsResponse response = new SyncSessionsResponse(1,
        new Date(1746118800000L),
        2,
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
    public void getSessionTypeId(){
        assert(response.getSessionTypeId()==2);
    }

    @Test
    public void setSessionTypeId(){
        response.setSessionTypeId(1);
        assert(response.getSessionTypeId()!=2);
        assert(response.getSessionTypeId()==1);
    }

    @Test
    public void getList(){
        assert(response.getActivities().equals(new ArrayList<>()));
    }

    @Test
    public void setList(){
        ArrayList<SyncSessionsActivityResponse> newList = new ArrayList<>();
        newList.add(new SyncSessionsActivityResponse());
        response.setActivities(newList);

        assert(response.getActivities().equals(newList));
    }
}
