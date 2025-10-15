package com.example.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.entities.Activity;
import com.example.responses.CreateActivityResponse;
import com.example.responses.DeleteActivityResponse;
import com.example.responses.GetActivityResponse;
import com.example.responses.UpdateActivityResponse;

/**
 * REST controller for managing {@link Activity} resources.
 * Provides endpoints to create, retrieve by type, update, and delete activities.
 */
@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    @Autowired
    ActivityService activityService;
    @Autowired
    ActivityTypeService activityTypeService;

    /**
     * Handles HTTP POST requests to create an activity.
     * @param entity The {@link Activity} request payload that contains the name, description, peopleRequired, duration, activityType.
     * @return {@link ResponseEntity} containing a {@link CreateActivityResponse} as well as a message indicating whether creation was successful.
     */
    @PostMapping(value="/create")
    public ResponseEntity<CreateActivityResponse> createActivity(@RequestBody Activity entity){
        System.out.println("REACHED APPPROPRIATE POST MAPPING?!");
        Activity newActivity = new Activity();
        newActivity.setName(entity.getName());
        newActivity.setDescription(entity.getDescription());
        newActivity.setPeopleRequired(entity.getPeopleRequired());
        newActivity.setDuration(entity.getDuration());
        newActivity.setActivityType(activityTypeService.getDistinctByName(entity.getActivityType().getName()));

        System.out.println("Activity object created: " + newActivity.getName());

        Boolean result = activityService.createActivity(newActivity);

        if(result){
            return new ResponseEntity<>(new CreateActivityResponse(true, "Activity created successfully"), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new CreateActivityResponse(false, "Activity creation failed"), HttpStatus.OK);
        }
    }

    /**
     * Handles HTTP POST requests to return activities filtered by ActivityType.
     * @param activityType The {@link ActivityTypeRequest} request payload.
     * @return {@link ResponseEntity} containing {@link GetActivityResponse} as well as a message stating that the activities have been returned.
     */
    @PostMapping(value="/getByActivityType")
    public ResponseEntity<GetActivityResponse> getAllActivities(@RequestBody ActivityTypeRequest activityType){
        System.out.println("REACHED APPPROPERIATE GET MAPPING?!");
        String activityTypeName = activityType.getActivityType();
        System.out.println("This is the activity type name recovered "+activityTypeName);
        List<Activity> activities = activityService.getActivitiesByType(activityTypeName);
        return new ResponseEntity<>(new GetActivityResponse(activities, "Activities returned"), HttpStatus.OK);
    }

    /**
     * Handles HTTP POST requests to delete a given activity.
     * @param activity The {@link Activity} request payload.
     * @return {@link ResponseEntity} containing {@link DeleteActivityResponse} as well as a message indicating whether deletion was successful.
     */
    @PostMapping(value="/delete")
    public ResponseEntity<DeleteActivityResponse> deleteActivity(@RequestBody Activity activity){
        boolean result = activityService.deleteActivity(activity.getName());
        if(result){
            return new ResponseEntity<>(new DeleteActivityResponse(true, "Activity deleted successfully"), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new DeleteActivityResponse(false, "Activity deletion failed"), HttpStatus.OK);
        }
    }

    /**
     * Handles HTTP POST requests to update a given activity.
     * @param entity The {@link Activity} request payload.
     * @return {@link ResponseEntity} containing {@link UpdateActivityResponse} as well as a message indicating whether updating the activity was successful.
     */
    @PostMapping(value="/update")
    public ResponseEntity<UpdateActivityResponse> updateActivity(@RequestBody Activity entity){
        System.out.println("REACHED THE UPDATE MAPPING LETS GO!");
        boolean result = activityService.updateActivity(entity);
        if(result){
            return new ResponseEntity<>(new UpdateActivityResponse(true, "Activity updated successfully"), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new UpdateActivityResponse(false, "Activity update failed"), HttpStatus.OK);
        }
    }
}   