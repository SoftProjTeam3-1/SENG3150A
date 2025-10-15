/*
 * Author: Harrison Armstrong
 */

package com.example.session_controllers;

import com.example.entities.ActivityType;
import org.springframework.stereotype.Service;

import com.example.repositories.ActivityRepository;
import com.example.repositories.SessionActivityRepository;
import com.example.repositories.SessionRepository;
import com.example.entities.Activity;
import com.example.entities.Session;
import com.example.entities.SessionActivity;

import java.util.List;
import java.util.Date;

/**
 * The SessionActivity performs actions such as add, create, view and delete directly to/from the repository.
 */
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

    /**
     * Return all Activity based on the Session from the repository.
     * @param session The Session we are getting all activities from.
     * @return {@link List} containing {@link Activity}
     */
    public List<Activity> getActivitiesBySession(Session session) {
        try {
            List<Activity> activities = activityRepository.findActivitiesBySession(session.getId());
            return activities;
        } catch (Exception e) {
            System.out.println("Error retrieving activities for session: " + e.getMessage());
            return null;
        }
    }

    /**
     * Retrieve the Session based on Date and Type from the {@link SessionActivity} given.
     * @param entity The Session Activity.
     * @return {@link Session} if successful; Otherwise null.
     */
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

    /**
     * Get an Activity based on the name given.
     * @param name The name given.
     * @return {@link Activity}; Otherwise null.
     */
    public Activity getActivityByName(String name) {
        try {
            Activity activity = activityRepository.findDistinctByName(name);
            return activity;
        } catch (Exception e) {
            System.out.println("Error retrieving activity by name: " + e.getMessage());
            return null;
        }
    }

    /**
     * Save a new SessionActivity
     * @param sessionActivity The given SessionActivity
     * @return {@code true} if save succeeded; {@code false} otherwise.
     */
    public boolean saveSessionActivity(SessionActivity sessionActivity) {
        try {
            sessionActivityRepository.save(sessionActivity);
            return true;
        } catch (Exception e) {
            System.out.println("Error saving session activity: " + e.getMessage());
            return false;
        }
    }

    /**
     * Get the SessionActivity from the given Session and Activity.
     * @param session The given Session.
     * @param activity The given Activity.
     * @return {@link SessionActivity} if successful; Otherwise {@code null}.
     */
    public SessionActivity getSessionActivityBySessionAndActivity(Session session, Activity activity) {
        try {
            return sessionActivityRepository.findDistinctBySessionAndActivity(session, activity);
        } catch (Exception e) {
            System.out.println("Error retrieving session activity: " + e.getMessage());
            return null;
        }
    }

    /**
     * Delete the given SessionActivity from the repository.
     * @param sessionActivity The given {@link SessionActivity}
     * @return {@code true} if deletion succeeded; {@code false} otherwise.
     */
    public boolean deleteSessionActivity(SessionActivity sessionActivity) {
        try {
            sessionActivityRepository.delete(sessionActivity);
            return true;
        } catch (Exception e) {
            System.out.println("Error deleting session activity: " + e.getMessage());
            return false;
        }
    }

    /**
     * Edit the SessionActivity with a newDuration.
     * @param sessionActivity The given {@link SessionActivity}
     * @param newDuration A {@link String} for the newDuration
     * @return {@code true} if update succeeded; {@code false} otherwise.
     */
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