package com.example.session_controllers;

import com.example.entities.SessionActivity;
import com.example.entities.Session;
import com.example.entities.Activity;

import com.example.repositories.SessionActivityRepository;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
public class SessionActivityServiceTest {

    @Mock
    private SessionActivityRepository sessionActivityRepository;

    @InjectMocks
    private SessionActivityService sessionActivityService;
    
    /*
     * DELETE SESSION ACTIVITY TESTS FOR SESSIONACTIVITY SERVICE
     */



        // test for database error
    @Test
    public void testDeleteSessionActivity_DatabaseError() throws Exception {
        SessionActivity sessionActivity = new SessionActivity();
        doThrow(new RuntimeException())
            .when(sessionActivityRepository).delete(sessionActivity);

        boolean result = sessionActivityService.deleteSessionActivity(sessionActivity);

        assertFalse(result, "Expected exception thrown during deletion process");
        verify(sessionActivityRepository, times(1)).delete(sessionActivity);
    }
        
    // test for successful deletion
    @Test
    public void testDeleteSessionActivity_SuccessfulDeletion() throws Exception {
        SessionActivity sessionActivity = new SessionActivity();

        boolean result = sessionActivityService.deleteSessionActivity(sessionActivity);

        assertTrue(result, "Expected successful deletion of session activity");
        verify(sessionActivityRepository, times(1)).delete(sessionActivity);
    }

    /*
     * ADD SESSION ACTIVITY TESTS FOR SESSIONACTIVITY SERVICE
     */

        // test for database error
    @Test
    public void testAddSessionActivity_DatabaseError() throws Exception {
        SessionActivity sessionActivity = new SessionActivity();
        doThrow(new RuntimeException())
            .when(sessionActivityRepository).save(sessionActivity);

        boolean result = sessionActivityService.saveSessionActivity(sessionActivity);

        assertFalse(result, "Expected exception thrown during saving process");
        verify(sessionActivityRepository, times(1)).save(sessionActivity);
    }


        // test for successful addition
    @Test
    public void testAddSessionActivity_SuccessfulAddition() throws Exception {
        SessionActivity sessionActivity = new SessionActivity();

        boolean result = sessionActivityService.saveSessionActivity(sessionActivity);

        assertTrue(result, "Expected successful deletion of session activity");
        verify(sessionActivityRepository, times(1)).save(sessionActivity);
    }
}
