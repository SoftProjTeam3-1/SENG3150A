package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Date;

import com.example.entities.Session;
import com.example.entities.SessionType;
import com.example.entities.User;

public interface SessionRepository extends JpaRepository<Session, Integer>{
    Session findById(int id);
    List<Session> findByDate(Date date);
    List<Session> findByUser(User user);
    List<Session> findByType(SessionType type);
    List<Session> findTop3ByTypeOrderByDateDesc(SessionType type);
    Session findTopByTypeOrderByDateDesc(SessionType type);

    @Query("SELECT s.sessionID FROM Session s WHERE s.date = :date")
    int findIdByDate(String date);
}
