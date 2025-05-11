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
    @JoinColumn(name = "sessionID")
    private Session session;

    public TextNote(){}
    public TextNote(String text, Session session) {
        this.session = session;
        this.text = text;
    }

    public int getId() {
        return textNoteID;
    }

    public void setId(int textNoteID) {
        this.textNoteID = textNoteID;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }
}
