package com.example.repositories;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.TestPropertySource;

import com.example.entities.Activity;
import com.example.entities.ActivityType;

@DataJpaTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:activitydb;DB_CLOSE_DELAY=-1;MODE=MYSQL",
    "spring.datasource.driverClassName=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.jpa.show-sql=false"
})
class ActivityRepositoryTest {

    /* @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ActivityTypeRepository activityTypeRepository;

    @Test
    @DisplayName("Save and find Activity by distinct name")
    void testFindDistinctByName() {
        ActivityType type = new ActivityType("Warm Up", "Pre-session warm up");
        activityTypeRepository.saveAndFlush(type);

        Activity activity = new Activity("Jogging", "Light jog", 20, "10m", type);
        activityRepository.saveAndFlush(activity);

        Activity result = activityRepository.findDistinctByName("Jogging");
        assertNotNull(result);
        assertEquals("Light jog", result.getDescription());
        assertEquals(type.getId(), result.getActivityType().getId());
    }

    @Test
    @DisplayName("Find activities by ActivityType")
    void testFindByActivityType() {
        ActivityType type = new ActivityType("Drill", "Skill drill");
        activityTypeRepository.saveAndFlush(type);

        activityRepository.saveAndFlush(new Activity("Passing", "Short passes", 8, "12m", type));
        activityRepository.saveAndFlush(new Activity("Shooting", "Finishing drill", 6, "15m", type));

        List<Activity> list = activityRepository.findByActivityType(type);
        assertEquals(2, list.size());
    }

    @Test
    @DisplayName("Update activity via custom JPQL update")
    @Rollback
    void testUpdateActivity() {
        ActivityType type = new ActivityType("Conditioning", "Fitness work");
        activityTypeRepository.saveAndFlush(type);
        Activity activity = new Activity("Shuttles", "Sprint", 10, "10m", type);
        activityRepository.saveAndFlush(activity);

        int id = activity.getId();
        activityRepository.updateActivity(id, 12, "Shuttles", "Sprint endurance", true, "12m");

        Activity updated = activityRepository.findDistinctByName("Shuttles");
        assertNotNull(updated);
        assertEquals(12, updated.getPeopleRequired());
        assertEquals("Sprint endurance", updated.getDescription());
        assertTrue(updated.isFavourite());
        assertEquals("12m", updated.getDuration());
    } */
}
