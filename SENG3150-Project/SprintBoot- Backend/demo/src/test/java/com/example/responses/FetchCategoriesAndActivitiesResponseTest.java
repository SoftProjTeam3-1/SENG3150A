package com.example.responses;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.ArrayList;

public class FetchCategoriesAndActivitiesResponseTest {
    
    private FetchCategoriesAndActivitiesResponse response = new FetchCategoriesAndActivitiesResponse();

    @Test
    public void addToList(){
        int size = response.fetchSpecificCategoriesAndActivitiesResponseList.size();
        FetchSpecificCategoriesAndActivitiesResponse containedResponse = new FetchSpecificCategoriesAndActivitiesResponse(
            "type", new ArrayList<>()
        );

        response.addToList(containedResponse);
        assert(response.fetchSpecificCategoriesAndActivitiesResponseList.size()==size+1);
    }

    @Test
    public void getList(){
        assert(response.getFetchSpecificCategoriesAndActivitiesResponseList().equals(
            response.fetchSpecificCategoriesAndActivitiesResponseList));
    }

    @Test
    public void setList(){
        ArrayList<FetchSpecificCategoriesAndActivitiesResponse> newList = 
            new ArrayList<>();
        
        FetchSpecificCategoriesAndActivitiesResponse containedResponse = 
            new FetchSpecificCategoriesAndActivitiesResponse(
            "type", new ArrayList<>());
        
        newList.add(containedResponse);

        response.setFetchSpecificCategoriesAndActivitiesResponseList(newList);
        assert(response.getFetchSpecificCategoriesAndActivitiesResponseList().equals(newList));
    }
}
