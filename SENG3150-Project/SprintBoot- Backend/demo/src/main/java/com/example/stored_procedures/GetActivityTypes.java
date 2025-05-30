/*
 * Author: Harrison Armstrong
 */

package com.example.stored_procedures;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.repositories.ActivityTypeRepository;
import com.example.entities.ActivityType;

@Service
public class GetActivityTypes {
    
    private final ActivityTypeRepository activityTypeRepository;

    public GetActivityTypes(ActivityTypeRepository activityTypeRepository) {
        this.activityTypeRepository = activityTypeRepository;
    }

    public List<ActivityType> getAll() {
        try {
            return activityTypeRepository.findAll();
        } catch (Exception e) {
            System.out.println("Error while fetching activity types: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public ActivityType getDistinctByName(String name){
        try {
            return activityTypeRepository.findDistinctByName(name);
        } catch (Exception e) {
            System.out.println("Error while fetching activity type by name: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}
