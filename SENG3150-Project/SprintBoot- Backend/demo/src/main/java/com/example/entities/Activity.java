package com.example.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Activity {
    @Id
    private int activityID;

    private int peopleRequired;
    private String name;
    private String description;
    private boolean favourite;
    private String duration;

    public Activity(String name, String description, int peopleRequired, String duration) {
        this.name = name;
        this.description = description;
        this.peopleRequired = peopleRequired;
        this.duration = duration;
    }

    public int getActivityID() {
        return activityID;
    }

    public void setActivityID(int activityID) {
        this.activityID = activityID;
    }

    public int getPeopleRequired() {
        return peopleRequired;
    }

    public void setPeopleRequired(int peopleRequired) {
        this.peopleRequired = peopleRequired;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isFavourite() {
        return favourite;
    }

    public void setFavourite(boolean favourite) {
        this.favourite = favourite;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }
}
