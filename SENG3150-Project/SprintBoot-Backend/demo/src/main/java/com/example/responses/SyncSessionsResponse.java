package com.example.responses;


import com.example.entities.SessionActivity;
import com.example.entities.SessionType;
import com.example.entities.TextNote;
import com.fasterxml.jackson.annotation.JsonAlias;

import java.sql.Date;
import java.util.List;

public class SyncSessionsResponse {
    private Integer sessionID;

    @JsonAlias({"sessionTypeID", "type"})
    private Integer sessionTypeId;

    private Date date;
    private Integer rollId;
    private List<SyncSessionsActivityResponse> activities;
    private List<TextNote> notes;


    public SyncSessionsResponse() {}

    public SyncSessionsResponse(int sessionID, Date date, int sessionTypeId, List<SyncSessionsActivityResponse> activities, List<TextNote> notes) {
        this.sessionID = sessionID;
        this.sessionTypeId = sessionTypeId;
        this.rollId = sessionTypeId;
        this.date = date;
        this.activities = activities;
        this.notes = notes;
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

    public Integer getSessionTypeId() {
        return sessionTypeId;
    }

    public void setSessionTypeId(Integer sessionTypeId) {
        this.sessionTypeId = sessionTypeId;
    }

    public List<SyncSessionsActivityResponse> getActivities() {
        return activities;
    }

    public void setActivities(List<SyncSessionsActivityResponse> activities) {
        this.activities = activities;
    }

    public int getRollId() {
        return rollId;
    }
    public void setRollId(int rollId) {
        this.rollId = rollId;
    }

    public List<TextNote> getNotes() {
        return notes;
    }
    public void setNotes(List<TextNote> notes) {
        this.notes = notes;
    }
}

