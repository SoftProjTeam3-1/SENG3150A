/**
 * Author: Harrison Armstrong (c3430852)
 * Date: 12042025
 *  Description: This class represents an Activity entity in the database.
 * * It contains fields for activityID, peopleRequired, name, description, favourite, and duration.
 * *  It includes getters and setters for each field.
 * 
 * * It includes a many-to-one relationship with the ActivityType entity.
 * 
 */

package com.example.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;

@Entity
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int activityID;

    private int peopleRequired;
    private String name;
    private String description;
    private boolean favourite;
    private String duration;

    @ManyToOne
    @JoinColumn(name = "activityTypeID")
    private ActivityType activityType;

    @JsonIgnore
    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SessionActivity> sessionActivities = new ArrayList<>();

    public Activity(){}
    public Activity(String name, String description, int peopleRequired, String duration, ActivityType activityType) {
        this.name = name;
        this.description = description;
        this.peopleRequired = peopleRequired;
        this.duration = duration;
        this.activityType = activityType;
    }

    public int getId() {
        return activityID;
    }

    public void setId(int activityID) {
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

    public ActivityType getActivityType() {
        return activityType;
    }

    public void setActivityType(ActivityType activityType) {
        this.activityType = activityType;
    }
}
