package com.example.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.entities.Activity;
import com.example.entities.ActivityType;

import jakarta.transaction.Transactional;

public interface ActivityRepository extends JpaRepository<Activity, Integer>{
    Activity findById(int id);
    List<Activity> findByName(String name);
    Activity findDistinctByName(String name);
    List<Activity> findByDescription(String description);
    List<Activity> findByPeopleRequired(int peopleRequired);
    List<Activity> findByDuration(String duration);
    List<Activity> findByFavourite(boolean favourite);
    List<Activity> findByActivityType(ActivityType activityType);

    @Modifying
    @Transactional
    @Query("UPDATE Activity a SET a.peopleRequired = :peopleRequired, a.name = :name, a.description = :description, a.favourite = :favourite, a.duration = :duration WHERE a.activityID = :id")
    void updateActivity(
        @Param("id") int id,
        @Param("peopleRequired") int peopleRequired,
        @Param("name") String name,
        @Param("description") String description,
        @Param("favourite") boolean favourite,
        @Param("duration") String duration
    );


    @Query(value = "SELECT * " + //
                "FROM activity a " + //
                "INNER JOIN session_activity sa ON sa.activityid = a.activityid " + //
                "INNER JOIN session s ON s.sessionid = sa.sessionid " + //
                "WHERE s.sessionid = :id;", nativeQuery = true)
    List<Activity> findActivitiesBySession(@Param("id") int id);
}