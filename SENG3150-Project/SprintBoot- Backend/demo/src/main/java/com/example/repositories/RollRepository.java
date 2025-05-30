/*
 * Author: Harrison Armstrong
 */

package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import com.example.entities.Roll;

public interface RollRepository extends JpaRepository<Roll, Integer> {
    Roll findById(int id);
    List<Roll> findBySessionId(int sessionID); 
}
