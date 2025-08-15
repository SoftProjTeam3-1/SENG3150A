/*
 * Author: Harrison Armstrong (c3430852)
 * Date: 09042025
 * Description: This class represents a SessionActivity entity in the database.
 * It contains a field for sessionActivityID.
 * The sessionActivityID is the primary key for this entity.
 * 
 * It includes a many-to-one relationship with the Session entity.
 * * It includes a many-to-one relationship with the Activity entity.
 */

package com.example.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.CascadeType;

@Entity
public class SessionActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sessionActivityID;

    String duration;


    @ManyToOne
    @JoinColumn(name = "sessionID")
    private Session session;

    @ManyToOne
    @JoinColumn(name = "activityID")
    private Activity activity;

    public SessionActivity(){}
    public SessionActivity(Session session, Activity activity, String duration) {
        this.session = session;
        this.activity = activity;
        this.duration = duration;
    }

    public int getId() {
        return sessionActivityID;
    }

    public void setId(int sessionActivityID) {
        this.sessionActivityID = sessionActivityID;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }
}
