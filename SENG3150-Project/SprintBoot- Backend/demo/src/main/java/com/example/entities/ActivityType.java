/**
 * Author: Harrison Armstrong (c3430852)
 * Date: 09042025
 * Description: This class represents an ActivityType entity in the database.
 * It contains fields for activityTypeID, name, and description.
 * It is used to define the type of activities that can be associated with a session.
 */

package com.example.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class ActivityType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int activityTypeID;

    private String name;
    private String description;

    public ActivityType(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public int getId() {
        return activityTypeID;
    }

    public void setId(int activityTypeID) {
        this.activityTypeID = activityTypeID;
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
}
