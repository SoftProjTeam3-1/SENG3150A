package com.example.stored_procedures;

import com.example.entities.ActivityType;
import com.example.repositories.ActivityTypeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GetActivityTypesTest {

    @Mock
    private ActivityTypeRepository repo;

    @InjectMocks
    private GetActivityTypes getActivityTypes;

    private ActivityType t1, t2;

    @BeforeEach
    void setUp() {
        t1 = new ActivityType();
        t1.setName("Training");
        t1.setDescription("Stuff");

        t2 = new ActivityType();
        t2.setName("Game");
        t2.setDescription("Stuff2");
    }


    @Test
    void getAll_success_returnsList() {
        List<ActivityType> expected = List.of(t1, t2);
        when(repo.findAll()).thenReturn(expected);

        List<ActivityType> result = getActivityTypes.getAll();

        assertNotNull(result);
        assertEquals(expected, result);
        verify(repo).findAll();
    }

    @Test
    void getAll_empty_returnsEmptyList() {
        when(repo.findAll()).thenReturn(List.of());

        List<ActivityType> result = getActivityTypes.getAll();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(repo).findAll();
    }

    @Test
    void getAll_repoThrows_returnsNull() {
        when(repo.findAll()).thenThrow(new RuntimeException());

        List<ActivityType> result = getActivityTypes.getAll();

        assertNull(result);
        verify(repo).findAll();
    }


    @Test
    void getDistinctByName_found_returnsEntity() {
        when(repo.findDistinctByName("Training")).thenReturn(t1);

        ActivityType result = getActivityTypes.getDistinctByName("Training");

        assertSame(t1, result);
        verify(repo).findDistinctByName("Training");
    }

    @Test
    void getDistinctByName_notFound_returnsNull() {
        when(repo.findDistinctByName("Unknown")).thenReturn(null);

        ActivityType result = getActivityTypes.getDistinctByName("Unknown");

        assertNull(result);
        verify(repo).findDistinctByName("Unknown");
    }

    @Test
    void getDistinctByName_repoThrows_returnsNull() {
        when(repo.findDistinctByName(anyString()))
                .thenThrow(new RuntimeException());

        ActivityType result = getActivityTypes.getDistinctByName("Anything");

        assertNull(result);
        verify(repo).findDistinctByName("Anything");
    }
}