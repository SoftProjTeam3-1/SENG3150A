package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.entities.Activity;
import com.example.entities.ActivityType;

public interface ActivityRepository extends JpaRepository<Activity, Integer>{
    Activity findById(int id);
    List<Activity> findByName(String name);
    List<Activity> findByDescription(String description);
    List<Activity> findByPeopleRequired(int peopleRequired);
    List<Activity> findByDuration(String duration);
    List<Activity> findByFavourite(boolean favourite);
    List<Activity> findByActivityType(ActivityType activityType);

}