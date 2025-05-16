package com.example.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.entities.ActivityType;
import com.example.responses.CreateActivityTypeResponse;
import com.example.responses.GetActivityTypeResponse;

@RestController
@RequestMapping("/api/activityType")
public class ActivityTypeController {
    
    @Autowired
    ActivityTypeService activityTypeService;
    // Add methods to handle requests related to activity types

    @PostMapping("/api/activityType/create")
    public ResponseEntity<CreateActivityTypeResponse> createActivityType(@RequestBody ActivityType entity) {
        ActivityType newActivityType = new ActivityType();
        newActivityType.setName(entity.getName());
        newActivityType.setDescription(entity.getDescription());

        System.out.println("ActivityType object created: " + newActivityType.getName());

        boolean result = activityTypeService.createActivityType(newActivityType);
        if(result){
            return new ResponseEntity<>(new CreateActivityTypeResponse(true, "ActivityType created successfully"), HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>(new CreateActivityTypeResponse(false, "ActivityType creation failed"), HttpStatus.OK);
        }
    }

    @GetMapping(value="/api/activityType/getAll")
    public ResponseEntity<GetActivityTypeResponse> getAllActivityTypes() {
        System.out.println("REACHED APPPROPERIATE GET MAPPING");
        List<ActivityType> activityTypes = activityTypeService.getAllActivityTypes();
        return new ResponseEntity<>(new GetActivityTypeResponse(activityTypes, "Activity types returned"), HttpStatus.OK);
    }
    
}
