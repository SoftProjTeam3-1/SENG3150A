package com.example.session_controllers;

import com.example.entities.Session;
import com.example.entities.SessionType;
import com.example.entities.User;
import com.example.responses.GetTextNoteResponse;
import com.example.responses.CreateSessionResponse;
import com.example.responses.EditNoteResponse;
import com.example.responses.DeleteSessionResponse;
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

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// Run this test with the command:
// mvn test -Dtest=SessionControllerTest
@ExtendWith(MockitoExtension.class)
class SessionControllerTest {

    @Mock
    private SessionService sessionService;

    @InjectMocks
    private SessionController sessionController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;
    private Session testSession;
    private SessionType testSessionType;
    private User testUser;
    private UpdateTextNoteRequest testUpdateRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(sessionController).build();
        objectMapper = new ObjectMapper();

        // Set up test data
        testUser = new User();
        testUser.setId(1);
        testUser.setFirstName("John");
        testUser.setSurname("Doe");
        testUser.setEmail("john.doe@example.com");

        testSessionType = new SessionType();
        testSessionType.setId(1);
        testSessionType.setName("Training");
        testSessionType.setDescription("Training session");

        testSession = new Session();
        testSession.setId(1);
        testSession.setDate(new Date(System.currentTimeMillis()));
        testSession.setUser(testUser);
        testSession.setType(testSessionType);

        testUpdateRequest = new UpdateTextNoteRequest(testSession, "Updated note text");
    }

    // Tests for getNote endpoint
    @Test
    void testGetNote_TextFound_ReturnsSuccess() throws Exception {
        // Given
        String expectedText = "Sample note text";
        when(sessionService.getIdByDate(anyString())).thenReturn(1);
        when(sessionService.getTextBySessionId(1)).thenReturn(expectedText);

        // When & Then
        mockMvc.perform(post("/api/session/getNote")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSession)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.text").value(expectedText))
                .andExpect(jsonPath("$.message").value("Text retrieved successfully"))
                .andExpect(jsonPath("$.response").value(true));

        verify(sessionService, times(1)).getIdByDate(anyString());
        verify(sessionService, times(1)).getTextBySessionId(1);
    }

    @Test
    void testGetNote_TextNotFound_ReturnsNotFound() throws Exception {
        // Given
        when(sessionService.getIdByDate(anyString())).thenReturn(1);
        when(sessionService.getTextBySessionId(1)).thenReturn(null);

        // When & Then
        mockMvc.perform(post("/api/session/getNote")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSession)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.text").isEmpty())
                .andExpect(jsonPath("$.message").value("No text found for this session"))
                .andExpect(jsonPath("$.response").value(false));

        verify(sessionService, times(1)).getIdByDate(anyString());
        verify(sessionService, times(1)).getTextBySessionId(1);
    }

    // Tests for editNote endpoint
    @Test
    void testEditNote_UpdateSuccessful_ReturnsSuccess() throws Exception {
        // Given
        when(sessionService.getIdByDate(anyString())).thenReturn(1);
        when(sessionService.updateTextBySessionId(anyString(), eq(1))).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/session/editNote")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUpdateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Text updated successfully"))
                .andExpect(jsonPath("$.success").value(true));

        verify(sessionService, times(1)).getIdByDate(anyString());
        verify(sessionService, times(1)).updateTextBySessionId("Updated note text", 1);
    }

    @Test
    void testEditNote_UpdateFailed_ReturnsInternalServerError() throws Exception {
        // Given
        when(sessionService.getIdByDate(anyString())).thenReturn(1);
        when(sessionService.updateTextBySessionId(anyString(), eq(1))).thenReturn(false);

        // When & Then
        mockMvc.perform(post("/api/session/editNote")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUpdateRequest)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Failed to update text"))
                .andExpect(jsonPath("$.success").value(false));

        verify(sessionService, times(1)).getIdByDate(anyString());
        verify(sessionService, times(1)).updateTextBySessionId("Updated note text", 1);
    }

    // Tests for createSession endpoint
    @Test
    void testCreateSession_SaveSuccessful_ReturnsSuccess() throws Exception {
        // Given
        when(sessionService.saveSession(any(Session.class))).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/session/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSession)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Session created successfully"))
                .andExpect(jsonPath("$.success").value(true));

        verify(sessionService, times(1)).saveSession(any(Session.class));
    }

    @Test
    void testCreateSession_SaveFailed_ReturnsInternalServerError() throws Exception {
        // Given
        when(sessionService.saveSession(any(Session.class))).thenReturn(false);

        // When & Then
        mockMvc.perform(post("/api/session/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSession)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.message").value("Failed to create session"))
                .andExpect(jsonPath("$.success").value(false));

        verify(sessionService, times(1)).saveSession(any(Session.class));
    }

    // Tests for deleteSession endpoint
    @Test
    void testDeleteSession_SessionFoundAndDeleted_ReturnsSuccess() throws Exception {
        // Given
        when(sessionService.getSessionByDateAndType(any(Session.class))).thenReturn(testSession);
        when(sessionService.deleteSession(testSession)).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/session/deleteSession")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSession)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.response").value(true))
                .andExpect(jsonPath("$.message").value("Session deleted successfully"));

        verify(sessionService, times(1)).getSessionByDateAndType(any(Session.class));
        verify(sessionService, times(1)).deleteSession(testSession);
    }

    @Test
    void testDeleteSession_SessionFoundButDeleteFailed_ReturnsInternalServerError() throws Exception {
        // Given
        when(sessionService.getSessionByDateAndType(any(Session.class))).thenReturn(testSession);
        when(sessionService.deleteSession(testSession)).thenReturn(false);

        // When & Then
        mockMvc.perform(post("/api/session/deleteSession")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSession)))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.response").value(false))
                .andExpect(jsonPath("$.message").value("Failed to delete session"));

        verify(sessionService, times(1)).getSessionByDateAndType(any(Session.class));
        verify(sessionService, times(1)).deleteSession(testSession);
    }

    @Test
    void testDeleteSession_SessionNotFound_ReturnsNotFound() throws Exception {
        // Given
        when(sessionService.getSessionByDateAndType(any(Session.class))).thenReturn(null);

        // When & Then
        mockMvc.perform(post("/api/session/deleteSession")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSession)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.response").value(false))
                .andExpect(jsonPath("$.message").value("Session not found"));

        verify(sessionService, times(1)).getSessionByDateAndType(any(Session.class));
        verify(sessionService, never()).deleteSession(any(Session.class));
    }

    // Edge case tests
    @Test
    void testGetNote_InvalidSessionId_HandlesGracefully() throws Exception {
        // Given
        when(sessionService.getIdByDate(anyString())).thenReturn(0);
        when(sessionService.getTextBySessionId(0)).thenReturn(null);

        // When & Then
        mockMvc.perform(post("/api/session/getNote")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSession)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No text found for this session"));

        verify(sessionService, times(1)).getIdByDate(anyString());
        verify(sessionService, times(1)).getTextBySessionId(0);
    }

    @Test
    void testEditNote_EmptyTextUpdate_ReturnsSuccess() throws Exception {
        // Given
        UpdateTextNoteRequest emptyTextRequest = new UpdateTextNoteRequest(testSession, "");
        when(sessionService.getIdByDate(anyString())).thenReturn(1);
        when(sessionService.updateTextBySessionId("", 1)).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/session/editNote")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(emptyTextRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Text updated successfully"))
                .andExpect(jsonPath("$.success").value(true));

        verify(sessionService, times(1)).updateTextBySessionId("", 1);
    }

    @Test
    void testCreateSession_NullSessionType_HandlesGracefully() throws Exception {
        // Given
        Session sessionWithoutType = new Session();
        sessionWithoutType.setDate(new Date(System.currentTimeMillis()));
        sessionWithoutType.setType(null);

        when(sessionService.saveSession(any(Session.class))).thenReturn(true);

        // When & Then
        mockMvc.perform(post("/api/session/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sessionWithoutType)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(sessionService, times(1)).saveSession(any(Session.class));
    }
}