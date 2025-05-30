package com.example.session_controllers;

import com.example.entities.Session;

import java.util.Date;

public class UpdateTextNoteRequest {
    private Session session;
    private String text;
    
    public UpdateTextNoteRequest(Session session, String text) {
        this.session = session;
        this.text = text;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Date getDate() {
        return session.getDate();
    }
}
