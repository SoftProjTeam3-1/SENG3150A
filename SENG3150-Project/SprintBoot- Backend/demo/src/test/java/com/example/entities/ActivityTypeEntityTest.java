package com.example.entities;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class ActivityTypeEntityTest {

    @Test
    void testConstructorAndGetters() {
        ActivityType type = new ActivityType("Warm Up", "Light warm up activities");
        assertEquals("Warm Up", type.getName());
        assertEquals("Light warm up activities", type.getDescription());
        assertNotNull(type.getActivities());
        assertTrue(type.getActivities().isEmpty());
    }

    @Test
    void testSetters() {
        ActivityType type = new ActivityType();
        type.setName("Drill");
        type.setDescription("Technical drill");
        assertEquals("Drill", type.getName());
        assertEquals("Technical drill", type.getDescription());
    }
}
