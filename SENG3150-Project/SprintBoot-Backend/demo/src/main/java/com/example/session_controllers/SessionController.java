/*
 * Author: Harrison Armstrong
 */

package com.example.session_controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.controllers.ActivityService;
import com.example.controllers.ActivityTypeService;
import com.example.entities.Activity;
import com.example.entities.ActivityType;
import com.example.entities.Session;
import com.example.entities.User;
import com.example.entities.UserService;
import com.example.responses.CreateSessionResponse;
import com.example.responses.DeleteSessionResponse;
import com.example.responses.EditNoteResponse;
import com.example.responses.FetchCategoriesAndActivitiesResponse;
import com.example.responses.FetchSessionsResponse;
import com.example.responses.FetchSpecificCategoriesAndActivitiesResponse;
import com.example.responses.GetTextNoteResponse;
import com.example.responses.SyncSessionsResponse;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Adjust to match your frontend origin
@RequestMapping("/api/session")
public class SessionController {

    private final SessionService sessionService;
    private final UserService userService;
    private final ActivityService activityService;
    private final ActivityTypeService activityTypeService;

    public SessionController(SessionService sessionService,
                             UserService userService,
                             ActivityService activityService,
                             ActivityTypeService activityTypeService) {
        this.sessionService = sessionService;
        this.userService = userService;
        this.activityService = activityService;
        this.activityTypeService = activityTypeService;
    }

    /**
     * Resolve current authenticated user from the SecurityContext (Authorization: Bearer ...)
     * @return {@link User} if successful; Otherwise an Unauthorised Error.
     */
    private User requireCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }
        Object principal = auth.getPrincipal();
        String email = principal instanceof String ? (String) principal : null;
        if (email == null) throw new RuntimeException("Unauthorized");
        return userService.getUserByEmail(email);
    }

    /**
     * Get the note from the given {@link Session}.
     * @param session The given Session from the request payload.
     * @return {@link ResponseEntity} containing {@link GetTextNoteResponse} and a message stating whether returning the note was successful.
     */
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

    /**
     * Edit the note of a {@link Session}.
     * @param request The given edit changes from the request payload.
     * @return {@link ResponseEntity} containing {@link EditNoteResponse} and a message stating whether editing the note was successful.
     */
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

    /**
     * Create a {@link Session}
     * @param session The {@link Session} being created  from the request payload.
     * @return {@link ResponseEntity} containing {@link CreateSessionResponse} and a  message stating whether creating the note was successful.
     */
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

    /**
     * Deleting a given {@link Session}.
     * @param session The {@link Session} being delete from the request payload.
     * @return {@link ResponseEntity} containing {@link DeleteSessionResponse} and a message stating whether the deletion was successful.
     */
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

    /**
     * Fetch all Sessions from the current User
     * @return {@link ResponseEntity} containing {@link List} containing {@link FetchSessionsResponse} otherwise an error message is returned.
     */
    @PostMapping("/fetchSessions")
    public ResponseEntity<List<FetchSessionsResponse>> fetchSessions() {
        try {
            User user = requireCurrentUser();
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
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * Update all Sessions from the current User
     * @param sessions The changes made to Sessions
     * @return {@link ResponseEntity} with a message on whether the Sessions update was successful.
     */
    @PutMapping("/updateSessions")
    public ResponseEntity<String> updateSessions(@RequestBody List<SyncSessionsResponse> sessions) {
        try {
            User user = requireCurrentUser();
            sessionService.replaceUserSessions(user, sessions);
            return ResponseEntity.ok("Sessions updated successfully.");
        } catch (IllegalArgumentException iae) {
            return ResponseEntity.badRequest().body(iae.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }

    /**
     * Return all categories and activities for current user
     * @return {@link ResponseEntity} containing {@link FetchCategoriesAndActivitiesResponse} otherwise an error message will be returned.
     */
    @PostMapping("/fetchCategoriesAndActivities")
    public ResponseEntity<FetchCategoriesAndActivitiesResponse> fetchCategoriesAndActivities() {
        try {
            // ensure the request is authenticated
            User user = requireCurrentUser();
            System.out.println("Authenticated user: " + (user != null ? user.getEmail() : "null"));

            List<ActivityType> activityTypes = activityTypeService.getAllActivityTypes();
            FetchCategoriesAndActivitiesResponse output = new FetchCategoriesAndActivitiesResponse();
            for (ActivityType activityType : activityTypes) {
                String name = activityType.getName();
                List<Activity> activities = activityService.getActivitiesByType(name);
                FetchSpecificCategoriesAndActivitiesResponse newEntry = new FetchSpecificCategoriesAndActivitiesResponse(name, activities);
                output.addToList(newEntry);
            }
            return new ResponseEntity<>(output, HttpStatus.OK );
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
    }
}