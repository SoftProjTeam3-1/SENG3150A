/*
 * Author: Harrison Armstrong
 */

package com.example.responses;

import com.example.entities.Activity;

import java.util.List;

public class SessionActivityGrabResponse {
    
    List<Activity> activities;
    String message;
    boolean response;

    public SessionActivityGrabResponse(List<Activity> activities, String message, boolean response) {
        this.activities = activities;
        this.message = message;
        this.response = response;
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

    public boolean isResponse() {
        return response;
    }
}
