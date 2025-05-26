/*
 * Author: Harrison Armstrong (c3430852)
 * Date: 09042025
 * Description: This class represents a SessionType entity in the database.
 * It contains fields for sessionTypeID, name, and description.
 */

package com.example.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;

import java.util.List;
import java.util.ArrayList;

@Entity
public class SessionType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sessionTypeID;

    private String name;
    private String description;    

    @OneToMany(mappedBy = "type", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Session> sessions = new ArrayList<>();

    public SessionType(){}
    public SessionType(String name, String description){
        this.name = name;
        this.description = description;
    }

    public int getId() {
        return sessionTypeID;
    }

    public void setId(int sessionTypeID) {
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

    public List<Session> getSessions() {
        return sessions;
    }

    public void setSessions(List<Session> sessions) {
        this.sessions = sessions;
    }
}
