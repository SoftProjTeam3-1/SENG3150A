package com.example.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.entities.ActivityType;
import com.example.responses.CreateActivityTypeResponse;
import com.example.responses.GetActivityTypeResponse;
import com.example.responses.DeleteActivityTypeResponse;
import com.example.responses.UpdateActivityTypeResponse;

@CrossOrigin(origins = "http://localhost:5173") // Adjust to match your frontend origin
@RestController
@RequestMapping("/api/activityType")
public class ActivityTypeController {
    
    @Autowired
    ActivityTypeService activityTypeService;
    // Add methods to handle requests related to activity types

    @PostMapping("/create")
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

    @GetMapping(value="/getAll")
    public ResponseEntity<GetActivityTypeResponse> getAllActivityTypes() {
        List<ActivityType> activityTypes = activityTypeService.getAllActivityTypes();
        return new ResponseEntity<>(new GetActivityTypeResponse(activityTypes, "Activity types returned"), HttpStatus.OK);
    }
    
    @PostMapping(value="/delete")
    public ResponseEntity<DeleteActivityTypeResponse> deleteActivityType(@RequestBody ActivityType entity){
        boolean result = activityTypeService.deleteActivityType(entity.getName());
        if(result){
            return new ResponseEntity<>(new DeleteActivityTypeResponse(true, "ActivityType deleted successfully"), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new DeleteActivityTypeResponse(false, "ActivityType deletion failed"), HttpStatus.OK);
        }
    }

    @PostMapping(value="/update")
    public ResponseEntity<UpdateActivityTypeResponse> updateActivityType(@RequestBody ActivityType entity){
        boolean result = activityTypeService.updateActivityType(entity);
        if(result){
            return new ResponseEntity<>(new UpdateActivityTypeResponse(true, "ActivityType updated successfully"), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new UpdateActivityTypeResponse(false, "ActivityType update failed"), HttpStatus.OK);
        }
    }
}
