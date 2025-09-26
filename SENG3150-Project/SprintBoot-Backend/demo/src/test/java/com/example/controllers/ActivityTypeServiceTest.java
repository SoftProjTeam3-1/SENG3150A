package com.example.controllers;

import com.example.stored_procedures.CreateActivityType;
import com.example.stored_procedures.GetActivityTypes;
import com.example.entities.ActivityType;
import com.example.repositories.ActivityTypeRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;

import java.util.ArrayList;

@ExtendWith(MockitoExtension.class)
public class ActivityTypeServiceTest {

    @Mock
    private CreateActivityType createActivityType;

    @Mock 
    private GetActivityTypes getActivityTypes;

    @Mock
    private ActivityTypeRepository activityTypeRepository;

    /*
     * CREATE ACTIVITY TYPE TESTS
     * SUCCESS
     * FAILURE
     */

    @Test
    public void createActivityType_success(){
        ActivityType testType = new ActivityType();
        Mockito.when(createActivityType.createActivityType(testType)).thenReturn(true);

        ActivityTypeService activityTypeService = new ActivityTypeService(activityTypeRepository);

        assert(createActivityType.createActivityType(testType) == true);
        assert(activityTypeService.createActivityType(testType) == true);
    }

    @Test
    public void createActivityType_failure(){
        ActivityType testType = new ActivityType();

        Mockito.when(createActivityType.createActivityType(testType)).thenReturn(false);

        assertFalse(createActivityType.createActivityType(testType));
        }

    /*
     * GET ALL ACTIVITY TYPES TEST
     * SUCCESS
     * FAILURE
     * 
     */

    @Test
    public void getAllActivityTypes_success(){
        ArrayList<ActivityType> testList = new ArrayList<>();
        Mockito.when(getActivityTypes.getAll()).thenReturn(testList);

        ActivityTypeService activityTypeService = new ActivityTypeService(activityTypeRepository);
        assert(getActivityTypes.getAll() != null);
        assert(activityTypeService.getAllActivityTypes() != null);
    }

    @Test
    public void getAllActivityTypes_failure(){
        Mockito.when(getActivityTypes.getAll()).thenReturn(null);

        assert(getActivityTypes.getAll() == null);
    }

    /*
     * GET DISTINCT BY NAME TESTS
     * SUCCESS
     * FAILURE
     */

    @Test
    public void getDistinctByName_success() {
        ActivityType testType = new ActivityType();
        testType.setName("Test Name");

        // Mock the repository behavior
        Mockito.when(activityTypeRepository.findDistinctByName("Test Name")).thenReturn(testType);

        // Create the service instance
        ActivityTypeService activityTypeService = new ActivityTypeService(activityTypeRepository);

        // Call the service method and assert the result
        ActivityType result = activityTypeService.getDistinctByName("Test Name");
        assert(result != null);
        assert("Test Name".equals(result.getName()));
    }

    @Test
    public void getDistinctByName_failure(){
        ActivityType testType = new ActivityType();
        testType.setName("Test Name");

        // Mock the repository behavior
        Mockito.when(activityTypeRepository.findDistinctByName("Test Name")).thenReturn(null);

        // Create the service instance
        ActivityTypeService activityTypeService = new ActivityTypeService(activityTypeRepository);

        // Call the service method and assert the result
        ActivityType result = activityTypeService.getDistinctByName("Test Name");
        assert(result == null);
    }

    /*
     * DELETE ACTIVITY TYPE TESTS
     * SUCCESS
     * FAILURE
     */

    @Test
    public void deleteActivityType_success(){
        ActivityType testType = new ActivityType();
        testType.setName("Test Name");

        Mockito.when(activityTypeRepository.findDistinctByName("Test Name")).thenReturn(testType);
        Mockito.doNothing().when(activityTypeRepository).delete(testType);
        
        ActivityTypeService activityTypeService = new ActivityTypeService(activityTypeRepository);
        
        boolean result = activityTypeService.deleteActivityType("Test Name");
        assert(result);
        Mockito.verify(activityTypeRepository).findDistinctByName("Test Name");
        Mockito.verify(activityTypeRepository).delete(testType);
    }

    @Test void deleteActivityType_failure(){
        Mockito.when(activityTypeRepository.findDistinctByName("NonExistent")).thenReturn(null);
        
        ActivityTypeService activityTypeService = new ActivityTypeService(activityTypeRepository);
        
        boolean result = activityTypeService.deleteActivityType("NonExistent");
        assert(!result);
        Mockito.verify(activityTypeRepository).findDistinctByName("NonExistent");
        Mockito.verify(activityTypeRepository, Mockito.never()).delete(Mockito.any());
    }

    /*
     * UPDATE ACTIVITY TYPE TESTS
     * SUCCESS
     * FAILURE
     * EXCEPTION
     */

    @Test
    public void updateActivityType_success(){
        ActivityType testType = new ActivityType();
        testType.setName("Test Name");
        testType.setDescription("Test Description");

        Mockito.when(activityTypeRepository.findDistinctByName("Test Name")).thenReturn(testType);
        Mockito.doNothing().when(activityTypeRepository).updateActivityType(
            Mockito.anyInt(), 
            Mockito.eq("Test Name"), 
            Mockito.eq("Test Description")
        );

        ActivityTypeService activityTypeService = new ActivityTypeService(activityTypeRepository);
        boolean result = activityTypeService.updateActivityType(testType);
        assert(result);
        Mockito.verify(activityTypeRepository).findDistinctByName("Test Name");
        Mockito.verify(activityTypeRepository).updateActivityType(
            Mockito.anyInt(), 
            Mockito.eq("Test Name"), 
            Mockito.eq("Test Description")
        );
    }

    @Test
    public void updateActivityType_failure(){
        ActivityType testType = new ActivityType();
        testType.setName("NonExistent");
        testType.setDescription("Test Description");

        Mockito.when(activityTypeRepository.findDistinctByName("NonExistent")).thenReturn(null);

        ActivityTypeService activityTypeService = new ActivityTypeService(activityTypeRepository);
        boolean result = activityTypeService.updateActivityType(testType);
        assert(!result);
        Mockito.verify(activityTypeRepository).findDistinctByName("NonExistent");
        Mockito.verify(activityTypeRepository, Mockito.never()).updateActivityType(
            Mockito.anyInt(), 
            Mockito.eq("NonExistent"), 
            Mockito.eq("Test Description")
        );
    }

    @Test
    public void updateActivityType_exception(){
        ActivityType testType = new ActivityType();
        testType.setName("Test Name");
        testType.setDescription("Test Description");

        Mockito.when(activityTypeRepository.findDistinctByName("Test Name")).thenThrow(new RuntimeException("DB error"));

        ActivityTypeService activityTypeService = new ActivityTypeService(activityTypeRepository);
        boolean result = activityTypeService.updateActivityType(testType);
        assert(!result);
        Mockito.verify(activityTypeRepository).findDistinctByName("Test Name");
        Mockito.verify(activityTypeRepository, Mockito.never()).updateActivityType(
            Mockito.anyInt(), 
            Mockito.eq("Test Name"), 
            Mockito.eq("Test Description")
        );
    }
}
