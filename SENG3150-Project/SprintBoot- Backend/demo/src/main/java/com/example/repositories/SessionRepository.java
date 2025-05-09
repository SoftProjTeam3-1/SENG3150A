package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Date;

import com.example.entities.Session;
import com.example.entities.SessionType;
import com.example.entities.User;

public interface SessionRepository extends JpaRepository<Session, Integer>{
    Session findByID(int id);
    List<Session> findByDate(Date date);
    List<Session> findByUser(User user);
    List<Session> findBySessionType(SessionType type);
}
