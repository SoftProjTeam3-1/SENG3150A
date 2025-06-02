/*
 * Author: Harrison Armstrong
 */

package com.example.session_controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.entities.Session;
import com.example.entities.Activity;
import com.example.entities.SessionActivity;
import com.example.responses.SessionActivityGrabResponse;
import com.example.responses.AddSessionActivityResponse;
import com.example.responses.DeleteSessionActivityResponse;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Adjust to match your frontend origin
@RequestMapping("/api/sessionActivity")
public class SessionActivityController {

    @Autowired
    private SessionActivityService sessionActivityService;
	
    @PostMapping("/getSessionActivities")
    public ResponseEntity<SessionActivityGrabResponse> getSessionActivities(@RequestBody Session session){
        List<Activity> activities = sessionActivityService.getActivitiesBySession(session);
        if (activities == null || activities.isEmpty()) {
            return new ResponseEntity<>(new SessionActivityGrabResponse(null, "No activities found for this session", false), HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(new SessionActivityGrabResponse(activities, "Activities retrieved successfully", true), HttpStatus.OK);
        }
    }

    @PostMapping("/addSessionActivity")
    public ResponseEntity<AddSessionActivityResponse> addSessionActivity(@RequestBody SessionActivity entity){
        //get session and activity for the entity
        Activity activity = entity.getActivity();

        //find those in database
        Session persistedSession = sessionActivityService.getSessionByDateAndType(entity);
        Activity persistedActivity = sessionActivityService.getActivityByName(activity.getName());
        
        //save new session activity with the following attributes
        if(persistedActivity == null || persistedSession == null) {
            return new ResponseEntity<>(new AddSessionActivityResponse("Session or Activity not found", false), HttpStatus.NOT_FOUND);
        }
        else{
            boolean result = sessionActivityService.saveSessionActivity(new SessionActivity(persistedSession, persistedActivity));
            if(result){
                return new ResponseEntity<>(new AddSessionActivityResponse("Session activity added successfully", true), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new AddSessionActivityResponse("Failed to add session activity", false), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @PostMapping("/deleteSessionActivity")
    public ResponseEntity<DeleteSessionActivityResponse> postMethodName(@RequestBody SessionActivity sessionActivity) {
        //get session activity
        SessionActivity entity = sessionActivityService.getSessionActivityBySessionAndActivity(sessionActivity.getSession(), sessionActivity.getActivity());
        if (entity != null) {
            boolean result = sessionActivityService.deleteSessionActivity(entity);
            if(result){
                return new ResponseEntity<>(new DeleteSessionActivityResponse("Session activity deleted successfully", true), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new DeleteSessionActivityResponse("Failed to delete session activity", false), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        else{
            return new ResponseEntity<>(new DeleteSessionActivityResponse("Session activity not found", false), HttpStatus.NOT_FOUND);
        }
        //run delete method in service with returned 
    }
    
}
