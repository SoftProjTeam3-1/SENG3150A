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
    List<Session> findTop3BySessionTypeOrderByDateDesc(SessionType sessionType);
    Session findTopBySessionTypeOrderByDateDesc(SessionType sessionType);

    @Query("SELECT s.sessionid FROM Session s WHERE s.date = :date")
    int findIdByDate(Date date);
}
