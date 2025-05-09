package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import com.example.entities.SessionActivity;
import com.example.entities.Session;
import com.example.entities.Activity;


public interface SessionActivityRepository extends JpaRepository<SessionActivity, Integer> {
    SessionActivity findByID(int id);
    List<SessionActivity> findBySession(Session session);
    List<SessionActivity> findByActivity(Activity activity);
    
}
