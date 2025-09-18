package com.example.controllers;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.entities.Activity;
import com.example.entities.ActivityType;
import com.example.repositories.ActivityRepository;
import com.example.repositories.ActivityTypeRepository;

@ExtendWith(MockitoExtension.class)
class ActivityServiceTest {

    @Mock
    private ActivityRepository activityRepository;
    @Mock
    private ActivityTypeRepository activityTypeRepository;

    @InjectMocks
    private ActivityService activityService;

    private ActivityType type;
    private Activity activity;

    @BeforeEach
    void setUp() {
        type = new ActivityType("Warm Up", "Pre session");
        activity = new Activity("Jog", "Light jogging", 20, "10m", type);
    }

    @Test
    @DisplayName("createActivity delegates to repository and returns true on success")
    void testCreateActivitySuccess() {
        when(activityRepository.save(any(Activity.class))).thenReturn(activity);
        boolean result = activityService.createActivity(activity);
        assertTrue(result);
        verify(activityRepository, times(1)).save(activity);
    }

    @Test
    @DisplayName("getAllActivities returns list from repository")
    void testGetAllActivities() {
        when(activityRepository.findAll()).thenReturn(Arrays.asList(activity));
        List<Activity> list = activityService.getAllActivities();
        assertNotNull(list);
        assertEquals(1, list.size());
        assertEquals("Jog", list.get(0).getName());
    }

    @Test
    @DisplayName("getAllActivities handles exception and returns null")
    void testGetAllActivitiesException() {
        when(activityRepository.findAll()).thenThrow(new RuntimeException("DB error"));
        List<Activity> list = activityService.getAllActivities();
        assertNull(list);
    }

    @Test
    @DisplayName("getActivitiesByType returns activities matched by type name")
    void testGetActivitiesByType() {
        when(activityTypeRepository.findDistinctByName("Warm Up")).thenReturn(type);
        when(activityRepository.findByActivityType(type)).thenReturn(Collections.singletonList(activity));
        List<Activity> list = activityService.getActivitiesByType("Warm Up");
        assertNotNull(list);
        assertEquals(1, list.size());
        verify(activityTypeRepository).findDistinctByName("Warm Up");
        verify(activityRepository).findByActivityType(type);
    }

    @Test
    @DisplayName("deleteActivity returns true when entity exists")
    void testDeleteActivitySuccess() {
        when(activityRepository.findDistinctByName("Jog")).thenReturn(activity);
        boolean result = activityService.deleteActivity("Jog");
        assertTrue(result);
        verify(activityRepository).delete(activity);
    }

    @Test
    @DisplayName("deleteActivity returns false when entity missing")
    void testDeleteActivityNotFound() {
        when(activityRepository.findDistinctByName("Missing")).thenReturn(null);
        boolean result = activityService.deleteActivity("Missing");
        assertFalse(result);
        verify(activityRepository, never()).delete(any());
    }

    @Test
    @DisplayName("updateActivity returns true when existing found")
    void testUpdateActivitySuccess() {
        Activity updated = new Activity("Jog", "Updated", 18, "12m", type);
        updated.setFavourite(true);
        when(activityRepository.findDistinctByName("Jog")).thenReturn(activity);
        boolean result = activityService.updateActivity(updated);
        assertTrue(result);
        verify(activityRepository).updateActivity(anyInt(), eq(18), eq("Jog"), eq("Updated"), eq(true), eq("12m"));
    }

    @Test
    @DisplayName("updateActivity returns false when not found")
    void testUpdateActivityNotFound() {
        when(activityRepository.findDistinctByName("Jog")).thenReturn(null);
        boolean result = activityService.updateActivity(activity);
        assertFalse(result);
        verify(activityRepository, never()).updateActivity(anyInt(), anyInt(), anyString(), anyString(), anyBoolean(), anyString());
    }

    @Test
    @DisplayName("updateActivity returns false when exception thrown")
    void testUpdateActivityException() {
        when(activityRepository.findDistinctByName("Jog")).thenThrow(new RuntimeException("DB down"));
        boolean result = activityService.updateActivity(activity);
        assertFalse(result);
    }
}
