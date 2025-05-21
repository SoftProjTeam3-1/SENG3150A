package com.example.controllers;

import org.springframework.stereotype.Service;

import com.example.entities.Activity;
import com.example.entities.ActivityType;
import com.example.repositories.ActivityRepository;
import com.example.repositories.ActivityTypeRepository;
import com.example.stored_procedures.CreateActivity;

import java.util.List;


@Service
public class ActivityService {
    
    private final ActivityRepository activityRepository;
    private final ActivityTypeRepository activityTypeRespository;

    public ActivityService(ActivityRepository activityRepository, ActivityTypeRepository activityTypeRespository) {
        this.activityTypeRespository = activityTypeRespository;
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

    public List<Activity> getActivitiesByType(String activityType) {
        try {
            System.out.println("Reached Activity Service function!!!!");
            ActivityType resultActivityTypeQuery = activityTypeRespository.findDistinctByName(activityType);
            System.out.println("ActivityType object found: " + resultActivityTypeQuery.getName());
            List<Activity> activities = activityRepository.findByActivityType(resultActivityTypeQuery);
            System.out.println("Activities found: " + activities.size());
            return activities;
        } catch (Exception e) {
            System.out.println("Error retrieving activities: " + e.getMessage());
            return null;
        }
    }
}
