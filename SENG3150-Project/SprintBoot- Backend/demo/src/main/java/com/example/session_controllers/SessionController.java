/*
 * Author: Harrison Armstrong
 */

package com.example.session_controllers;

import com.example.controllers.ActivityService;
import com.example.controllers.ActivityTypeService;
import com.example.entities.*;
import com.example.responses.*;
import com.example.service.Secruity.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Adjust to match your frontend origin
@RequestMapping("/api/session")
public class SessionController {

    @Autowired
    private SessionService sessionService;
    @Autowired
    private UserService userService;
    @Autowired
    private ActivityService activityService;
    @Autowired
    private ActivityTypeService activityTypeService;
    @Autowired
    RequestUserService requestUserService;

    private final JwtService jwt;
    private final PasswordEncoder passwordEncoder;
	
    // @GetMapping("/initialCall")
    // public ResponseEntity<InitialSessionGrabResponse> getSessions(){
    //     List<Session> trainingSessions = sessionService.getTrainingSessions();
    //     Session gameSession = sessionService.getGameSession();
    //     if (gameSession == null || trainingSessions.isEmpty() || trainingSessions == null) {
    //         return new ResponseEntity<>(new InitialSessionGrabResponse(null, null, "Error in session grab", false), HttpStatus.BAD_REQUEST);
    //     }
    //     else{
    //         return new ResponseEntity<>(new InitialSessionGrabResponse(gameSession, trainingSessions, "Grabbed tasks appropriately", true), HttpStatus.OK);
    //     }
    // }

    public SessionController(UserService userService, JwtService jwt, PasswordEncoder passwordEncoder, RequestUserService requestUserService) {
        this.userService = userService;
        this.jwt = jwt;
        this.passwordEncoder = passwordEncoder;
        this.requestUserService = requestUserService;
    }

    @PostMapping("/getNote")
    public ResponseEntity<GetTextNoteResponse> getNote(@RequestBody Session session){
        int foundSessionId = sessionService.getIdByDate(session.getDate().toString());
        String text = sessionService.getTextBySessionId(foundSessionId);
        if (text == null) {
            return new ResponseEntity<>(new GetTextNoteResponse(null, "No text found for this session", false), HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(new GetTextNoteResponse(text, "Text retrieved successfully", true), HttpStatus.OK);
        }
    }

    @PostMapping("/editNote")
    public ResponseEntity<EditNoteResponse> editNote(@RequestBody UpdateTextNoteRequest request){
        //find session ID by date
        int sessionId = sessionService.getIdByDate(request.getDate().toString());
        //get the text
        String text = request.getText();
        //run the query in service
        boolean result = sessionService.updateTextBySessionId(text, sessionId);
        //return response
        if(result){
            return new ResponseEntity<>(new EditNoteResponse("Text updated successfully", true), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new EditNoteResponse("Failed to update text", false), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<CreateSessionResponse> createSession(@RequestBody Session session){
        Session newSession = new Session();
        newSession.setDate(session.getDate());
        newSession.setType(session.getType());
        boolean result = sessionService.saveSession(newSession);
        if(result){
            System.out.println("Session created successfully: " + newSession);
            return new ResponseEntity<>(new CreateSessionResponse("Session created successfully", true), HttpStatus.OK);
        } else {
            System.out.println("Failed to create session: " + newSession);
            return new ResponseEntity<>(new CreateSessionResponse("Failed to create session", false), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/deleteSession")
    public ResponseEntity<DeleteSessionResponse> postMethodName(@RequestBody Session session) {
        //get via date and type
        Session returnedSession = sessionService.getSessionByDateAndType(session);
        //call function to delete session
        if(returnedSession != null) {
            boolean result = sessionService.deleteSession(returnedSession);
            if(result) {
                return new ResponseEntity<>(new DeleteSessionResponse(true, "Session deleted successfully"), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new DeleteSessionResponse(false, "Failed to delete session"), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        else{
            //if session not found, return error
            return new ResponseEntity<>(new DeleteSessionResponse(false, "Session not found"), HttpStatus.NOT_FOUND);
        }
        //get result and return response
    }

    @PostMapping("/fetchSessions")
    public ResponseEntity<List<FetchSessionsResponse>> fetchSessions(HttpServletRequest req) {
        User user = requestUserService.requireUser(req);

        System.out.println("WE GOT THE USER: "+user);

        List<Session> sessions = sessionService.getSessionsByUser(user);

        List<FetchSessionsResponse> responseList = sessions.stream().map(session -> {
            return new FetchSessionsResponse(
                    session.getId(),
                    session.getDate(),
                    session.getType(),
                    session.getSessionActivities()
            );
        }).collect(Collectors.toList());

        return new ResponseEntity<>(responseList, HttpStatus.OK);
    }

    @PutMapping("/updateSessions")
    public ResponseEntity<String> updateSessions(@RequestBody List<SyncSessionsResponse> sessions, HttpServletRequest req) {
        User user = requestUserService.requireUser(req);

        sessionService.replaceUserSessions(user, sessions);

        return ResponseEntity.ok("Sessions updated successfully.");
    }

    @PostMapping("/fetchCategoriesAndActivities")
    public ResponseEntity<FetchCategoriesAndActivitiesResponse> fetchCategoriesAndActivities(HttpServletRequest req) {
        User user = requestUserService.requireUser(req);

        List<ActivityType> activityTypes = activityTypeService.getAllActivityTypes();

        FetchCategoriesAndActivitiesResponse output = new FetchCategoriesAndActivitiesResponse();

        for (ActivityType activityType : activityTypes) {
            String name = activityType.getName();
            List<Activity> activities = activityService.getActivitiesByType(name);
            FetchSpecificCategoriesAndActivitiesResponse newEntry = new FetchSpecificCategoriesAndActivitiesResponse(name, activities);
            output.addToList(newEntry);
        }

        return new ResponseEntity<>(output, HttpStatus.OK );
    }
}