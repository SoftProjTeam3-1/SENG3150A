package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

import com.example.entities.Session;
import com.example.entities.TextNote;

public interface TextNoteRepository extends JpaRepository<TextNote, Integer> {
    TextNote findById(int id);
    List<TextNote> findByText(String text);
    List<TextNote> findBySession(Session session);
    
    @Query(value = "SELECT text FROM text_note tn INNER JOIN session s ON s.sessionid = tn.sessionid WHERE s.sessionid = :sessionId", nativeQuery = true)
    String findTextBySessionId(@Param("sessionId") int sessionId);
}
