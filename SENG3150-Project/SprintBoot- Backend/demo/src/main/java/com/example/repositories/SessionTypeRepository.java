package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import com.example.entities.SessionType;


public interface SessionTypeRepository extends JpaRepository<SessionType, Integer> {
    SessionType findById(int id);
    List<SessionType> findByName(String name);
    SessionType findDistinctByName(String name);
    List<SessionType> findByDescription(String description);
    
}
