package com.example.responses;

import java.util.List;
import com.example.entities.Activity;

public class GetActivityResponse {
    public List<Activity> activities;
    public String message;

    public GetActivityResponse(List<Activity> activities, String message) {
        this.activities = activities;
        this.message = message;
    }

    public List<Activity> getActivities() {
        return activities;
    }

    public void setActivities(List<Activity> activities) {
        this.activities = activities;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
