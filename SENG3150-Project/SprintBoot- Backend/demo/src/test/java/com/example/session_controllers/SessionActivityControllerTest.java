package com.example.session_controllers;

import com.example.entities.Session;
import com.example.entities.Activity;
import com.example.entities.SessionActivity;
import com.example.entities.SessionType;
import com.example.entities.User;
import com.example.responses.SessionActivityGrabResponse;
import com.example.responses.AddSessionActivityResponse;
import com.example.responses.DeleteSessionActivityResponse;
import com.example.responses.EditSessionActivityDurationResponse;
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

import java.sql.Date;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;



// Run this test with the command:
//mvn test -Dtest=SessionActivityControllerTest
@ExtendWith(MockitoExtension.class)
class SessionActivityControllerTest {

    @Mock
    private SessionActivityService sessionActivityService;

    @InjectMocks
    private SessionActivityController sessionActivityController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private Session testSession;
    private Activity testActivity;
    private SessionActivity testSessionActivity;
    private List<Activity> testActivities;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(sessionActivityController).build();
        objectMapper = new ObjectMapper();
        
        // Set up test data
        User testUser = new User();
        testUser.setFirstName("John");
        testUser.setSurname("Doe");
        
        SessionType testSessionType = new SessionType();
        testSessionType.setName("Training");
        
        testSession = new Session();
        testSession.setId(1);
        testSession.setDate(new Date(System.currentTimeMillis()));
        testSession.setUser(testUser);
        testSession.setType(testSessionType);
        
        testActivity = new Activity();
        testActivity.setName("Passing Drill");
        testActivity.setDescription("Basic passing drill");
        
        testSessionActivity = new SessionActivity();
        testSessionActivity.setSession(testSession);
        testSessionActivity.setActivity(testActivity);
        testSessionActivity.setDuration("30 minutes");
        testSessionActivity.setRow(1);
        
        testActivities = Arrays.asList(testActivity);
    }

    // Tests for getSessionActivities endpoint
    @Test
    void testGetSessionActivities_ActivitiesFound_ReturnsSuccess() throws Exception {
        // Given
        when(sessionActivityService.getActivitiesBySession(any(Session.class))).thenReturn(testActivities);

        // When & Then
        mockMvc.perform(post("/api/sessionActivity/getSessionActivities")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSession)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Activities retrieved successfully"))
                .andExpect(jsonPath("$.response").value(true))
                .andExpect(jsonPath("$.activities").isArray())
                .andExpect(jsonPath("$.activities[0].name").value("Passing Drill"));

        verify(sessionActivityService, times(1)).getActivitiesBySession(any(Session.class));
    }

    @Test
    void testGetSessionActivities_NoActivitiesFound_ReturnsNotFound() throws Exception {
        // Given
        when(sessionActivityService.getActivitiesBySession(any(Session.class))).thenReturn(Collections.emptyList());

        // When & Then
        mockMvc.perform(post("/api/sessionActivity/getSessionActivities")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSession)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No activities found for this session"))
                .andExpect(jsonPath("$.response").value(false))
                .andExpect(jsonPath("$.activities").isEmpty());

        verify(sessionActivityService, times(1)).getActivitiesBySession(any(Session.class));
    }

    @Test
    void testGetSessionActivities_ServiceReturnsNull_ReturnsNotFound() throws Exception {
        // Given
        when(sessionActivityService.getActivitiesBySession(any(Session.class))).thenReturn(null);

        // When & Then
        mockMvc.perform(post("/api/sessionActivity/getSessionActivities")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSession)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No activities found for this session"))
                .andExpect(jsonPath("$.response").value(false));

        verify(sessionActivityService, times(1)).getActivitiesBySession(any(Session.class));
    }

    // Tests for addSessionActivity endpoint
    @Test
    void testAddSessionActivity_ValidData_ReturnsSuccess() throws Exception {
        // Given
        when(sessionActivityService.getSessionByDateAndType(any(SessionActivity.class))).thenReturn(testSession);
        when(sessionActivityService.getActivityByName(anyString())).thenReturn(testActivity);
        when(sessionActivityService.saveSessionActivity(any(SessionActivity.class))).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/sessionActivity/addSessionActivity")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSessionActivity)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Session activity added successfully"))
                .andExpect(jsonPath("$.response").value(true));

        verify(sessionActivityService, times(1)).getSessionByDateAndType(any(SessionActivity.class));
        verify(sessionActivityService, times(1)).getActivityByName(anyString());
        verify(sessionActivityService, times(1)).saveSessionActivity(any(SessionActivity.class));
    }

    @Test
    void testAddSessionActivity_SessionNotFound_ReturnsNotFound() throws Exception {
        // Given
        when(sessionActivityService.getSessionByDateAndType(any(SessionActivity.class))).thenReturn(null);
        when(sessionActivityService.getActivityByName(anyString())).thenReturn(testActivity);

        // When & Then
        mockMvc.perform(post("/api/sessionActivity/addSessionActivity")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSessionActivity)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Session or Activity not found"))
                .andExpect(jsonPath("$.response").value(false));

        verify(sessionActivityService, times(1)).getSessionByDateAndType(any(SessionActivity.class));
        verify(sessionActivityService, times(1)).getActivityByName(anyString());
        verify(sessionActivityService, never()).saveSessionActivity(any(SessionActivity.class));
    }

    @Test
    void testAddSessionActivity_ActivityNotFound_ReturnsNotFound() throws Exception {
        // Given
        when(sessionActivityService.getSessionByDateAndType(any(SessionActivity.class))).thenReturn(testSession);
        when(sessionActivityService.getActivityByName(anyString())).thenReturn(null);

        // When & Then
        mockMvc.perform(post("/api/sessionActivity/addSessionActivity")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSessionActivity)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Session or Activity not found"))
                .andExpect(jsonPath("$.response").value(false));

        verify(sessionActivityService, times(1)).getSessionByDateAndType(any(SessionActivity.class));
        verify(sessionActivityService, times(1)).getActivityByName(anyString());
        verify(sessionActivityService, never()).saveSessionActivity(any(SessionActivity.class));
    }

    @Test
    void testAddSessionActivity_SaveFails_ReturnsInternalServerError() throws Exception {
        // Given
        when(sessionActivityService.getSessionByDateAndType(any(SessionActivity.class))).thenReturn(testSession);
        when(sessionActivityService.getActivityByName(anyString())).thenReturn(testActivity);
        when(sessionActivityService.saveSessionActivity(any(SessionActivity.class))).thenReturn(false);

        // When & Then
        mockMvc.perform(post("/api/sessionActivity/addSessionActivity")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSessionActivity)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Failed to add session activity"))
                .andExpect(jsonPath("$.response").value(false));

        verify(sessionActivityService, times(1)).saveSessionActivity(any(SessionActivity.class));
    }

    // Tests for deleteSessionActivity endpoint
    @Test
    void testDeleteSessionActivity_EntityExists_ReturnsSuccess() throws Exception {
        // Given
        when(sessionActivityService.getSessionActivityBySessionAndActivity(any(Session.class), any(Activity.class)))
                .thenReturn(testSessionActivity);
        when(sessionActivityService.deleteSessionActivity(any(SessionActivity.class))).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/sessionActivity/deleteSessionActivity")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSessionActivity)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Session activity deleted successfully"))
                .andExpect(jsonPath("$.response").value(true));

        verify(sessionActivityService, times(1)).getSessionActivityBySessionAndActivity(any(Session.class), any(Activity.class));
        verify(sessionActivityService, times(1)).deleteSessionActivity(any(SessionActivity.class));
    }

    @Test
    void testDeleteSessionActivity_EntityNotFound_ReturnsNotFound() throws Exception {
        // Given
        when(sessionActivityService.getSessionActivityBySessionAndActivity(any(Session.class), any(Activity.class)))
                .thenReturn(null);

        // When & Then
        mockMvc.perform(post("/api/sessionActivity/deleteSessionActivity")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSessionActivity)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Session activity not found"))
                .andExpect(jsonPath("$.response").value(false));

        verify(sessionActivityService, times(1)).getSessionActivityBySessionAndActivity(any(Session.class), any(Activity.class));
        verify(sessionActivityService, never()).deleteSessionActivity(any(SessionActivity.class));
    }

    @Test
    void testDeleteSessionActivity_DeleteFails_ReturnsInternalServerError() throws Exception {
        // Given
        when(sessionActivityService.getSessionActivityBySessionAndActivity(any(Session.class), any(Activity.class)))
                .thenReturn(testSessionActivity);
        when(sessionActivityService.deleteSessionActivity(any(SessionActivity.class))).thenReturn(false);

        // When & Then
        mockMvc.perform(post("/api/sessionActivity/deleteSessionActivity")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSessionActivity)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Failed to delete session activity"))
                .andExpect(jsonPath("$.response").value(false));

        verify(sessionActivityService, times(1)).deleteSessionActivity(any(SessionActivity.class));
    }

}