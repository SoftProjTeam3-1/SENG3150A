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

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class VoiceNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int voiceNoteID;

    private File voiceFile;

    @ManyToOne
    @JoinColumn(name = "sessionActivityID")
    private SessionActivity sessionActivity;

    public VoiceNote(File voiceFile, SessionActivity sessionActivity) {
        this.sessionActivity = sessionActivity;
        this.voiceFile = voiceFile;
    }

    public int getVoiceNoteID() {
        return voiceNoteID;
    }

    public void setVoiceNoteID(int voiceNoteID) {
        this.voiceNoteID = voiceNoteID;
    }

    public File getVoiceFile() {
        return voiceFile;
    }

    public void setVoiceFile(File voiceFile) {
        this.voiceFile = voiceFile;
    }

    public SessionActivity getSessionActivity() {
        return sessionActivity;
    }

    public void setSessionActivity(SessionActivity sessionActivity) {
        this.sessionActivity = sessionActivity;
    }
}
