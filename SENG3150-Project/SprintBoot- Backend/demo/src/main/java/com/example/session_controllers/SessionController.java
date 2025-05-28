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
}
