package com.example.stored_procedures;

import org.springframework.stereotype.Service;

import com.example.entities.Activity;
import com.example.repositories.ActivityRepository;

@Service
public class CreateActivity {
    
    private final ActivityRepository activityRepository;

    public CreateActivity(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public boolean createActivity(Activity activity) {
        try {
            activityRepository.save(activity);
            return true;
        } catch (Exception e) {
            System.out.println("Error while saving activity: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
