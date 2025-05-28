package com.example.session_controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.repositories.ActivityRepository;
import com.example.entities.Activity;
import com.example.entities.Session;

import java.util.List;

@Service
public class SessionActivityService {
    
    private final ActivityRepository activityRepository;

    public SessionActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
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
}
