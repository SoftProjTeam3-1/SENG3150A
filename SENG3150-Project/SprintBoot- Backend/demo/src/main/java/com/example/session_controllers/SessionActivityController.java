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
import com.example.responses.SessionActivityGrabResponse;

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
}
