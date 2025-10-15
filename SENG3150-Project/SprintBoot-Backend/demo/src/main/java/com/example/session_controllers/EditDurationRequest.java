package com.example.session_controllers;

import com.example.entities.Activity;
import com.example.entities.Session;

/**
 * A request template for EditDuration.
 */
public class EditDurationRequest {
    
    private Session session;
    private Activity activity;
    private String newDuration;

    public EditDurationRequest(Session session, Activity activity, String newDuration) {
        this.session = session;
        this.activity = activity;
        this.newDuration = newDuration;
    }

    /**
     * Returns the Session
     */
    public Session getSession() {
        return session;
    }

    /**
     * Set the Session
     * @param session The Session being stored.
     */
    public void setSession(Session session) {
        this.session = session;
    }

    /**
     * Return the Activity
     */
    public Activity getActivity() {
        return activity;
    }

    /**
     * Set the Activity
     * @param activity The Activity being stored.
     */
    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    /**
     * Return the newDuration.
     */
    public String getNewDuration() {
        return newDuration;
    }

    /**
     * Set the newDuration.
     * @param newDuration The newDuration being stored.
     */
    public void setNewDuration(String newDuration) {
        this.newDuration = newDuration;
    }
}
