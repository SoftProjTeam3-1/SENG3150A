package com.example.stored_procedures;

import com.example.entities.ActivityType;
import com.example.repositories.ActivityTypeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CreateActivityTypeTest {

    @Mock
    private ActivityTypeRepository repo;

    @InjectMocks
    private CreateActivityType createActivityType;

    private ActivityType activityType;

    @BeforeEach
    void setUp() {
        activityType = new ActivityType();
        activityType.setName("Training");
        activityType.setDescription("General training activities");
    }

    @Test
    void createActivityType_success_returnsTrue_andCallsSave() {
        when(repo.save(activityType)).thenReturn(activityType);

        boolean ok = createActivityType.createActivityType(activityType);

        assertTrue(ok);

        ArgumentCaptor<ActivityType> captor = ArgumentCaptor.forClass(ActivityType.class);
        verify(repo, times(1)).save(captor.capture());
        assertSame(activityType, captor.getValue());
        verifyNoMoreInteractions(repo);
    }

    @Test
    void createActivityType_repoThrows_returnsFalse() {
        when(repo.save(any())).thenThrow(new RuntimeException());

        boolean ok = createActivityType.createActivityType(activityType);

        assertFalse(ok);
        verify(repo).save(activityType);
        verifyNoMoreInteractions(repo);
    }
}
