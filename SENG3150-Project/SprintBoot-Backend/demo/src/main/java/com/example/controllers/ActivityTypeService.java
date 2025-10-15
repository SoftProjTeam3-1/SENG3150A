package com.example.controllers;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.entities.ActivityType;
import com.example.repositories.ActivityTypeRepository;
import com.example.stored_procedures.CreateActivityType;
import com.example.stored_procedures.GetActivityTypes;

/**
 * ActivityTypeService performs actions such as add, create, view and delete directly to/from the repository.
 */
@Service
public class ActivityTypeService {
    
    private final ActivityTypeRepository activityTypeRepository;

    public ActivityTypeService(ActivityTypeRepository activityTypeRepository) {
        this.activityTypeRepository = activityTypeRepository;
    }

    /**
     * Create a new {@link ActivityType} and persists it to the repository.
     * @param activityType The ActivityType Entity to be created.
     * @return {@code true} if creation succeeded; {@code false} otherwise.
     */
    public boolean createActivityType(ActivityType activityType){
        CreateActivityType createActivityType = new CreateActivityType(activityTypeRepository);
        boolean isCreated = createActivityType.createActivityType(activityType);
        return isCreated;
    }

    /**
     * Return all {@link ActivityType} from the repository.
     * @return {@link List} containing {@link ActivityType}
     */
    public List<ActivityType> getAllActivityTypes(){
        GetActivityTypes getActivityTypes = new GetActivityTypes(activityTypeRepository);
        List<ActivityType> activityTypes = getActivityTypes.getAll();
        return activityTypes;
    }

    /**
     * Return a specific {@link ActivityType} from the repository.
     * @param name A string containing the name.
     * @return The requested {@link ActivityType}.
     */
    public ActivityType getDistinctByName(String name){
        GetActivityTypes getActivityTypes = new GetActivityTypes(activityTypeRepository);
        ActivityType activityType = getActivityTypes.getDistinctByName(name);
        return activityType;
    }

    /**
     * Delete a specific {@link ActivityType} from the repository.
     * @param name A string containing the name.
     * @return {@code true} if deletion succeeded; {@code false} otherwise.
     */
    public boolean deleteActivityType(String name){
        ActivityType activityType = activityTypeRepository.findDistinctByName(name);
        if (activityType != null) {
            activityTypeRepository.delete(activityType);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Update a specific {@link ActivityType} from the repository.
     * @param activityType The activityType to be updated
     * @return {@code true} if update succeeded; {@code false} otherwise.
     */
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
