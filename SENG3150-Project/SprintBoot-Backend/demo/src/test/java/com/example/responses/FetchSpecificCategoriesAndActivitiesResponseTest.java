package com.example.responses;

import com.example.entities.Activity;
import com.example.entities.SessionActivity;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;

public class FetchSpecificCategoriesAndActivitiesResponseTest {
    
    private FetchSpecificCategoriesAndActivitiesResponse response = 
        new FetchSpecificCategoriesAndActivitiesResponse("type", new ArrayList<Activity>());

    @Test
    public void getType(){
        assert(response.getActivityType()=="type");
    }

    @Test
    public void setType(){
        response.setActivityType("new type");
        assert(!response.getActivityType().equals("type"));
        assert(response.getActivityType().equals("new type"));
    }

    @Test
    public void getList(){
        assert(response.getActivities().equals(new ArrayList<Activity>()));
    }

    @Test
    public void setList(){
        ArrayList<Activity> newList = new ArrayList<>();
        newList.add(new Activity());
        response.setActivities(newList);

        assert(response.getActivities().equals(newList));
    } 
}
