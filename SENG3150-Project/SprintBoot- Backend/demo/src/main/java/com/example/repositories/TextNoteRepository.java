package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import com.example.entities.Session;
import com.example.entities.TextNote;

public interface TextNoteRepository extends JpaRepository<TextNote, Integer> {
    TextNote findById(int id);
    List<TextNote> findByText(String text);
    List<TextNote> findBySession(Session session);
    
}
