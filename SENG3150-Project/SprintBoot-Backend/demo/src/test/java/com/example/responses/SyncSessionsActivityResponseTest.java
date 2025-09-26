package com.example.responses;

import org.junit.jupiter.api.Test;

public class SyncSessionsActivityResponseTest {

    private SyncSessionsActivityResponse response = new SyncSessionsActivityResponse(Integer.valueOf(1), 
        "name", 
        "description",
        Integer.valueOf(10),
        "category",
        2);

    @Test
    public void getId(){
        assert(response.getSessionActivityID()==Integer.valueOf(1));
    }

    @Test
    public void setId(){
        response.setSessionActivityID(Integer.valueOf(2));
        assert(response.getSessionActivityID()!=Integer.valueOf(1));
        assert(response.getSessionActivityID()==Integer.valueOf(2));
    }

    @Test
    public void getName(){
        assert(response.getName().equals("name"));
    }

    @Test
    public void setName(){
        response.setName("other name");
        assert(!response.getName().equals("name"));
        assert(response.getName().equals("other name"));
    }

    @Test 
    public void getDescription(){
        assert(response.getDescription().equals("description"));
    }

    @Test
    public void setDescription(){
        response.setDescription("new description");
        assert(!response.getDescription().equals("description"));
        assert(response.getDescription().equals("new description"));
    }

    @Test
    public void getDuration(){
        assert(response.getDuration()==Integer.valueOf(10));
    }

    @Test
    public void setDuration(){
        response.setDuration(Integer.valueOf(25));
        assert(response.getDuration()!=Integer.valueOf(10));
        assert(response.getDuration()==Integer.valueOf(25));
    }

    @Test 
    public void getCategory(){
        assert(response.getCategory().equals("category"));
    }

    @Test
    public void setCategory(){
        response.setCategory("new category");
        assert(!response.getCategory().equals("category"));
        assert(response.getCategory().equals("new category"));
    }

    @Test
    public void getRow(){
        assert(response.getRow()==2);
    }

    @Test
    public void setRow(){
        response.setRow(1);
        assert(response.getRow()!=2);
        assert(response.getRow()==1);
    }
}
