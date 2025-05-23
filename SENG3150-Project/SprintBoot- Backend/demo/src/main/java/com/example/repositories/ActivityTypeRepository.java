package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.entities.ActivityType;

public interface ActivityTypeRepository extends JpaRepository<ActivityType, Integer> {
    ActivityType findById(int id);
    List<ActivityType> findByName(String name);
    ActivityType findDistinctByName(String name);
    List<ActivityType> findByDescription(String description);
}
