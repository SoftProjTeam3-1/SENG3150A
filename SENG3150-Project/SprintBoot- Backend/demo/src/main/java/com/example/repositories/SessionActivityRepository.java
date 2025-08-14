package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

import com.example.entities.SessionActivity;

import jakarta.transaction.Transactional;

import com.example.entities.Session;
import com.example.entities.Activity;


public interface SessionActivityRepository extends JpaRepository<SessionActivity, Integer> {
    SessionActivity findById(int id);
    List<SessionActivity> findBySession(Session session);
    List<SessionActivity> findByActivity(Activity activity);
    SessionActivity findDistinctBySessionAndActivity(Session session, Activity activity);

    @Modifying
    @Transactional
    @Query(value = """
        UPDATE session_activity
        SET duration = :duration
        WHERE sessionid = (
            SELECT DISTINCT s.sessionid
            FROM session s
            WHERE s.date = :sessionDate
              AND s.session_typeid = :sessionTypeId
        )
        AND activityid = (
            SELECT DISTINCT a.activityid
            FROM activity a
            WHERE a.name = :activityName
        )
        """, nativeQuery = true)
    int updateSessionActivityDuration(
        @Param("duration") String duration,
        @Param("sessionDate") String sessionDate,
        @Param("sessionTypeId") Long sessionTypeId,
        @Param("activityName") String activityName
    );
}
