package com.example.services;

import com.example.entities.Session;
import com.example.entities.SessionType;
import com.example.entities.TextNote;
import com.example.repositories.SessionRepository;
import com.example.repositories.SessionTypeRepository;
import com.example.repositories.TextNoteRepository;
import com.example.session_controllers.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    SessionRepository sessionRepository;
    @Mock
    SessionTypeRepository sessionTypeRepository;
    @Mock
    TextNoteRepository textNoteRepository;

    @InjectMocks
    SessionService testService;
    Session testSession;
    SessionType testSessionType;

    @BeforeEach
    public void setup() {
        testSessionType = new SessionType();
        testSessionType.setId(1);
        testSessionType.setName("Training");

        testSession = new Session();
        testSession.setId(42);
        Date date = Date.valueOf(LocalDate.of(2025, 9, 11));
        testSession.setDate(date);
        testSession.setType(testSessionType);
        List<TextNote> sessionTypeList = new ArrayList<>();
        sessionTypeList.add(new TextNote("Note", testSession));
        testSession.setTextNotes(sessionTypeList);

    }

    @Test
    void getIdByDate_ReturnsId(){
        int expectedId = 42;
        String date = "2025-09-11";

        when(sessionRepository.findIdByDate(date)).thenReturn(expectedId);

        int id = testService.getIdByDate(date);

        assertEquals(expectedId, id);

        verify(sessionRepository).findIdByDate(date);
    }

    @Test
    void getTextBySessionId_Success_ReturnsText(){
        String expectedText = "Note";
        int sessionId = 42;

        when(textNoteRepository.findTextBySessionId(sessionId)).thenReturn(expectedText);

        String text = testService.getTextBySessionId(sessionId);

        assertEquals(expectedText, text);

        verify(textNoteRepository).findTextBySessionId(sessionId);
    }

    @Test
    void getTextBySessionId_Fail_ReturnsNull(){
        int sessionId = 43;

        when(textNoteRepository.findTextBySessionId(sessionId)).thenThrow(new RuntimeException());

        assertNull(testService.getTextBySessionId(sessionId));

        verify(textNoteRepository).findTextBySessionId(sessionId);
    }

    @Test
    void saveSession_Success_ReturnsTrue(){
        when(sessionRepository.save(testSession)).thenReturn(testSession);

        assertTrue(testService.saveSession(testSession));

        verify(sessionRepository).save(testSession);
    }

    @Test
    void saveSession_Fail_ReturnsFalse(){
        when(sessionRepository.save(testSession)).thenThrow(new RuntimeException());

        assertFalse(testService.saveSession(testSession));

        verify(sessionRepository).save(testSession);
    }

    @Test
    void updateTextBySessionId_Success_ReturnsTrue(){
        int sessionId = 42;
        String text = "Note";

        doNothing().when(textNoteRepository).updateTextBySessionId(text, sessionId);

        assertTrue(testService.updateTextBySessionId(text, sessionId));

        verify(textNoteRepository).updateTextBySessionId(text, sessionId);
    }

    @Test
    void updateTextBySessionId_Fail_ReturnsFalse(){
        int sessionId = 43;
        String text = "Note";

        doThrow(new RuntimeException()).when(textNoteRepository).updateTextBySessionId(text, sessionId);

        assertFalse(testService.updateTextBySessionId(text, sessionId));

        verify(textNoteRepository).updateTextBySessionId(text, sessionId);
    }

    @Test
    void getSessionByDateAndType(){
        when(sessionRepository.findDistinctByDateAndType(testSession.getDate(), testSession.getType())).thenReturn(testSession);

        Session found = testService.getSessionByDateAndType(testSession);
        assertNotNull(found);

        assertEquals(testSession, found);

        verify(sessionRepository).findDistinctByDateAndType(testSession.getDate(), testSession.getType());
    }

    @Test
    void deleteSession_Success_ReturnsTrue(){
        doNothing().when(sessionRepository).delete(testSession);

        assertTrue(testService.deleteSession(testSession));

        verify(sessionRepository).delete(testSession);
    }

    @Test
    void deleteSession_Fail_ReturnsFalse(){
        doThrow(new RuntimeException()).when(sessionRepository).delete(testSession);

        assertFalse(testService.deleteSession(testSession));

        verify(sessionRepository).delete(testSession);
    }
}
