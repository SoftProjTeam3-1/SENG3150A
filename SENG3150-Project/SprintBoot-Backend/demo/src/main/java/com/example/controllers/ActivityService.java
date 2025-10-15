package com.example.controllers;

import org.springframework.stereotype.Service;

import com.example.entities.Activity;
import com.example.entities.ActivityType;
import com.example.repositories.ActivityRepository;
import com.example.repositories.ActivityTypeRepository;
import com.example.stored_procedures.CreateActivity;

import java.util.List;

/**
 * The service that creates, views, modifies and deletes {@link Activity}.
 */
@Service
public class ActivityService {
    
    private final ActivityRepository activityRepository;
    private final ActivityTypeRepository activityTypeRespository;

    public ActivityService(ActivityRepository activityRepository, ActivityTypeRepository activityTypeRespository) {
        this.activityTypeRespository = activityTypeRespository;
        this.activityRepository = activityRepository;
    }

    /**
     * Creates an {@link Activity}
     * @param activity The {@link Activity} being created
     * @return {@code true} if creation succeeded; {@code false} otherwise
     */
    public boolean createActivity(Activity activity){
        CreateActivity createActivity = new CreateActivity(activityRepository);
        boolean isCreated = createActivity.createActivity(activity);
        return isCreated;
    }

    /**
     * Retrieves all {@link Activity}
     * @return Returns a {@link List} containing all {@link Activity} or {@code null} if there is an issue.
     */
    public List<Activity> getAllActivities(){
        try {
            List<Activity> activities = activityRepository.findAll();
            return activities;
        } catch (Exception e) {
            System.out.println("Error retrieving activities: " + e.getMessage());
            return null;
        }
    }

    /**
     * Retrieves all {@link Activity} that match activityType
     * @param activityType A String containing the name
     * @return Returns a {@link List} containing all {@link Activity} that match the given {@link String} or {@code null} if there is an issue.
     */
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

    /**
     * Delete an {@link Activity} that matches the name
     * @param name A String containing the name
     * @return {@code true} if creation succeeded; {@code false} otherwise
     */
    public boolean deleteActivity(String name){
        try {
            Activity activity = activityRepository.findDistinctByName(name);
            if (activity != null) {
                activityRepository.delete(activity);
                return true;
            } else {
                System.out.println("Activity not found: " + name);
                return false;
            }
        } catch (Exception e) {
            System.out.println("Error deleting activity: " + e.getMessage());
            return false;
        }
    }

    /**
     * Update an {@link Activity}
     * @param activity The {@link Activity} being modified
     * @return {@code true} if creation succeeded; {@code false} otherwise
     */
    public boolean updateActivity(Activity activity){
        try{
            System.out.println("\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n" + "Reached updateActivity function in ActivityService!");
            System.out.println("Activity to update: " + activity.getName());
            Activity existingActivity = activityRepository.findDistinctByName(activity.getName());
            if (existingActivity != null) {
                System.out.println("Existing activity found: " + existingActivity.getName());
                activityRepository.updateActivity(existingActivity.getId(), 
                    activity.getPeopleRequired(),
                    activity.getName(), 
                    activity.getDescription(),
                    activity.isFavourite(),  
                    activity.getDuration());
                return true;
            } else {
                System.out.println("Activity not found for update: " + activity.getName());
                return false;
            }
        } catch (Exception e) {
            System.out.println("Error in updateActivity: " + e.getMessage());
            return false;
        }
    }
}