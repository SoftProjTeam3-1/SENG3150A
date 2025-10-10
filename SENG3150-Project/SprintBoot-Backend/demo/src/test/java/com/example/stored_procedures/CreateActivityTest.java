package com.example.stored_procedures;

import com.example.entities.Activity;
import com.example.repositories.ActivityRepository;
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
class CreateActivityTest {

    @Mock
    private ActivityRepository repo;

    @InjectMocks
    private CreateActivity createActivity; // system under test

    private Activity activity;

    @BeforeEach
    void setUp() {
        activity = new Activity();
        activity.setName("Swim");
        activity.setDescription("Easy laps");
    }

    @Test
    void createActivity_success_returnsTrue_andCallsSave() {
        when(repo.save(activity)).thenReturn(activity);

        boolean ok = createActivity.createActivity(activity);

        assertTrue(ok);

        ArgumentCaptor<Activity> captor = ArgumentCaptor.forClass(Activity.class);
        verify(repo, times(1)).save(captor.capture());
        assertSame(activity, captor.getValue());
        verifyNoMoreInteractions(repo);
    }

    @Test
    void createActivity_repoThrows_returnsFalse() {
        when(repo.save(any())).thenThrow(new RuntimeException());

        boolean ok = createActivity.createActivity(activity);

        assertFalse(ok);
        verify(repo).save(activity);
        verifyNoMoreInteractions(repo);
    }
}
