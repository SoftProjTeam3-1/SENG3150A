package com.example.controllers;

import com.example.entities.Activity;

/**
 * Represents a pair of {@link Activity} objects:
 * the original activity and its modified version.
 */
public class ActivityPair {
    private Activity originalActivity;
    private Activity changedActivity;

    public ActivityPair() {}

    public ActivityPair(Activity originalActivity, Activity changedActivity) {
        this.originalActivity = originalActivity;
        this.changedActivity = changedActivity;
    }

    /**
     * Returns the original {@link Activity}.
     */
    public Activity getOriginalActivity() {
        return originalActivity;
    }

    /**
     * Sets the original {@link Activity}.
     * @param originalActivity The original activity to store.
     */
    public void setOriginalActivity(Activity originalActivity) {
        this.originalActivity = originalActivity;
    }

    /**
     * Returns the modified {@link Activity}.
     */
    public Activity getChangedActivity() {
        return changedActivity;
    }

    /**
     * Set the modified {@link Activity}.
     * @param changedActivity The modified activity to store.
     */
    public void setChangedActivity(Activity changedActivity) {
        this.changedActivity = changedActivity;
    }
}
