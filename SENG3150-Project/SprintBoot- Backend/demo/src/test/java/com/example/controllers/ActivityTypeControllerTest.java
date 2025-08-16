package com.example.controllers;

import com.example.entities.ActivityType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// Run this test with the command:
// mvn test -Dtest=ActivityTypeControllerTest
@ExtendWith(MockitoExtension.class)
class ActivityTypeControllerTest {

    @Mock
    private ActivityTypeService activityTypeService;

    @InjectMocks
    private ActivityTypeController activityTypeController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;
    private ActivityType testActivityType;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(activityTypeController).build();
        objectMapper = new ObjectMapper();
        
        // Set up test data
        testActivityType = new ActivityType();
        testActivityType.setId(1);
        testActivityType.setName("Training");
        testActivityType.setDescription("Training activity type");
    }

    // Tests for createActivityType endpoint
    @Test
    void testCreateActivityType_Success_ReturnsCreatedResponse() throws Exception {
        // Given
        when(activityTypeService.createActivityType(any(ActivityType.class))).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/activityType/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testActivityType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(true))
                .andExpect(jsonPath("$.message").value("ActivityType created successfully"));

        verify(activityTypeService, times(1)).createActivityType(any(ActivityType.class));
    }

    @Test
    void testCreateActivityType_Failure_ReturnsFailureResponse() throws Exception {
        // Given
        when(activityTypeService.createActivityType(any(ActivityType.class))).thenReturn(false);

        // When & Then
        mockMvc.perform(post("/api/activityType/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testActivityType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(false))
                .andExpect(jsonPath("$.message").value("ActivityType creation failed"));

        verify(activityTypeService, times(1)).createActivityType(any(ActivityType.class));
    }

    @Test
    void testCreateActivityType_WithEmptyName_HandlesGracefully() throws Exception {
        // Given
        ActivityType emptyNameActivityType = new ActivityType();
        emptyNameActivityType.setName("");
        emptyNameActivityType.setDescription("Description");
        
        when(activityTypeService.createActivityType(any(ActivityType.class))).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/activityType/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emptyNameActivityType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(true));

        verify(activityTypeService, times(1)).createActivityType(any(ActivityType.class));
    }

    @Test
    void testCreateActivityType_WithNullDescription_HandlesGracefully() throws Exception {
        // Given
        ActivityType nullDescActivityType = new ActivityType();
        nullDescActivityType.setName("TestType");
        nullDescActivityType.setDescription(null);
        
        when(activityTypeService.createActivityType(any(ActivityType.class))).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/activityType/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(nullDescActivityType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(true));

        verify(activityTypeService, times(1)).createActivityType(any(ActivityType.class));
    }

    // Tests for getAllActivityTypes endpoint
    @Test
    void testGetAllActivityTypes_WithActivityTypes_ReturnsListSuccessfully() throws Exception {
        // Given
        ActivityType activityType1 = new ActivityType("Training", "Training sessions");
        ActivityType activityType2 = new ActivityType("Match", "Match sessions");
        List<ActivityType> activityTypes = Arrays.asList(activityType1, activityType2);
        
        when(activityTypeService.getAllActivityTypes()).thenReturn(activityTypes);

        // When & Then
        mockMvc.perform(get("/api/activityType/getAll"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Activity types returned"))
                .andExpect(jsonPath("$.activityTypes").isArray())
                .andExpect(jsonPath("$.activityTypes.length()").value(2));

        verify(activityTypeService, times(1)).getAllActivityTypes();
    }

    @Test
    void testGetAllActivityTypes_EmptyList_ReturnsEmptyListSuccessfully() throws Exception {
        // Given
        when(activityTypeService.getAllActivityTypes()).thenReturn(Collections.emptyList());

        // When & Then
        mockMvc.perform(get("/api/activityType/getAll"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Activity types returned"))
                .andExpect(jsonPath("$.activityTypes").isArray())
                .andExpect(jsonPath("$.activityTypes.length()").value(0));

        verify(activityTypeService, times(1)).getAllActivityTypes();
    }

    @Test
    void testGetAllActivityTypes_ServiceReturnsNull_HandlesGracefully() throws Exception {
        // Given
        when(activityTypeService.getAllActivityTypes()).thenReturn(null);

        // When & Then
        mockMvc.perform(get("/api/activityType/getAll"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Activity types returned"));

        verify(activityTypeService, times(1)).getAllActivityTypes();
    }

    // Tests for deleteActivityType endpoint
    @Test
    void testDeleteActivityType_Success_ReturnsDeletedResponse() throws Exception {
        // Given
        when(activityTypeService.deleteActivityType(testActivityType.getName())).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/activityType/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testActivityType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(true))
                .andExpect(jsonPath("$.message").value("ActivityType deleted successfully"));

        verify(activityTypeService, times(1)).deleteActivityType(testActivityType.getName());
    }

    @Test
    void testDeleteActivityType_Failure_ReturnsFailureResponse() throws Exception {
        // Given
        when(activityTypeService.deleteActivityType(testActivityType.getName())).thenReturn(false);

        // When & Then
        mockMvc.perform(post("/api/activityType/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testActivityType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(false))
                .andExpect(jsonPath("$.message").value("ActivityType deletion failed"));

        verify(activityTypeService, times(1)).deleteActivityType(testActivityType.getName());
    }

    @Test
    void testDeleteActivityType_NonExistentActivityType_ReturnsFailure() throws Exception {
        // Given
        ActivityType nonExistentType = new ActivityType();
        nonExistentType.setName("NonExistent");
        
        when(activityTypeService.deleteActivityType("NonExistent")).thenReturn(false);

        // When & Then
        mockMvc.perform(post("/api/activityType/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(nonExistentType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(false))
                .andExpect(jsonPath("$.message").value("ActivityType deletion failed"));

        verify(activityTypeService, times(1)).deleteActivityType("NonExistent");
    }

    @Test
    void testDeleteActivityType_WithNullName_HandlesGracefully() throws Exception {
        // Given
        ActivityType nullNameType = new ActivityType();
        nullNameType.setName(null);
        
        when(activityTypeService.deleteActivityType(null)).thenReturn(false);

        // When & Then
        mockMvc.perform(post("/api/activityType/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(nullNameType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(false));

        verify(activityTypeService, times(1)).deleteActivityType(null);
    }

    // Tests for updateActivityType endpoint
    @Test
    void testUpdateActivityType_Success_ReturnsUpdatedResponse() throws Exception {
        // Given
        when(activityTypeService.updateActivityType(any(ActivityType.class))).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/activityType/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testActivityType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(true))
                .andExpect(jsonPath("$.message").value("ActivityType updated successfully"));

        verify(activityTypeService, times(1)).updateActivityType(any(ActivityType.class));
    }

    @Test
    void testUpdateActivityType_Failure_ReturnsFailureResponse() throws Exception {
        // Given
        when(activityTypeService.updateActivityType(any(ActivityType.class))).thenReturn(false);

        // When & Then
        mockMvc.perform(post("/api/activityType/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testActivityType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(false))
                .andExpect(jsonPath("$.message").value("ActivityType update failed"));

        verify(activityTypeService, times(1)).updateActivityType(any(ActivityType.class));
    }

    @Test
    void testUpdateActivityType_NonExistentActivityType_ReturnsFailure() throws Exception {
        // Given
        ActivityType nonExistentType = new ActivityType();
        nonExistentType.setName("NonExistent");
        nonExistentType.setDescription("Updated description");
        
        when(activityTypeService.updateActivityType(any(ActivityType.class))).thenReturn(false);

        // When & Then
        mockMvc.perform(post("/api/activityType/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(nonExistentType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(false))
                .andExpect(jsonPath("$.message").value("ActivityType update failed"));

        verify(activityTypeService, times(1)).updateActivityType(any(ActivityType.class));
    }

    @Test
    void testUpdateActivityType_WithUpdatedFields_CallsServiceCorrectly() throws Exception {
        // Given
        ActivityType updatedActivityType = new ActivityType();
        updatedActivityType.setName("UpdatedTraining");
        updatedActivityType.setDescription("Updated training description");
        
        when(activityTypeService.updateActivityType(any(ActivityType.class))).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/activityType/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedActivityType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(true))
                .andExpect(jsonPath("$.message").value("ActivityType updated successfully"));

        verify(activityTypeService, times(1)).updateActivityType(any(ActivityType.class));
    }

    // Edge case and integration tests
    @Test
    void testCreateActivityType_LongName_HandlesGracefully() throws Exception {
        // Given
        ActivityType longNameType = new ActivityType();
        longNameType.setName("ThisIsAVeryLongActivityTypeNameThatExceedsNormalLength");
        longNameType.setDescription("Normal description");
        
        when(activityTypeService.createActivityType(any(ActivityType.class))).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/activityType/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(longNameType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(true));

        verify(activityTypeService, times(1)).createActivityType(any(ActivityType.class));
    }

    @Test
    void testCreateActivityType_SpecialCharactersInName_HandlesGracefully() throws Exception {
        // Given
        ActivityType specialCharType = new ActivityType();
        specialCharType.setName("Training@#$%");
        specialCharType.setDescription("Training with special characters");
        
        when(activityTypeService.createActivityType(any(ActivityType.class))).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/activityType/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(specialCharType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(true));

        verify(activityTypeService, times(1)).createActivityType(any(ActivityType.class));
    }

    @Test
    void testUpdateActivityType_WithEmptyDescription_HandlesGracefully() throws Exception {
        // Given
        ActivityType emptyDescType = new ActivityType();
        emptyDescType.setName("Training");
        emptyDescType.setDescription("");
        
        when(activityTypeService.updateActivityType(any(ActivityType.class))).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/activityType/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emptyDescType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(true));

        verify(activityTypeService, times(1)).updateActivityType(any(ActivityType.class));
    }

    // Test CORS functionality (implicit through MockMvc setup)
    @Test
    void testCorsConfiguration_AllowsRequest() throws Exception {
        // Given
        when(activityTypeService.getAllActivityTypes()).thenReturn(Collections.emptyList());

        // When & Then
        mockMvc.perform(get("/api/activityType/getAll")
                .header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk());
    }
}