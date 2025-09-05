package com.example.controllers;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.entities.ActivityType;
import com.example.repositories.ActivityTypeRepository;
import com.example.stored_procedures.CreateActivityType;
import com.example.stored_procedures.GetActivityTypes;


@Service
public class ActivityTypeService {
    
    private final ActivityTypeRepository activityTypeRepository;

    public ActivityTypeService(ActivityTypeRepository activityTypeRepository) {
        this.activityTypeRepository = activityTypeRepository;
    }

    public boolean createActivityType(ActivityType activityType){
        if (activityType == null) {
            return false;
        }
        CreateActivityType createActivityType = new CreateActivityType(activityTypeRepository);
        boolean isCreated = createActivityType.createActivityType(activityType);
        return isCreated;
    }

    public List<ActivityType> getAllActivityTypes(){
        GetActivityTypes getActivityTypes = new GetActivityTypes(activityTypeRepository);
        List<ActivityType> activityTypes = getActivityTypes.getAll();
        return activityTypes;
    }

    public ActivityType getDistinctByName(String name){
        GetActivityTypes getActivityTypes = new GetActivityTypes(activityTypeRepository);
        ActivityType activityType = getActivityTypes.getDistinctByName(name);
        return activityType;
    }

    public boolean deleteActivityType(String name){
        ActivityType activityType = activityTypeRepository.findDistinctByName(name);
        if (activityType != null) {
            activityTypeRepository.delete(activityType);
            return true;
        } else {
            return false;
        }
    }

    public boolean updateActivityType(ActivityType activityType){
        try{
            ActivityType existingActivityType = activityTypeRepository.findDistinctByName(activityType.getName());
            if (existingActivityType != null) {
                activityTypeRepository.updateActivityType(existingActivityType.getId(), 
                    activityType.getName(), 
                    activityType.getDescription());
                return true;
            } else {
                return false;
            }
        }
        catch(Exception e){
            System.out.println("Error in updateActivityType: " + e.getMessage());
            return false;
        }
    }
}
