package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import com.example.entities.SessionType;


public interface SessionTypeRepository extends JpaRepository<SessionType, Integer> {

    Optional<SessionType> findById(Integer integer);
    List<SessionType> findByName(String name);
    Optional<SessionType> findDistinctByName(String name);
    List<SessionType> findByDescription(String description);
    
}
