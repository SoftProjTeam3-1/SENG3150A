package com.example.controllers;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.example.entities.ActivityType;
import com.example.repositories.ActivityTypeRepository;

class ActivityTypeServiceTest {

    @Mock
    private ActivityTypeRepository activityTypeRepository;

    @InjectMocks
    private ActivityTypeService activityTypeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateActivityType_NullInput() {
        boolean result = activityTypeService.createActivityType(null);
        assertFalse(result, "Creating a null ActivityType should return false");
    }

    @Test
    void testGetAllActivityTypes_EmptyList() {
        when(activityTypeRepository.findAll()).thenReturn(Collections.emptyList());

        List<ActivityType> result = activityTypeService.getAllActivityTypes();

        assertNotNull(result, "Result should not be null");
        assertTrue(result.isEmpty(), "Result should be an empty list");
    }

    @Test
    void testGetDistinctByName_NullInput() {
        ActivityType result = activityTypeService.getDistinctByName(null);
        assertNull(result, "Result should be null for null input");
    }

    @Test
    void testDeleteActivityType_NullInput() {
        boolean result = activityTypeService.deleteActivityType(null);
        assertFalse(result, "Deleting with null name should return false");
    }

    @Test
    void testUpdateActivityType_NullInput() {
        boolean result = activityTypeService.updateActivityType(null);
        assertFalse(result, "Updating with null ActivityType should return false");
    }
}