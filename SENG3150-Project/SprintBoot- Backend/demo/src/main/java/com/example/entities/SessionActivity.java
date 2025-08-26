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

import jakarta.persistence.*;

@Entity
public class SessionActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer sessionActivityID;

    @Column(name = "row_num")
    private int rowNum;


    @ManyToOne
    @JoinColumn(name = "sessionID")
    private Session session;

    @ManyToOne
    @JoinColumn(name = "activityID")
    private Activity activity;

    @Version
    private Long version;

    private String duration;

    public SessionActivity(){}
    public SessionActivity(Session session, Activity activity, String duration, int rowNum) {
        this.session = session;
        this.activity = activity;
        this.duration = duration;
        this.rowNum = rowNum;
    }

    public Integer getId() {
        return sessionActivityID;
    }

    public void setId(Integer sessionActivityID) {
        this.sessionActivityID = sessionActivityID;
    }

    public int getRow() {
        return rowNum;
    }

    public void setRow(int row) {
        this.rowNum = row;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
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
