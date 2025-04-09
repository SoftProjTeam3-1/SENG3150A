/*
 * Author: Harrison Armstrong (c3430852)
 * Date: 09042025
 *  Description: This class represents a VoiceNote entity in the database.
 * It contains fields for voiceNoteID and voiceFile.
 * The voiceFile is represented as a File object.
 */


package com.example.entities;

import java.io.File;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class VoiceNote {
    @Id
    private int voiceNoteID;

    private File voiceFile;

    public VoiceNote(File voiceFile){
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
}
