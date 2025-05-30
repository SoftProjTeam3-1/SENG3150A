/*
 * Author: Harrison Armstrong
 */

package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.io.File;

import com.example.entities.VoiceNote;
import com.example.entities.Session;

public interface VoiceNoteRepository extends JpaRepository<VoiceNote, Integer>{
    File findById(int id);
    List<VoiceNote> findByVoiceFile(File voiceFile);
    List<VoiceNote> findBySession(Session session);
}
