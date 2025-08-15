/*
 * Author: Harrison Armstrong
 */

package com.example.session_controllers;

import com.example.entities.*;
import com.example.repositories.*;
import com.example.responses.SyncSessionsActivityResponse;
import com.example.responses.SyncSessionsResponse;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SessionService {
    
    private final SessionRepository sessionRepository;
    private final ActivityRepository activityRepository;
    private final SessionTypeRepository sessionTypeRepository;
    private final TextNoteRepository textNoteRepository;

    public SessionService(SessionRepository sessionRepository,
        SessionTypeRepository sessionTypeRepository,
        TextNoteRepository textNoteRepository,
        ActivityRepository activityRepository
    ) {
        this.sessionRepository = sessionRepository;
        this.sessionTypeRepository = sessionTypeRepository;
        this.textNoteRepository = textNoteRepository;
        this.activityRepository = activityRepository;
    }

//    public List<Session> getTrainingSessions() {
//        return sessionRepository.findTop3ByTypeOrderByDateDesc(
//            sessionTypeRepository.findDistinctByName("Training")
//        );
//    }
//
//    public Session getGameSession() {
//        return sessionRepository.findTopByTypeOrderByDateDesc(
//            sessionTypeRepository.findDistinctByName("Game")
//        );
//    }

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

    @Autowired
    EntityManager em;
    public void deleteAllUserSessions(User user){
        try {
            List<Session> sessions = sessionRepository.findByUser(user);
            sessionRepository.deleteAll(sessions);
            em.flush();
            em.clear();
        }  catch (Exception e) {
            System.out.println("Error deleting sessions: " + e.getMessage());
        }
    }
    public List<Session> getSessionsByUser(User user) {
        return sessionRepository.findByUser(user);
    }


    private void prevalidate(List<SyncSessionsResponse> sessions) {
        for (int i = 0; i < sessions.size(); i++) {
            var dto = sessions.get(i);
            if (dto.getSessionTypeId() == null || dto.getSessionTypeId() <= 0)
                throw new IllegalArgumentException("session[" + i + "]: sessionTypeId required");

            int finalI = i;
            sessionTypeRepository.findById(dto.getSessionTypeId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "session[" + finalI + "]: sessionTypeId " + dto.getSessionTypeId() + " not found"));
        }
    }

    @Transactional
    public void replaceUserSessions(User user, List<SyncSessionsResponse> sessions){

        prevalidate(sessions);

        deleteAllUserSessions(user);

        int i = 0;

        for (SyncSessionsResponse session : sessions) {
            Session s = new Session();
            s.setUser(user);
            s.setDate(session.getDate());

            if (session.getSessionTypeId() == null) {
                throw new IllegalArgumentException("session[" + i + "]: sessionTypeId is required");
            }

            int finalI = i;
            SessionType sessionType = sessionTypeRepository.findById(session.getSessionTypeId()).orElseThrow(() -> new IllegalArgumentException("session[" + finalI + "]: sessionTypeId "
                    + session.getSessionTypeId() + " not found"));
            s.setType(sessionType);

            Roll r = new Roll();
            r.setId(s.getId());
            s.setRoll(r);

            int i1 = 0;
            for(SyncSessionsActivityResponse sessionActivity : session.getActivities()){
                SessionActivity sa = new SessionActivity();
                sa.setSession(s);
                sa.setRow(sessionActivity.getRow());
                sa.setDuration(sessionActivity.getDuration().toString());

                int finalI1 = i;
                Activity a = activityRepository.findDistinctByName(sessionActivity.getName()).orElseThrow(() -> new IllegalArgumentException("session[" + finalI + "] activity[" + finalI1 + "]: name '"
                        + sessionActivity.getName() + "' not found"));
                sa.setActivity(a);


                s.getSessionActivities().add(sa);
                i1++;
            }

            sessionRepository.save(s);
            i++;
        }
        sessionRepository.flush();
    }
}
