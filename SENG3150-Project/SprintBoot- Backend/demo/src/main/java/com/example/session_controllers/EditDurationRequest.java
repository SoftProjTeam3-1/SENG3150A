package com.example.session_controllers;

import com.example.entities.Activity;
import com.example.entities.Session;


public class EditDurationRequest {
    
    private Session session;
    private Activity activity;
    private String newDuration;

    public EditDurationRequest(Session session, Activity activity, String newDuration) {
        this.session = session;
        this.activity = activity;
        this.newDuration = newDuration;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public String getNewDuration() {
        return newDuration;
    }
    
    public void setNewDuration(String newDuration) {
        this.newDuration = newDuration;
    }
}
