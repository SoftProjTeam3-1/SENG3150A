package com.example.controllers;

/**
 * The Request template for {@link ActivityTypeRequest}
 */
public class ActivityTypeRequest {
    private String activityType;

    /**
     * Set the activity type
     * @param activityType The activityType being stored.
     */
    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    /**
     * Returns the activityType
     */
    public String getActivityType() {
        return activityType;
    }
}
