package com.example.entities;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.ArrayList;

public class RollTest {
    
    @Test
    public void testGettersAndSetters(){
        Roll roll = new Roll();
        roll.setId(0);
        roll.setSession(new Session());
        roll.setAttendances(new ArrayList<Attendance>());

        assertNotNull(roll.getId());
        assertNotNull(roll.getSession());
        assertNotNull(roll.getAttendances());
    }
}
