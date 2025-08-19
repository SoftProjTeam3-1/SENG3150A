package com.example.controllers;

import com.example.entities.ActivityType;
import com.example.repositories.ActivityTypeRepository;
import com.example.stored_procedures.CreateActivityType;
import com.example.stored_procedures.GetActivityTypes;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedConstruction;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

// Run this test with the command:
// mvn test -Dtest=ActivityTypeServiceTest
@ExtendWith(MockitoExtension.class)
class ActivityTypeServiceTest {

    @Mock
    private ActivityTypeRepository activityTypeRepository;

    @InjectMocks
    private ActivityTypeService activityTypeService;

    private ActivityType testActivityType;
    private List<ActivityType> testActivityTypeList;

    @BeforeEach
    void setUp() {
        testActivityType = new ActivityType();
        testActivityType.setId(1);
        testActivityType.setName("Training");
        testActivityType.setDescription("Training activity");

        testActivityTypeList = new ArrayList<>();
        testActivityTypeList.add(testActivityType);
    }

    // Tests for createActivityType method
    @Test
    void testCreateActivityType_Success_ReturnsTrue() {
        // Given
        try (MockedConstruction<CreateActivityType> mockedConstruction = 
             mockConstruction(CreateActivityType.class, (mock, context) -> {
                 when(mock.createActivityType(testActivityType)).thenReturn(true);
             })) {
            
            // When
            boolean result = activityTypeService.createActivityType(testActivityType);
            
            // Then
            assertTrue(result);
            assertEquals(1, mockedConstruction.constructed().size());
        }
    }

    @Test
    void testCreateActivityType_Failure_ReturnsFalse() {
        // Given
        try (MockedConstruction<CreateActivityType> mockedConstruction = 
             mockConstruction(CreateActivityType.class, (mock, context) -> {
                 when(mock.createActivityType(testActivityType)).thenReturn(false);
             })) {
            
            // When
            boolean result = activityTypeService.createActivityType(testActivityType);
            
            // Then
            assertFalse(result);
            assertEquals(1, mockedConstruction.constructed().size());
        }
    }

    @Test
    void testCreateActivityType_NullActivityType_ReturnsFalse() {
        // Given
        try (MockedConstruction<CreateActivityType> mockedConstruction = 
             mockConstruction(CreateActivityType.class, (mock, context) -> {
                 when(mock.createActivityType(null)).thenReturn(false);
             })) {
            
            // When
            boolean result = activityTypeService.createActivityType(null);
            
            // Then
            assertFalse(result);
        }
    }

    // Tests for getAllActivityTypes method
    @Test
    void testGetAllActivityTypes_Success_ReturnsListOfActivityTypes() {
        // Given
        try (MockedConstruction<GetActivityTypes> mockedConstruction = 
             mockConstruction(GetActivityTypes.class, (mock, context) -> {
                 when(mock.getAll()).thenReturn(testActivityTypeList);
             })) {
            
            // When
            List<ActivityType> result = activityTypeService.getAllActivityTypes();
            
            // Then
            assertNotNull(result);
            assertEquals(1, result.size());
            assertEquals(testActivityType.getId(), result.get(0).getId());
            assertEquals(testActivityType.getName(), result.get(0).getName());
            assertEquals(testActivityType.getDescription(), result.get(0).getDescription());
            assertEquals(1, mockedConstruction.constructed().size());
        }
    }

    @Test
    void testGetAllActivityTypes_EmptyList_ReturnsEmptyList() {
        // Given
        List<ActivityType> emptyList = new ArrayList<>();
        try (MockedConstruction<GetActivityTypes> mockedConstruction = 
             mockConstruction(GetActivityTypes.class, (mock, context) -> {
                 when(mock.getAll()).thenReturn(emptyList);
             })) {
            
            // When
            List<ActivityType> result = activityTypeService.getAllActivityTypes();
            
            // Then
            assertNotNull(result);
            assertTrue(result.isEmpty());
        }
    }

    @Test
    void testGetAllActivityTypes_DatabaseError_ReturnsNull() {
        // Given
        try (MockedConstruction<GetActivityTypes> mockedConstruction = 
             mockConstruction(GetActivityTypes.class, (mock, context) -> {
                 when(mock.getAll()).thenReturn(null);
             })) {
            
            // When
            List<ActivityType> result = activityTypeService.getAllActivityTypes();
            
            // Then
            assertNull(result);
        }
    }

    // Tests for getDistinctByName method
    @Test
    void testGetDistinctByName_ActivityTypeExists_ReturnsActivityType() {
        // Given
        String name = "Training";
        try (MockedConstruction<GetActivityTypes> mockedConstruction = 
             mockConstruction(GetActivityTypes.class, (mock, context) -> {
                 when(mock.getDistinctByName(name)).thenReturn(testActivityType);
             })) {
            
            // When
            ActivityType result = activityTypeService.getDistinctByName(name);
            
            // Then
            assertNotNull(result);
            assertEquals(testActivityType.getId(), result.getId());
            assertEquals(testActivityType.getName(), result.getName());
            assertEquals(testActivityType.getDescription(), result.getDescription());
        }
    }

    @Test
    void testGetDistinctByName_ActivityTypeNotFound_ReturnsNull() {
        // Given
        String name = "NonexistentActivity";
        try (MockedConstruction<GetActivityTypes> mockedConstruction = 
             mockConstruction(GetActivityTypes.class, (mock, context) -> {
                 when(mock.getDistinctByName(name)).thenReturn(null);
             })) {
            
            // When
            ActivityType result = activityTypeService.getDistinctByName(name);
            
            // Then
            assertNull(result);
        }
    }

    @Test
    void testGetDistinctByName_NullName_ReturnsNull() {
        // Given
        try (MockedConstruction<GetActivityTypes> mockedConstruction = 
             mockConstruction(GetActivityTypes.class, (mock, context) -> {
                 when(mock.getDistinctByName(null)).thenReturn(null);
             })) {
            
            // When
            ActivityType result = activityTypeService.getDistinctByName(null);
            
            // Then
            assertNull(result);
        }
    }

    // Tests for deleteActivityType method
    @Test
    void testDeleteActivityType_ActivityTypeExists_ReturnsTrue() {
        // Given
        String name = "Training";
        when(activityTypeRepository.findDistinctByName(name)).thenReturn(testActivityType);
        
        // When
        boolean result = activityTypeService.deleteActivityType(name);
        
        // Then
        assertTrue(result);
        verify(activityTypeRepository, times(1)).findDistinctByName(name);
        verify(activityTypeRepository, times(1)).delete(testActivityType);
    }

    @Test
    void testDeleteActivityType_ActivityTypeNotFound_ReturnsFalse() {
        // Given
        String name = "NonexistentActivity";
        when(activityTypeRepository.findDistinctByName(name)).thenReturn(null);
        
        // When
        boolean result = activityTypeService.deleteActivityType(name);
        
        // Then
        assertFalse(result);
        verify(activityTypeRepository, times(1)).findDistinctByName(name);
        verify(activityTypeRepository, never()).delete(any(ActivityType.class));
    }

    @Test
    void testDeleteActivityType_NullName_ReturnsFalse() {
        // Given
        when(activityTypeRepository.findDistinctByName(null)).thenReturn(null);
        
        // When
        boolean result = activityTypeService.deleteActivityType(null);
        
        // Then
        assertFalse(result);
        verify(activityTypeRepository, times(1)).findDistinctByName(null);
        verify(activityTypeRepository, never()).delete(any(ActivityType.class));
    }

    // Tests for updateActivityType method
    @Test
    void testUpdateActivityType_ActivityTypeExists_ReturnsTrue() {
        // Given
        ActivityType updatedActivityType = new ActivityType();
        updatedActivityType.setName("Training");
        updatedActivityType.setDescription("Updated training activity");
        
        when(activityTypeRepository.findDistinctByName(updatedActivityType.getName())).thenReturn(testActivityType);
        
        // When
        boolean result = activityTypeService.updateActivityType(updatedActivityType);
        
        // Then
        assertTrue(result);
        verify(activityTypeRepository, times(1)).findDistinctByName(updatedActivityType.getName());
        verify(activityTypeRepository, times(1)).updateActivityType(
            testActivityType.getId(),
            updatedActivityType.getName(),
            updatedActivityType.getDescription()
        );
    }

    @Test
    void testUpdateActivityType_ActivityTypeNotFound_ReturnsFalse() {
        // Given
        ActivityType updatedActivityType = new ActivityType();
        updatedActivityType.setName("NonexistentActivity");
        updatedActivityType.setDescription("Updated description");
        
        when(activityTypeRepository.findDistinctByName(updatedActivityType.getName())).thenReturn(null);
        
        // When
        boolean result = activityTypeService.updateActivityType(updatedActivityType);
        
        // Then
        assertFalse(result);
        verify(activityTypeRepository, times(1)).findDistinctByName(updatedActivityType.getName());
        verify(activityTypeRepository, never()).updateActivityType(anyInt(), anyString(), anyString());
    }

    @Test
    void testUpdateActivityType_DatabaseException_ReturnsFalse() {
        // Given
        ActivityType updatedActivityType = new ActivityType();
        updatedActivityType.setName("Training");
        updatedActivityType.setDescription("Updated description");
        
        when(activityTypeRepository.findDistinctByName(updatedActivityType.getName())).thenReturn(testActivityType);
        doThrow(new RuntimeException("Database error")).when(activityTypeRepository)
            .updateActivityType(anyInt(), anyString(), anyString());
        
        // When
        boolean result = activityTypeService.updateActivityType(updatedActivityType);
        
        // Then
        assertFalse(result);
        verify(activityTypeRepository, times(1)).findDistinctByName(updatedActivityType.getName());
        verify(activityTypeRepository, times(1)).updateActivityType(
            testActivityType.getId(),
            updatedActivityType.getName(),
            updatedActivityType.getDescription()
        );
    }

    @Test
    void testUpdateActivityType_NullActivityType_ReturnsFalse() {
        // When & Then
        assertThrows(NullPointerException.class, () -> {
            activityTypeService.updateActivityType(null);
        });
    }

    // Edge case tests
    @Test
    void testDeleteActivityType_EmptyName_ReturnsFalse() {
        // Given
        String emptyName = "";
        when(activityTypeRepository.findDistinctByName(emptyName)).thenReturn(null);
        
        // When
        boolean result = activityTypeService.deleteActivityType(emptyName);
        
        // Then
        assertFalse(result);
        verify(activityTypeRepository, times(1)).findDistinctByName(emptyName);
        verify(activityTypeRepository, never()).delete(any(ActivityType.class));
    }

    @Test
    void testGetDistinctByName_EmptyName_ReturnsNull() {
        // Given
        String emptyName = "";
        try (MockedConstruction<GetActivityTypes> mockedConstruction = 
             mockConstruction(GetActivityTypes.class, (mock, context) -> {
                 when(mock.getDistinctByName(emptyName)).thenReturn(null);
             })) {
            
            // When
            ActivityType result = activityTypeService.getDistinctByName(emptyName);
            
            // Then
            assertNull(result);
        }
    }
}