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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.CascadeType;

import java.util.List;
import java.util.ArrayList;

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

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SessionActivity> sessionActivities = new ArrayList<>();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TextNote> textNotes = new ArrayList<>();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VoiceNote> voiceNotes = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "rollID")
    private Roll roll;

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

    public List<SessionActivity> getSessionActivities() {
        return sessionActivities;
    }

    public void setSessionActivities(List<SessionActivity> sessionActivities) {
        this.sessionActivities = sessionActivities;
    }

    public List<TextNote> getTextNotes() {
        return textNotes;
    }

    public void setTextNotes(List<TextNote> textNotes) {
        this.textNotes = textNotes;
    }

    public List<VoiceNote> getVoiceNotes() {
        return voiceNotes;
    }

    public void setVoiceNotes(List<VoiceNote> voiceNotes) {
        this.voiceNotes = voiceNotes;
    }

    public Roll getRoll() {
        return roll;
    }

    public void setRoll(Roll roll) {
        this.roll = roll;
    }
}
