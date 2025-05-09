package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import com.example.entities.Roll;

public interface RollRepository extends JpaRepository<Roll, Integer> {
    Roll findByID(int id);
    List<Roll> findBySessionID(int sessionID); 
}
