package com.example.entities;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.io.File;

import com.example.entities.Session;

public class VoiceNoteTest {
    
    @Test
    public void testGetters(){
        VoiceNote vnDefault = new VoiceNote();
        VoiceNote vn = new VoiceNote(new File("Fresh Avocado Del Taco Vine.mp3"), new Session());
        vn.setId(0);

        assertNotNull(vn.getSession());
        assertNotNull(vn.getVoiceFile());
        assertNotNull(vn.getId());
    }

    @Test
    public void testSetters(){
        VoiceNote vn = new VoiceNote();

        vn.setSessionActivity(new Session());
        vn.setVoiceFile(new File("Fresh Avocado Del Taco Vine.mp3"));

        assertNotNull(vn.getSession());
        assertNotNull(vn.getVoiceFile());       
    }
}
