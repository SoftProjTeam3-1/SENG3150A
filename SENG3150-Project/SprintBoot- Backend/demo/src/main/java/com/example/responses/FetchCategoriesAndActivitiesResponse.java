package com.example.responses;

import java.util.ArrayList;
import java.util.List;

public class FetchCategoriesAndActivitiesResponse {
    List<FetchSpecificCategoriesAndActivitiesResponse> fetchSpecificCategoriesAndActivitiesResponseList = new ArrayList<>();

    public List<FetchSpecificCategoriesAndActivitiesResponse> getFetchSpecificCategoriesAndActivitiesResponseList() {
        return fetchSpecificCategoriesAndActivitiesResponseList;
    }

    public void setFetchSpecificCategoriesAndActivitiesResponseList(
        List<FetchSpecificCategoriesAndActivitiesResponse> fetchSpecificCategoriesAndActivitiesResponseList){
            this.fetchSpecificCategoriesAndActivitiesResponseList = fetchSpecificCategoriesAndActivitiesResponseList;
    }

    public void addToList(FetchSpecificCategoriesAndActivitiesResponse input){
        fetchSpecificCategoriesAndActivitiesResponseList.add(input);
    }

    public FetchCategoriesAndActivitiesResponse() {}


}
