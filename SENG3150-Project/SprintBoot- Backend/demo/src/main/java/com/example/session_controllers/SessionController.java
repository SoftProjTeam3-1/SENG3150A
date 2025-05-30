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
import com.example.responses.InitialSessionGrabResponse;
import com.example.responses.GetTextNoteResponse;
import com.example.responses.CreateSessionResponse;
import com.example.responses.EditNoteResponse;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Adjust to match your frontend origin
@RequestMapping("/api/session")
public class SessionController {

    @Autowired
    private SessionService sessionService;
	
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
}
