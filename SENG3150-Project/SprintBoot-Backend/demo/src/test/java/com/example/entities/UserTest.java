package com.example.entities;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.ArrayList;

public class UserTest {
    @Test
    public void testGettersAndSetters(){
        User u = new User();

        u.setVerified(true);
        u.setSessions(new ArrayList<Session>());

        assertNotNull(u.verified());
        assertNotNull(u.getSessions());
    }
}
