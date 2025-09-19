package com.example.entities;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.ArrayList;

public class SessionTest {
    @Test
    public void testGettersAndSetters(){
        Session s = new Session();
        s.setVoiceNotes(new ArrayList<VoiceNote>());
        s.setSessionActivities(new ArrayList<SessionActivity>());
        s.setTextNotes(new ArrayList<TextNote>());
        s.setRoll(new Roll());

        assertNotNull(s.getVoiceNotes());
        assertNotNull(s.getSessionActivities());
        assertNotNull(s.getTextNotes());
        assertNotNull(s.getRoll());
    }
}
