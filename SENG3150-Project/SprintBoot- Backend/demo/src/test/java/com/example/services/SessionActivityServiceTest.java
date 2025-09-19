package com.example.services;

import com.example.entities.Activity;
import com.example.entities.Session;
import com.example.entities.SessionActivity;
import com.example.entities.SessionType;
import com.example.repositories.ActivityRepository;
import com.example.repositories.SessionActivityRepository;
import com.example.repositories.SessionRepository;
import com.example.session_controllers.SessionActivityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionActivityServiceTest {
    @Mock
    ActivityRepository activityRepository;
    @Mock
    SessionActivityRepository sessionActivityRepository;
    @Mock
    SessionRepository sessionRepository;

    @InjectMocks
    SessionActivityService service;
    Session session;
    Activity activity;
    SessionActivity sessionActivity;

    @BeforeEach
    void setUp() {
        session = new Session();
        session.setId(10);
        Date date = Date.valueOf(LocalDate.of(2025, 9, 11));
        session.setDate(date);

        var type = new SessionType();
        type.setName("Training");
        session.setType(type);

        activity = new Activity();
        activity.setName("Squats");

        sessionActivity = new SessionActivity();
        sessionActivity.setSession(session);
        sessionActivity.setActivity(activity);
    }

    @Test
    void getActivitiesBySession_Success_ReturnList(){
        int sessionId = 10;
        List<Activity> sessionActivityList = new ArrayList<>();
        sessionActivityList.add(activity);

        when(activityRepository.findActivitiesBySession(sessionId)).thenReturn(sessionActivityList);

        List<Activity> testList = service.getActivitiesBySession(session);

        assertEquals(sessionActivityList, testList);

        verify(activityRepository).findActivitiesBySession(sessionId);
    }

    @Test
    void getActivitiesBySession_Fail_ReturnEmptyList(){
        int sessionId = 10;

        when(activityRepository.findActivitiesBySession(sessionId)).thenThrow(new RuntimeException());

        assertNull(service.getActivitiesBySession(session));

        verify(activityRepository).findActivitiesBySession(sessionId);
    }

    @Test
    void getSessionByDateAndType_Success_ReturnSession(){
        String type = "Training";

        when(sessionRepository.findSessionByDateAndType(type, session.getDate())).thenReturn(session);

        Session out = service.getSessionByDateAndType(sessionActivity);

        assertSame(session, out);

        verify(sessionRepository).findSessionByDateAndType(type, session.getDate());
    }

    @Test
    void getSessionByDateAndType_Fail_ReturnNull(){
        String type = "Training";

        when(sessionRepository.findSessionByDateAndType(type, session.getDate())).thenThrow(new RuntimeException());

        assertNull(service.getSessionByDateAndType(sessionActivity));

        verify(sessionRepository).findSessionByDateAndType(type, session.getDate());
    }

    @Test
    void getActivityByName_Success_ReturnActivity(){
        when(activityRepository.findDistinctByName(activity.getName())).thenReturn(activity);

        assertSame(activity, service.getActivityByName(activity.getName()));

        verify(activityRepository).findDistinctByName(activity.getName());
    }

    @Test
    void getActivityByName_Fail_ReturnNull(){
        when(activityRepository.findDistinctByName(activity.getName())).thenThrow(new RuntimeException());

        assertNull(service.getActivityByName(activity.getName()));

        verify(activityRepository).findDistinctByName(activity.getName());
    }

    @Test
    void saveSessionActivity_Success_ReturnTrue(){
        when(sessionActivityRepository.save(sessionActivity)).thenReturn(sessionActivity);

        assertTrue(service.saveSessionActivity(sessionActivity));

        verify(sessionActivityRepository).save(sessionActivity);
    }

    @Test
    void saveSessionActivity_Fail_ReturnFalse(){
        when(sessionActivityRepository.save(sessionActivity)).thenThrow(new RuntimeException());

        assertFalse(service.saveSessionActivity(sessionActivity));

        verify(sessionActivityRepository).save(sessionActivity);
    }

    @Test
    void getSessionActivityBySessionAndActivity_Success_ReturnSession(){
        when(sessionActivityRepository.findDistinctBySessionAndActivity(session, activity)).thenReturn(sessionActivity);

        assertSame(sessionActivity, service.getSessionActivityBySessionAndActivity(session, activity));

        verify(sessionActivityRepository).findDistinctBySessionAndActivity(session, activity);
    }

    @Test
    void getSessionActivityBySessionAndActivity_Fail_ReturnNull(){
        when(sessionActivityRepository.findDistinctBySessionAndActivity(session, activity)).thenThrow(new RuntimeException());

        assertNull(service.getSessionActivityBySessionAndActivity(session, activity));

        verify(sessionActivityRepository).findDistinctBySessionAndActivity(session, activity);
    }

    @Test
    void deleteSessionActivity_Success_ReturnTrue(){
        doNothing().when(sessionActivityRepository).delete(sessionActivity);

        assertTrue(service.deleteSessionActivity(sessionActivity));

        verify(sessionActivityRepository).delete(sessionActivity);
    }

    @Test
    void deleteSessionActivity_Fail_ReturnFalse(){
        doThrow(new RuntimeException()).when(sessionActivityRepository).delete(sessionActivity);

        assertFalse(service.deleteSessionActivity(sessionActivity));

        verify(sessionActivityRepository).delete(sessionActivity);
    }

    @Test
    void editSessionActivity_Success_ReturnTrue(){
        String duration = "45";

        when(sessionActivityRepository.updateSessionActivityDuration(duration, session.getDate(),session.getId(),activity.getName())).thenReturn(1);

        assertTrue(service.editSessionActivityDuration(sessionActivity, duration));

        verify(sessionActivityRepository).updateSessionActivityDuration(eq(duration), eq(session.getDate()), eq(session.getId()), eq(activity.getName()));
    }

    @Test
    void editSessionActivity_Fail_ReturnFalse(){
        String duration = "45";

        doThrow(new RuntimeException()).when(sessionActivityRepository).updateSessionActivityDuration(duration, session.getDate(),session.getId(),activity.getName());

        assertFalse(service.editSessionActivityDuration(sessionActivity, duration));

        verify(sessionActivityRepository).updateSessionActivityDuration(duration, session.getDate(), session.getId(), activity.getName());
    }
}