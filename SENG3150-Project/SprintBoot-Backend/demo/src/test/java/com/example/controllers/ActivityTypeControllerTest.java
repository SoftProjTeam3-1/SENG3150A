package com.example.controllers;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.any;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;

import com.example.entities.Activity;
import com.example.entities.ActivityType;
import com.example.controllers.ActivityService;
import com.example.controllers.ActivityController;
import com.example.controllers.ActivityTypeService;

import com.fasterxml.jackson.databind.ObjectMapper;

public class ActivityTypeControllerTest {
    @Mock
    private ActivityService activityService;

    @Mock
    private ActivityTypeService activityTypeService;

    @InjectMocks
    private ActivityTypeController activityTypeController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private Activity testActivity;
    private ActivityType testActivityType;

    @BeforeEach
    public void setUp(){
        org.mockito.MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(activityTypeController).build();
        objectMapper = new ObjectMapper();

        // Set up test data
        testActivityType = new ActivityType("Warmup", "Prepare the body for exercise");
        testActivity = new Activity("Morning Run", "Why are you running?", 1, "30mins", testActivityType);        
    }

    /*
     * ActivityType creation
     * success and failure
     */
    @Test
    public void createActivityType_success() throws Exception{
        when(activityTypeService.createActivityType(any(ActivityType.class))).thenReturn(true);

        mockMvc.perform(post("/api/activityType/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testActivityType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("ActivityType created successfully"));        
    }

    @Test
    public void createActivityType_failure() throws Exception{
        when(activityTypeService.createActivityType(any(ActivityType.class))).thenReturn(false);

        mockMvc.perform(post("/api/activityType/create")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(testActivityType)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("ActivityType creation failed"));    
    }

    /*
     * Get all activity types
     * success
     */

    @Test
    public void getAll_success() throws Exception {
        List<ActivityType> activityTypes = new ArrayList<>();
        activityTypes.add(testActivityType);

        when(activityTypeService.getAllActivityTypes()).thenReturn(activityTypes);

        mockMvc.perform(get("/api/activityType/getAll")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Activity types returned"))
                .andExpect(jsonPath("$.activityTypes[0].name").value(testActivityType.getName()))
                .andExpect(jsonPath("$.activityTypes[0].description").value(testActivityType.getDescription()));
    }

    /*
     * DELETE ACTIVITY TYPE TEST
     * success and failure
     */

    @Test
    public void deleteActivityType_success() throws Exception {
        when(activityTypeService.deleteActivityType(any(String.class))).thenReturn(true);

        mockMvc.perform(post("/api/activityType/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testActivityType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("ActivityType deleted successfully"));
    }

    @Test 
    public void deleteActivityType_failure() throws Exception{
        when(activityTypeService.deleteActivityType(any(String.class))).thenReturn(false);

        mockMvc.perform(post("/api/activityType/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testActivityType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("ActivityType deletion failed"));
    }

    /*
     * UPDATE ACTIVITY TYPE 
     * success and failure 
     */

    @Test
    public void updateActivityType_success() throws Exception{
        when(activityTypeService.updateActivityType(any(ActivityType.class))).thenReturn(true);

        mockMvc.perform(post("/api/activityType/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testActivityType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("ActivityType updated successfully")); 
    }

    @Test
    public void updateActivityType_failure() throws Exception{
        when(activityTypeService.updateActivityType(any(ActivityType.class))).thenReturn(false);

        mockMvc.perform(post("/api/activityType/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testActivityType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("ActivityType update failed"));  
    }
}
