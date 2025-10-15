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
    private final SessionTypeRepository sessionTypeRepository;
    private final TextNoteRepository textNoteRepository;
    private final SessionActivityRepository sessionActivityRepository;
    private final ActivityRepository activityRepository;

    public SessionService(SessionRepository sessionRepository,
        SessionTypeRepository sessionTypeRepository,
        TextNoteRepository textNoteRepository, SessionActivityRepository sessionActivityRepository,  ActivityRepository activityRepository) {
        this.sessionRepository = sessionRepository;
        this.sessionTypeRepository = sessionTypeRepository;
        this.textNoteRepository = textNoteRepository;
        this.sessionActivityRepository =  sessionActivityRepository;
        this.activityRepository = activityRepository;
    }

    // public List<Session> getTrainingSessions() {
    //     return sessionRepository.findTop3ByTypeOrderByDateDesc(
    //         sessionTypeRepository.findDistinctByName("Training")
    //     );
    // }

    // public Session getGameSession() {
    //     return sessionRepository.findTopByTypeOrderByDateDesc(
    //         sessionTypeRepository.findDistinctByName("Game")
    //     );
    // }

    /**
     * Return the Session ID from the given date from the repository.
     * @param date The given date as a {@link String}.
     * @return The ID as an {@link Integer}.
     */
    public int getIdByDate(String date){
        return sessionRepository.findIdByDate(date);
    }

    /**
     * Get the Notes from the given Session ID
     * @param sessionId The given Session ID as an {@link Integer}
     * @return {@link String} of notes if successful; Otherwise {@code null}.
     */
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

    /**
     * Save the session to the repository.
     * @param session The given {@link Session}
     * @return {@code true} if save succeeded; {@code false} otherwise.
     */
    public boolean saveSession(Session session) {
        try {
            sessionRepository.save(session);
            return true;
        } catch (Exception e) {
            System.out.println("Error saving session: " + e.getMessage());
            return false;
        }
    }

    /**
     * Update the Notes with the given Session ID.
     * @param text The change given.
     * @param sessionId The given Session ID.
     * @return {@code true} if update succeeded; {@code false} otherwise.
     */
    public boolean updateTextBySessionId(String text, int sessionId) {
        try {
            textNoteRepository.updateTextBySessionId(text, sessionId);
            return true;
        } catch (Exception e) {
            System.out.println("Error updating text note: " + e.getMessage());
            return false;
        }
    }

    /**
     * Get the specific Session by the Date and Type of Session
     * @param session The given {@link Session} just containing Date and Type
     * @return The expected {@link Session}
     */
    public Session getSessionByDateAndType(Session session) {
        return sessionRepository.findDistinctByDateAndType(session.getDate(), session.getType());
    }

    /**
     * Delete the given Session from the repository.
     * @param session The given {@link Session}
     * @return {@code true} if deletion succeeded; {@code false} otherwise.
     */
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

    /**
     * Delete all Sessions from the given User
     * @param user The given {@link User}
     */
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

    /**
     * Get all the Sessions from the specific User.
     * @param user The given {@link User}
     * @return The expected {@link Session}
     */
    public List<Session> getSessionsByUser(User user) {
        return sessionRepository.findByUser(user);
    }

    /**
     * Validates the given Sessions Exist
     * @param sessions The given {@link Session}
     */
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

    /**
     * Clears old User Sessions and replaces them with the updated versions.
     * @param user The given {@link User}
     * @param sessions The given {@link Session}
     */
    @Transactional
    public void replaceUserSessions(User user, List<SyncSessionsResponse> sessions) {

        prevalidate(sessions);

        List<Session> existing = sessionRepository.findAllByUser(user);
        sessionActivityRepository.deleteBySessionIn(existing);
        sessionRepository.deleteAll(existing);
        sessionRepository.flush();
        em.clear();


        int i = 0;
        for (SyncSessionsResponse req : sessions) {
            Session s = new Session();
            s.setUser(user);
            s.setDate(req.getDate());

            if (req.getSessionTypeId() == null) {
                throw new IllegalArgumentException("session[" + i + "]: sessionTypeId is required");
            }
            int finalI = i;
            SessionType st = sessionTypeRepository.findById(req.getSessionTypeId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "session[" + finalI + "]: sessionTypeId " + req.getSessionTypeId() + " not found"));
            s.setType(st);

            s.getTextNotes().clear();
            for (var nReq : req.getNotes()) {
                if (nReq == null || nReq.getText() == null || nReq.getText().isBlank()) continue;
                var note = new TextNote();
                note.setText(nReq.getText().trim());
                note.setSession(s);                // owning side set
                s.getTextNotes().add(note);
            }

            s.setRoll(new Roll());

            int j = 0;
            for (SyncSessionsActivityResponse aReq : req.getActivities()) {
                SessionActivity sa = new SessionActivity();
                sa.setSession(s);
                sa.setRow(aReq.getRow());
                sa.setDuration(aReq.getDuration().toString());

                int finalI1 = i;
                int finalJ = j;
                Activity a = activityRepository.findDistinctByNameOptional(aReq.getName())
                        .orElseThrow(() -> new IllegalArgumentException(
                                "session[" + finalI1 + "] activity[" + finalJ + "]: name '" + aReq.getName() + "' not found"));
                sa.setActivity(a);

                s.getSessionActivities().add(sa);
                j++;
            }

            sessionRepository.save(s); // cascades will persist children + roll
            i++;
        }

        sessionRepository.flush();
    }
}