/*
 * Author: Harrison Armstrong (c3430852)
 * Date: 12042025
 * Description: This class represents a Session entity in the database.
 * It contains fields for sessionID and date.
 * 
 * It includes a many-to-one relationship with the User entity.
 * * It includes a many-to-one relationship with the Activity entity.
 */

package com.example.entities;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sessionID;

    private Date date;

    @ManyToOne
    @JoinColumn(name = "userID")
    private User user;

    @ManyToOne
    @JoinColumn(name = "sessionTypeID")
    private SessionType type;

    public Session(){}
    public Session(Date date, User user, SessionType type) {
        this.date = date;
        this.user = user;
        this.type = type;
    }

    public int getId() {
        return sessionID;
    }

    public void setId(int sessionID) {
        this.sessionID = sessionID;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public SessionType getType() {
        return type;
    }

    public void setType(SessionType type) {
        this.type = type;
    }
}
