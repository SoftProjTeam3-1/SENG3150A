/*
 * Author: Harrison Armstrong (c3430852)
 * Date: 09042025
 * Description: This class represents a SessionType entity in the database.
 * It contains fields for sessionTypeID, name, and description.
 */

package com.example.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class SessionType {
    @Id
    private int sessionTypeID;

    private String name;
    private String description;    

    public SessionType(String name, String description){
        this.name = name;
        this.description = description;
    }

    public int getSessionTypeID() {
        return sessionTypeID;
    }

    public void setSessionTypeID(int sessionTypeID) {
        this.sessionTypeID = sessionTypeID;
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
