package com.example.session_controllers;

import org.springframework.stereotype.Service;

import com.example.repositories.SessionRepository;
import com.example.repositories.SessionTypeRepository;
import com.example.repositories.TextNoteRepository;
import com.example.entities.Session;

import java.util.List;
import java.util.Date;

@Service
public class SessionService {
    
    private final SessionRepository sessionRepository;
    private final SessionTypeRepository sessionTypeRepository;
    private final TextNoteRepository textNoteRepository;

    public SessionService(SessionRepository sessionRepository,
        SessionTypeRepository sessionTypeRepository,
        TextNoteRepository textNoteRepository) {
        this.sessionRepository = sessionRepository;
        this.sessionTypeRepository = sessionTypeRepository;
        this.textNoteRepository = textNoteRepository;
    }

    public List<Session> getTrainingSessions() {
        return sessionRepository.findTop3ByTypeOrderByDateDesc(
            sessionTypeRepository.findDistinctByName("Training")
        );
    }

    public Session getGameSession() {
        return sessionRepository.findTopByTypeOrderByDateDesc(
            sessionTypeRepository.findDistinctByName("Game")
        );
    }

    public int getIdByDate(String date){
        return sessionRepository.findIdByDate(date);
    }

    public String getTextBySessionId(int sessionId){
        try{
            String result = textNoteRepository.findTextBySessionId(sessionId);
            return result;
        }
        catch(Exception e){
            System.out.println("Error retrieving text note: " + e.getMessage());
            return null;
        }
    }
}
