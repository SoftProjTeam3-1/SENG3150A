package com.example.responses;

import com.example.entities.Activity;

import java.util.ArrayList;
import java.util.List;

public class FetchSpecificCategoriesAndActivitiesResponse {
    
    private String ActivityType = "";
    private List<Activity> activities = new ArrayList<>();


    public FetchSpecificCategoriesAndActivitiesResponse(String ActivityType, List<Activity> activities) {
        this.ActivityType = ActivityType;
        this.activities = activities;
    }
    public void setActivities(List<Activity> activities) {
        this.activities = activities;
    }
    public void setActivityType(String ActivityType) {
        this.ActivityType = ActivityType;
    }

    public List<Activity> getActivities() {
        return activities;
    }

    public String getActivityType() {
        return ActivityType;
    }
}
