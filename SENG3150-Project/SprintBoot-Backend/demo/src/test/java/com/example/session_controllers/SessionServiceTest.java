package com.example.session_controllers;

import com.example.entities.Session;
import com.example.entities.SessionType;
import com.example.entities.User;
import com.example.responses.GetTextNoteResponse;
import com.example.responses.CreateSessionResponse;
import com.example.responses.EditNoteResponse;
import com.example.responses.DeleteSessionResponse;
import com.example.repositories.SessionRepository;
import com.example.repositories.TextNoteRepository;


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
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private TextNoteRepository textNoteRepository;

    @InjectMocks
    private SessionService sessionService;
    
    /**
     * Test case for getIdByDate method. successful retrieval
     */
    @Test
    public void testGetIdByDate_Success() {
        Date testDate = new Date(1746118800000L);
        int expectedId = 42;

        when(sessionRepository.findIdByDate(testDate.toString())).thenReturn(expectedId);

        int actualId = sessionService.getIdByDate(testDate.toString());
        
        assert(actualId == expectedId);

        verify(sessionRepository, times(1)).findIdByDate(testDate.toString());
    }

    /*
     * getTextBySessionId method
     * Successful retrieval
     * Database error
     */
    
    @Test
    public void testGetTextBySessionId_Success() {
        int testSessionId = 42;
        String expectedText = "This is a test note.";

        when(textNoteRepository.findTextBySessionId(testSessionId)).thenReturn(expectedText);

        String actualText = sessionService.getTextBySessionId(testSessionId);
        
        assert(actualText.equals(expectedText));

        verify(textNoteRepository, times(1)).findTextBySessionId(testSessionId);
    }

    @Test
    public void testGetTextBySessionId_DatabaseError() {
        int testSessionId = 42;

        when(textNoteRepository.findTextBySessionId(testSessionId)).thenThrow(new RuntimeException("Database error"));

        String actualText = sessionService.getTextBySessionId(testSessionId);
        
        assert(actualText == null);

        verify(textNoteRepository, times(1)).findTextBySessionId(testSessionId);
    }

    /*
     * saveSession method
     * Successful save
     * Database error
     */

    @Test
    public void testSaveSession_Success() {
        Session testSession = new Session();

        when(sessionRepository.save(testSession)).thenReturn(testSession);

        boolean result = sessionService.saveSession(testSession);
        
        assertTrue(result);

        verify(sessionRepository, times(1)).save(testSession);
    }

    @Test
    public void testSaveSession_DatabaseError() {
        Session testSession = new Session();

        doThrow(new RuntimeException("Database error")).when(sessionRepository).save(testSession);

        boolean result = sessionService.saveSession(testSession);
        
        assertFalse(result);

        verify(sessionRepository, times(1)).save(testSession);
    }

    /*
     * updateTextBySessionId method
     * Successful update
     * Database error
     */

    @Test
    public void testUpdateTextBySessionId_Success() {
        int testSessionId = 42;
        String newText = "Updated note text.";

        doNothing().when(textNoteRepository).updateTextBySessionId(newText, testSessionId);

        boolean result = sessionService.updateTextBySessionId(newText, testSessionId);
        
        assertTrue(result);

        verify(textNoteRepository, times(1)).updateTextBySessionId(newText, testSessionId);
    }

    @Test
    public void testUpdateTextBySessionId_DatabaseError() {
        int testSessionId = 42;
        String newText = "Updated note text.";

        doThrow(new RuntimeException("Database error")).when(textNoteRepository).updateTextBySessionId(newText, testSessionId);

        boolean result = sessionService.updateTextBySessionId(newText, testSessionId);
        
        assertFalse(result);

        verify(textNoteRepository, times(1)).updateTextBySessionId(newText, testSessionId);
    }

    /*
     * getSessionByDateAndType method
     * Session found
     */

    @Test
    public void testGetSessionByDateAndType_SessionFound() {
        Date testDate = new Date(1746118800000L);
        SessionType testType = new SessionType();
        testType.setName("Training");
        Session testSession = new Session();
        testSession.setDate(testDate);
        testSession.setType(testType);

        when(sessionRepository.findDistinctByDateAndType(testDate, testType)).thenReturn(testSession);

        Session actualSession = sessionService.getSessionByDateAndType(testSession);
        
        assertTrue(actualSession == testSession);

        verify(sessionRepository, times(1)).findDistinctByDateAndType(testDate, testType);
    }

    /*
     * deleteSession method
     * Successful deletion
     * Database error
     */

    @Test
    public void testDeleteSession_Success() {
        Session testSession = new Session();

        doNothing().when(sessionRepository).delete(testSession);

        boolean result = sessionService.deleteSession(testSession);
        
        assertTrue(result);

        verify(sessionRepository, times(1)).delete(testSession);
    }

    @Test
    public void testDeleteSession_DatabaseError() {
        Session testSession = new Session();

        doThrow(new RuntimeException("Database error")).when(sessionRepository).delete(testSession);

        boolean result = sessionService.deleteSession(testSession);
        
        assertFalse(result);

        verify(sessionRepository, times(1)).delete(testSession);
    }
}
