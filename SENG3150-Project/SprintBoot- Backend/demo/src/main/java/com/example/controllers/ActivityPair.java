package com.example.controllers;

import com.example.entities.Activity;

public class ActivityPair {
    private Activity originalActivity;
    private Activity changedActivity;

    public ActivityPair() {}

    public ActivityPair(Activity originalActivity, Activity changedActivity) {
        this.originalActivity = originalActivity;
        this.changedActivity = changedActivity;
    }

    public Activity getOriginalActivity() {
        return originalActivity;
    }

    public void setOriginalActivity(Activity originalActivity) {
        this.originalActivity = originalActivity;
    }

    public Activity getChangedActivity() {
        return changedActivity;
    }

    public void setChangedActivity(Activity changedActivity) {
        this.changedActivity = changedActivity;
    }
}
