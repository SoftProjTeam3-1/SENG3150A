package com.example.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.entities.ActivityType;

import jakarta.transaction.Transactional;

public interface ActivityTypeRepository extends JpaRepository<ActivityType, Integer> {
    ActivityType findById(int id);
    List<ActivityType> findByName(String name);
    ActivityType findDistinctByName(String name);
    List<ActivityType> findByDescription(String description);

    @Modifying
    @Transactional
    @Query("UPDATE ActivityType a SET a.name = :name, a.description = :description WHERE a.activityTypeID = :id")
    void updateActivityType(
        @Param("id") int id,
        @Param("name") String name,
        @Param("description") String description
    );   
}
