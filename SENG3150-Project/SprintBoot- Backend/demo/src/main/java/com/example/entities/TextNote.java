/*
 * Author: Harrison Armstrong (c3430852)
 * Date: 12042025
 * Description: This class represents a TextNote entity in the database.
 * It contains fields for textNoteID and text.
 * 
 * It includes a many-to-one relationship with the SessionActivity entity.
 */

package com.example.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

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
