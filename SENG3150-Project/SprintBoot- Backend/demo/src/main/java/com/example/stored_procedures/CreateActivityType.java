/*
 * Author: Harrison Armstrong
 */

package com.example.stored_procedures;

import org.springframework.stereotype.Service;

import com.example.entities.ActivityType;
import com.example.repositories.ActivityTypeRepository;

@Service
public class CreateActivityType {
    
    private final ActivityTypeRepository activityTypeRepository;

    public CreateActivityType(ActivityTypeRepository activityTypeRepository) {
        this.activityTypeRepository = activityTypeRepository;
    }

    public boolean createActivityType(ActivityType activityType) {
        try {
            activityTypeRepository.save(activityType);
            return true;
        } catch (Exception e) {
            System.out.println("Error while saving new activity type: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
