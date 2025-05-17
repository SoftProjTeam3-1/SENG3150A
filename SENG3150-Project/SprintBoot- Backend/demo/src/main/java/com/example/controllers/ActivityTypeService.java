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
}
