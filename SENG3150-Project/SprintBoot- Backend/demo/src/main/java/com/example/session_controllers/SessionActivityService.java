/*
 * Author: Harrison Armstrong
 */

package com.example.session_controllers;

import org.springframework.stereotype.Service;

import com.example.repositories.ActivityRepository;
import com.example.repositories.SessionActivityRepository;
import com.example.repositories.SessionRepository;
import com.example.entities.Activity;
import com.example.entities.Session;
import com.example.entities.SessionActivity;

import java.util.List;
import java.util.Date;
import java.util.Optional;

@Service
public class SessionActivityService {
    
    private final ActivityRepository activityRepository;
    private final SessionActivityRepository sessionActivityRepository;
    private final SessionRepository sessionRepository;

    public SessionActivityService(ActivityRepository activityRepository, 
                                  SessionActivityRepository sessionActivityRepository,
                                  SessionRepository sessionRepository) {
        this.activityRepository = activityRepository;
        this.sessionActivityRepository = sessionActivityRepository;
        this.sessionRepository = sessionRepository;
    }

    public List<Activity> getActivitiesBySession(Session session) {
        try {
            List<Activity> activities = activityRepository.findActivitiesBySession(session.getId());
            return activities;
        } catch (Exception e) {
            System.out.println("Error retrieving activities for session: " + e.getMessage());
            return null;
        }
    }

    public Session getSessionByDateAndType(SessionActivity entity){
        String typeName = entity.getSession().getType().getName();
        Date date = entity.getSession().getDate();

        try{
            Session session = sessionRepository.findSessionByDateAndType(typeName, date);
            return (session != null) ? session : null;
        }
        catch (Exception e) {
            System.out.println("Error retrieving session by date and type: " + e.getMessage());
            return null;
        }
    }

    public Activity getActivityByName(String name) {
        try {
            Optional<Activity> activityTemp = activityRepository.findDistinctByName(name);
            Activity activity = activityTemp.get();
            return activity;
        } catch (Exception e) {
            System.out.println("Error retrieving activity by name: " + e.getMessage());
            return null;
        }
    }

    public boolean saveSessionActivity(SessionActivity sessionActivity) {
        try {
            sessionActivityRepository.save(sessionActivity);
            return true;
        } catch (Exception e) {
            System.out.println("Error saving session activity: " + e.getMessage());
            return false;
        }
    }

    public SessionActivity getSessionActivityBySessionAndActivity(Session session, Activity activity) {
        try {
            return sessionActivityRepository.findDistinctBySessionAndActivity(session, activity);
        } catch (Exception e) {
            System.out.println("Error retrieving session activity: " + e.getMessage());
            return null;
        }
    }

    public boolean deleteSessionActivity(SessionActivity sessionActivity) {
        try {
            sessionActivityRepository.delete(sessionActivity);
            return true;
        } catch (Exception e) {
            System.out.println("Error deleting session activity: " + e.getMessage());
            return false;
        }
    }

    public boolean editSessionActivityDuration(SessionActivity sessionActivity, String newDuration) {
        try{
            Date sessionDate = sessionActivity.getSession().getDate();
            int sessionID = sessionActivity.getSession().getId();
            String activityName = sessionActivity.getActivity().getName();

            sessionActivityRepository.updateSessionActivityDuration(
                newDuration, sessionDate, sessionID, activityName);
            return true;
        }
        catch (Exception e) {
            System.out.println("Error updating session activity duration: " + e.getMessage());
            return false;
        }
    }
}
