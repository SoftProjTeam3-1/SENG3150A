package com.example.stored_procedures;

import org.springframework.stereotype.Service;

import com.example.repositories.ActivityRepository;
import com.example.entities.Activity;

@Service
public class DeleteActivity {

    private final ActivityRepository activityRepository;

    public DeleteActivity(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public boolean deleteActivity(int activityId) {
        try {
            Activity activity = activityRepository.findById(activityId);
            if (activity != null) {
                activityRepository.delete(activity);
                return true;
            } else {
                System.out.println("Activity not found with ID: " + activityId);
                return false;
            }
        } catch (Exception e) {
            System.out.println("Error while deleting activity: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

}
