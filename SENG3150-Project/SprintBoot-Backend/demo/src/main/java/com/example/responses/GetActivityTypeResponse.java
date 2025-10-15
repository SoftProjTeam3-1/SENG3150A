package com.example.responses;

import java.util.List;
import com.example.entities.ActivityType;

public class GetActivityTypeResponse {
    
    private List<ActivityType> activityTypes;
    private String message;

    public GetActivityTypeResponse(List<ActivityType> activityTypes, String message) {
        this.activityTypes = activityTypes;
        this.message = message;
    }

    public List<ActivityType> getActivityTypes() {
        return activityTypes;
    }

    public void setActivityTypes(List<ActivityType> activityTypes) {
        this.activityTypes = activityTypes;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
