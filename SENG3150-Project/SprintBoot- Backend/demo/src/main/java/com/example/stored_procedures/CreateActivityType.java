package com.example.stored_procedures;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.stereotype.Service;

import com.example.entities.ActivityType;
import com.example.repositories.ActivityTypeRepository;

@Service
public class CreateActivityType {
    
    private final ActivityTypeRepository activityTypeRepository;
    private static final Logger LOGGER = Logger.getLogger(CreateActivityType.class.getName());

    public CreateActivityType(ActivityTypeRepository activityTypeRepository) {
        this.activityTypeRepository = activityTypeRepository;
    }

    public boolean createActivityType(ActivityType activityType) {
        if (activityType == null) {
            System.out.println("ActivityType is null. Cannot save.");
            return false;
        }
        try {
            activityTypeRepository.save(activityType);
            return true;
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error while saving new activity type", e);
            return false;
        }
    }
}
