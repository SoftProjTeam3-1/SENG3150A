package com.example.entities;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

public class AttendanceTest {
    
    @Test
    public void testGettersAndSetters(){
        Attendance att = new Attendance();

        att.setId(0);
        att.setPlayer(new Player());
        att.setAttended(true);
        att.setRoll(new Roll());
        
        assertNotNull(att.getId());
        assertNotNull(att.getPlayer());
        assertNotNull(att.isAttended());
        assertNotNull(att.getRoll());
    }
}
