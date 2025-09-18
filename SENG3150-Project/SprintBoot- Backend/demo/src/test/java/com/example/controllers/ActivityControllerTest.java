package com.example.controllers;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.any;

import java.sql.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import org.springframework.http.MediaType;

import com.example.entities.Activity;
import com.example.entities.ActivityType;
import com.example.controllers.ActivityService;
import com.example.controllers.ActivityController;
import com.example.controllers.ActivityTypeService;

import com.fasterxml.jackson.databind.ObjectMapper;

public class ActivityControllerTest {
    @Mock
    private ActivityService activityService;

    @Mock
    private ActivityTypeService activityTypeService;

    @InjectMocks
    private ActivityController activityController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private Activity testActivity;

    @BeforeEach
    void setUp() {
        // Initialize mocks
        org.mockito.MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(activityController).build();
        objectMapper = new ObjectMapper();

        // Set up test data
        testActivity = new Activity("Morning Run", "Why are you running?", 1, "30mins", new ActivityType());
    }
    
    /**
     * CREATE ACTIVITY
     * success and failure
     */

    @Test
    public void createActivity_success() throws Exception {
        when(activityService.createActivity(any(Activity.class))).thenReturn(true);
        when(activityTypeService.getDistinctByName(any(String.class))).thenReturn(new ActivityType("Warmup", "Preparing the body for exercise"));

        mockMvc.perform(post("/api/activity/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testActivity)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Activity created successfully"));
    }

    @Test
    public void createActivity_failure() throws Exception {
        when(activityService.createActivity(any(Activity.class))).thenReturn(false);
        when(activityTypeService.getDistinctByName(any(String.class))).thenReturn(new ActivityType("Warmup", "Preparing the body for exercise"));

        mockMvc.perform(post("/api/activity/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testActivity)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Activity creation failed"));
    }

    /*
     * GET BY ACTIVITY TYPE
     * success and failure
     */

    @Test
    public void getByActivityType_success() throws Exception {
        when(activityService.getActivitiesByType(any(String.class))).thenReturn(java.util.Arrays.asList(testActivity));

        mockMvc.perform(post("/api/activity/getByActivityType")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"activityType\": \"Warmup\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Activities returned"))
                .andExpect(jsonPath("$.activities[0].name").value("Morning Run"));
    }

    @Test
    public void getByActivityType_failure() throws Exception {
        when(activityService.getActivitiesByType(any(String.class))).thenReturn(java.util.Collections.emptyList());

        mockMvc.perform(post("/api/activity/getByActivityType")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"activityType\": \"NonExistentType\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Activities returned"))
                .andExpect(jsonPath("$.activities").isEmpty());
    }

    /*
     * Delete Activity 
     * success and failure
     */

    @Test
    public void deleteActivity_success() throws Exception {
        when(activityService.deleteActivity(any(String.class))).thenReturn(true);

        mockMvc.perform(post("/api/activity/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testActivity)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Activity deleted successfully"));
    }

    @Test
    public void deleteActivity_failure() throws Exception {
        when(activityService.deleteActivity(any(String.class))).thenReturn(false);

        mockMvc.perform(post("/api/activity/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testActivity)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Activity deletion failed"));
    }

    /*
     * UPDATE ACTIVITY
     * success and failure
     */

    @Test
    public void updateActivity_success() throws Exception {
        when(activityService.updateActivity(any(Activity.class))).thenReturn(true);

        mockMvc.perform(post("/api/activity/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testActivity)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Activity updated successfully"));
    }

    @Test
    public void updateActivity_failure() throws Exception {
        when(activityService.updateActivity(any(Activity.class))).thenReturn(false);

        mockMvc.perform(post("/api/activity/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testActivity)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Activity update failed"));
    }
}
