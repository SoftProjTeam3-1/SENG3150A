package com.example.session_controllers;

import com.example.entities.SessionActivity;
import com.example.entities.Session;
import com.example.entities.Activity;
import com.example.entities.User;
import com.example.entities.SessionType;
import com.example.entities.ActivityType;
import com.example.repositories.ActivityRepository;
import com.example.repositories.SessionActivityRepository;
import com.example.repositories.SessionRepository;

import java.util.List;
import java.sql.Date;

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
import org.mockito.Mockito;

@ExtendWith(MockitoExtension.class)
public class SessionActivityServiceTest {

    @Mock
    private SessionActivityRepository sessionActivityRepository;

    @Mock
    private ActivityRepository activityRepository;

    @Mock SessionRepository sessionRepository;

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

    /*
     * GET ACTIVITIES BY SESSION FUNCTIONS
     * SUCCESS AND FAIL TESTS
     */

    @Test
    public void testGetActivitiesBySession_DatabaseError() throws Exception {
        Session session = new Session();
        doThrow(new RuntimeException())
            .when(activityRepository).findActivitiesBySession(session.getId());

        List<Activity> result = sessionActivityService.getActivitiesBySession(session);

        assertTrue(result == null, "Expected exception thrown during retrieval process");
        verify(activityRepository, times(1)).findActivitiesBySession(session.getId());
    }

    @Test
    public void testGetActivitiesBySession_SuccessfulRetrieval() throws Exception { 
        Session session = new Session();

        List<Activity> result = sessionActivityService.getActivitiesBySession(session);

        assertTrue(result != null, "Expected successful deletion of session activity");
        verify(activityRepository, times(1)).findActivitiesBySession(session.getId());    
    }

    /*
     * getSessionByDateAndType TESTS
     * SUCCESS AND FAIL AND DATA_NOT_FOUND TESTS
     */

    @Test
    public void testGetSessionByDateAndType_DatabaseError() throws Exception {
        Session session = new Session(new Date(1746118800000L), new User(), new SessionType("", ""));
        Activity activity = new Activity();
        SessionActivity sessionActivity = new SessionActivity(session, activity, "0mins", 1);
        doThrow(new RuntimeException())
            .when(sessionRepository).findSessionByDateAndType("", session.getDate());

        Session result = sessionActivityService.getSessionByDateAndType(sessionActivity);

        assertTrue(result == null, "Expected exception thrown during retrieval process");
        verify(sessionRepository, times(1)).findSessionByDateAndType(session.getType().getName(), session.getDate());
    }

    @Test
    public void testGetSessionByDateAndType_UnsuccessfulRetrieval() throws Exception { 
        Session session = new Session(new Date(1746118800000L), new User(), new SessionType("", ""));
        Activity activity = new Activity();
        SessionActivity sessionActivity = new SessionActivity(session, activity, "0mins", 1);

        Session result = sessionActivityService.getSessionByDateAndType(sessionActivity);

        assertTrue(result == null, "Expected successful retrieval of session");
        verify(sessionRepository, times(1)).findSessionByDateAndType(session.getType().getName(), session.getDate());    
    }

    @Test
    public void testGetSessionByDateAndType_SuccessfulRetrieval() throws Exception { 
        Session session = new Session(new Date(1746118800000L), new User(), new SessionType("", ""));
        Activity activity = new Activity();
        SessionActivity sessionActivity = new SessionActivity(session, activity, "0mins", 1);
        
        Mockito.when(sessionRepository.findSessionByDateAndType(session.getType().getName(), session.getDate()))
            .thenReturn(session);

        Session result = sessionActivityService.getSessionByDateAndType(sessionActivity);

        assertTrue(result != null, "Expected successful retrieval of session");
        verify(sessionRepository, times(1)).findSessionByDateAndType(session.getType().getName(), session.getDate());    
    }

    /**
     * GET ACTIVITY BY NAME TESTS
     * SUCCESS AND FAIL AND DATABASE FAILURE TEST
     */

    @Test
    public void testGetActivityByName_DatabaseError() throws Exception {
        String name = "Test Activity";
        
        doThrow(new RuntimeException())
            .when(activityRepository).findDistinctByName(name);

        Activity result = sessionActivityService.getActivityByName(name);

        assertTrue(result == null, "Expected exception thrown during retrieval process");
        verify(activityRepository, times(1)).findDistinctByName(name);
    }

    @Test
    public void testGetActivityByName_SuccessfulRetrieval() throws Exception { 
        String name = "Dribbling";

        Mockito.when(activityRepository.findDistinctByName(name))
            .thenReturn(new Activity());

        Activity result = sessionActivityService.getActivityByName(name);

        assertTrue(result != null, "Expected successful retrieval of activity");
        verify(activityRepository, times(1)).findDistinctByName(name);    
    }

    /**
     * GET SESSION ACTIVITY BY SESSION AND ACTIVITY TESTS
     * SUCCESS AND FAIL AND DATABASE FAILURE TEST
     */

    @Test
    public void testGetSessionActivityBySessionAndActivity_DatabaseError() throws Exception {
        Session session = new Session();
        Activity activity = new Activity();
        
        doThrow(new RuntimeException())
            .when(sessionActivityRepository).findDistinctBySessionAndActivity(session, activity);

        SessionActivity result = sessionActivityService.getSessionActivityBySessionAndActivity(session, activity);

        assertTrue(result == null, "Expected exception thrown during retrieval process");
        verify(sessionActivityRepository, times(1)).findDistinctBySessionAndActivity(session, activity);
    }

    @Test
    public void testGetSessionActivityBySessionAndActivity_SuccessfulRetrieval() throws Exception { 
        Session session = new Session();
        Activity activity = new Activity();

        Mockito.when(sessionActivityRepository.findDistinctBySessionAndActivity(session, activity))
            .thenReturn(new SessionActivity());

        SessionActivity result = sessionActivityService.getSessionActivityBySessionAndActivity(session, activity);

        assertTrue(result != null, "Expected successful retrieval of session activity");
        verify(sessionActivityRepository, times(1)).findDistinctBySessionAndActivity(session, activity);    
    }
}
