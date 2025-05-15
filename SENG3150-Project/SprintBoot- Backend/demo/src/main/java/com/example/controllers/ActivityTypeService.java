package com.example.controllers;

import org.springframework.stereotype.Service;

import com.example.entities.ActivityType;
import com.example.repositories.ActivityTypeRepository;
import com.example.stored_procedures.CreateActivityType;


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
}
