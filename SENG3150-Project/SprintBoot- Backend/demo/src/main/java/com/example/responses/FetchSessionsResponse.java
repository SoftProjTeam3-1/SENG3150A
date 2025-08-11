package com.example.responses;


import com.example.entities.SessionActivity;
import com.example.entities.SessionType;

import java.sql.Date;
import java.util.List;

public class FetchSessionsResponse {
    private int sessionID;
    private Date date;
    private String sessionTypeId;
    private List<SessionActivity> activities;

    public FetchSessionsResponse() {}

    public FetchSessionsResponse(int sessionID, Date date, SessionType sessionTypeId, List<SessionActivity> activities) {
        this.sessionID = sessionID;
        this.date = date;
        this.sessionTypeId = sessionTypeId.getName();
        this.activities = activities;
    }

    public int getSessionID() {
        return sessionID;
    }

    public void setSessionID(int sessionID) {
        this.sessionID = sessionID;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getSessionTypeId() {
        return sessionTypeId;
    }

    public void setSessionTypeId(String sessionTypeId) {
        this.sessionTypeId = sessionTypeId;
    }

    public List<SessionActivity> getActivities() {
        return activities;
    }

    public void setActivities(List<SessionActivity> activities) {
        this.activities = activities;
    }
}

