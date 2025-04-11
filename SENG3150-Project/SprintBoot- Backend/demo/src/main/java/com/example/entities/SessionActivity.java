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

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class SessionActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int sessionActivityID;


    @ManyToOne
    @JoinColumn(name = "sessionID")
    private Session session;

    @ManyToOne
    @JoinColumn(name = "activityID")
    private Activity activity;

    public SessionActivity(int sessionActivityID) {
        this.sessionActivityID = sessionActivityID;
    }

    public int getSessionActivityID() {
        return sessionActivityID;
    }

    public void setSessionActivityID(int sessionActivityID) {
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
}
