/*
 * Author: Harrison Armstrong
 */

package com.example.session_controllers;

import com.example.entities.User;
import org.springframework.stereotype.Service;

import com.example.repositories.SessionRepository;
import com.example.repositories.SessionTypeRepository;
import com.example.repositories.TextNoteRepository;
import com.example.entities.Session;

import java.util.List;

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

    public boolean saveSession(Session session) {
        try {
            sessionRepository.save(session);
            return true;
        } catch (Exception e) {
            System.out.println("Error saving session: " + e.getMessage());
            return false;
        }
    }

    public boolean updateTextBySessionId(String text, int sessionId) {
        try {
            textNoteRepository.updateTextBySessionId(text, sessionId);
            return true;
        } catch (Exception e) {
            System.out.println("Error updating text note: " + e.getMessage());
            return false;
        }
    }

    public Session getSessionByDateAndType(Session session) {
        return sessionRepository.findDistinctByDateAndType(session.getDate(), session.getType());
    }

    public boolean deleteSession(Session session){
        try {
            sessionRepository.delete(session);
            return true;
        } catch (Exception e) {
            System.out.println("Error deleting session: " + e.getMessage());
            return false;
        }
    }
    public List<Session> getSessionsByUser(User user) {
        return sessionRepository.findByUser(user);
    }
}
