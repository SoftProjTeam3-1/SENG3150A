package com.example.entities;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

public class ActivityEntityTest {

    @Test
    void testConstructorAndGetters() {
        ActivityType type = new ActivityType("Conditioning", "Fitness related");
        Activity activity = new Activity("Shuttle Runs", "Sprint drills", 10, "15m", type);
        assertEquals("Shuttle Runs", activity.getName());
        assertEquals("Sprint drills", activity.getDescription());
        assertEquals(10, activity.getPeopleRequired());
        assertEquals("15m", activity.getDuration());
        assertEquals(type, activity.getActivityType());
        assertFalse(activity.isFavourite());
    }

    @Test
    void testSetters() {
        Activity activity = new Activity();
        ActivityType type = new ActivityType();
        type.setName("Warm Up");
        activity.setName("High Knees");
        activity.setDescription("Dynamic warm up");
        activity.setPeopleRequired(5);
        activity.setDuration("5m");
        activity.setFavourite(true);
        activity.setActivityType(type);
        assertEquals("High Knees", activity.getName());
        assertEquals("Dynamic warm up", activity.getDescription());
        assertEquals(5, activity.getPeopleRequired());
        assertEquals("5m", activity.getDuration());
        assertTrue(activity.isFavourite());
        assertEquals(type, activity.getActivityType());
    }
}
