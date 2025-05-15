package com.example.controllers;

import org.springframework.stereotype.Service;

import com.example.entities.Activity;
import com.example.repositories.ActivityRepository;
import com.example.stored_procedures.CreateActivity;

import java.util.List;


@Service
public class ActivityService {
    
    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public boolean createActivity(Activity activity){
        CreateActivity createActivity = new CreateActivity(activityRepository);
        boolean isCreated = createActivity.createActivity(activity);
        return isCreated;
    }

    public List<Activity> getAllActivities(){
        try {
            List<Activity> activities = activityRepository.findAll();
            return activities;
        } catch (Exception e) {
            System.out.println("Error retrieving activities: " + e.getMessage());
            return null;
        }
    }
}
