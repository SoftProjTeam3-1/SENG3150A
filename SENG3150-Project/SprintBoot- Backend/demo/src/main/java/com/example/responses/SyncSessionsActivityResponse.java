package com.example.responses;

import com.example.entities.SessionActivity;

import java.sql.Date;
import java.util.List;

public class SyncSessionsActivityResponse {

    private Integer sessionActivityID;
    private String name;
    private String description;
    private Integer duration;
    private String category;
    private int row;


    public SyncSessionsActivityResponse() {}

    public SyncSessionsActivityResponse(Integer sessionActivityID, String name, String description, Integer duration, String category, int row) {
        this.sessionActivityID = sessionActivityID;
        this.name = name;
        this.description = description;
        this.duration = duration;
        this.category = category;
        this.row = row;
    }

    public Integer getSessionActivityID() {
        return sessionActivityID;
    }
    public void setSessionActivityID(Integer sessionActivityID) {
        this.sessionActivityID = sessionActivityID;
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
    public Integer getDuration() {
        return duration;
    }
    public void setDuration(Integer duration) {
        this.duration = duration;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    public int getRow() {
        return row;
    }
    public void setRow(int row) {
        this.row = row;
    }
}
