package com.example.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.example.responses.CreateActivityResponse;
import com.example.responses.GetActivityResponse;
import com.example.entities.Activity;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {
    @Autowired
    ActivityService activityService;

    @PostMapping(value="/api/activity/create")
    public ResponseEntity<CreateActivityResponse> createActivity(@RequestBody Activity entity){
        Activity newActivity = new Activity();
        newActivity.setName(entity.getName());
        newActivity.setDescription(entity.getDescription());
        newActivity.setPeopleRequired(entity.getPeopleRequired());
        newActivity.setDuration(entity.getDuration());
        newActivity.setActivityType(entity.getActivityType());

        System.out.println("Activity object created: " + newActivity.getName());

        Boolean result = activityService.createActivity(newActivity);

        if(result){
            return new ResponseEntity<>(new CreateActivityResponse(true, "Activity created successfully"), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new CreateActivityResponse(false, "Activity creation failed"), HttpStatus.OK);
        }
    }

    @GetMapping(value="/api/activity/getAll")
    public ResponseEntity<GetActivityResponse> getAllActivities(){
        List<Activity> activities = activityService.getAllActivities();
        return new ResponseEntity<>(new GetActivityResponse(activities, "Activities returned"), HttpStatus.OK);
    }
}
