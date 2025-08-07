/*
 * Author: Harrison Armstrong
 */

package com.example.session_controllers;

import com.example.entities.User;
import com.example.entities.UserService;
import com.example.responses.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.entities.Session;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // Adjust to match your frontend origin
@RequestMapping("/api/session")
public class SessionController {

    @Autowired
    private SessionService sessionService;
    @Autowired
    private UserService userService;

    @GetMapping("/initialCall")
    public ResponseEntity<InitialSessionGrabResponse> getSessions(){
        List<Session> trainingSessions = sessionService.getTrainingSessions();
        Session gameSession = sessionService.getGameSession();
        if (gameSession == null || trainingSessions.isEmpty() || trainingSessions == null) {
            return new ResponseEntity<>(new InitialSessionGrabResponse(null, null, "Error in session grab", false), HttpStatus.BAD_REQUEST);
        }
        else{
            return new ResponseEntity<>(new InitialSessionGrabResponse(gameSession, trainingSessions, "Grabbed tasks appropriately", true), HttpStatus.OK);
        }
    }

    @PostMapping("/fetchSessions")
    @CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
    public ResponseEntity<List<FetchSessionsResponse>> fetchSessions(@CookieValue(value = "userId", required = false) String userId) {

        if (userId == null) {
            System.out.println("No user ID found in cookies");
        }else{
            System.out.println("USerID HERE: "+ userId);
        }
        try {

            User user = userService.getUserByID(Integer.parseInt(userId)); // Needs to parse id here

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
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
    
}
