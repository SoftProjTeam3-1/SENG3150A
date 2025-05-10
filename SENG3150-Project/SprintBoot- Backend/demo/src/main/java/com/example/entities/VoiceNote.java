/*
 * Author: Harrison Armstrong (c3430852)
 * Date: 12042025
 *  Description: This class represents a VoiceNote entity in the database.
 * It contains fields for voiceNoteID and voiceFile.
 * The voiceFile is represented as a File object.
 * 
 * It includes a many-to-one relationship with the SessionActivity entity.
 */


package com.example.entities;

import java.io.File;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class VoiceNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int voiceNoteID;

    private File voiceFile;

    @ManyToOne
    @JoinColumn(name = "sessionID")
    private Session session;

    public VoiceNote(File voiceFile, Session session) {
        this.session = session;
        this.voiceFile = voiceFile;
    }

    public int getId() {
        return voiceNoteID;
    }

    public void setId(int voiceNoteID) {
        this.voiceNoteID = voiceNoteID;
    }

    public File getVoiceFile() {
        return voiceFile;
    }

    public void setVoiceFile(File voiceFile) {
        this.voiceFile = voiceFile;
    }

    public Session getSession() {
        return session;
    }

    public void setSessionActivity(Session session) {
        this.session = session;
    }
}
