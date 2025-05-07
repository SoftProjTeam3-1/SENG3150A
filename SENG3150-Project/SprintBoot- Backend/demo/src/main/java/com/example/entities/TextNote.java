/*
 * Author: Harrison Armstrong (c3430852)
 * Date: 12042025
 * Description: This class represents a TextNote entity in the database.
 * It contains fields for textNoteID and text.
 * 
 * It includes a many-to-one relationship with the SessionActivity entity.
 */

package com.example.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class TextNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int textNoteID;

    private String text;

    @ManyToOne
    @JoinColumn(name = "sessionActiityID")
    private SessionActivity sessionActivity;

    public TextNote(String text, SessionActivity sessionActivity) {
        this.sessionActivity = sessionActivity;
        this.text = text;
    }

    public int getTextNoteID() {
        return textNoteID;
    }

    public void setTextNoteID(int textNoteID) {
        this.textNoteID = textNoteID;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public SessionActivity getSessionActivity() {
        return sessionActivity;
    }

    public void setSessionActivity(SessionActivity sessionActivity) {
        this.sessionActivity = sessionActivity;
    }
}
