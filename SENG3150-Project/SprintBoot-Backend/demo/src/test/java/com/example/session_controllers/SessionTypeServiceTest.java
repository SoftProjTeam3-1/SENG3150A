package com.example.session_controllers;

import com.example.entities.SessionType;
import com.example.repositories.SessionTypeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// Run this test with the command:
// mvn test -Dtest=SessionTypeServiceTest
@ExtendWith(MockitoExtension.class)
class SessionTypeServiceTest {

    @Mock
    private SessionTypeRepository sessionTypeRepository;

    @InjectMocks
    private SessionTypeService sessionTypeService;

    private SessionType testSessionType;

    @BeforeEach
    void setUp() {
        testSessionType = new SessionType();
        testSessionType.setId(1);
        testSessionType.setName("Training");
        testSessionType.setDescription("Training session");
    }

    // Tests for findById method
    @Test
    void testFindById_SessionTypeExists_ReturnsSessionType() {
        // Given
        Integer testId = 1;
        when(sessionTypeRepository.findById(testId)).thenReturn(Optional.of(testSessionType));

        // When
        SessionType result = sessionTypeService.findById(testId);

        // Then
        assertNotNull(result);
        assertEquals(testSessionType.getId(), result.getId());
        assertEquals(testSessionType.getName(), result.getName());
        assertEquals(testSessionType.getDescription(), result.getDescription());
        verify(sessionTypeRepository, times(1)).findById(testId);
    }

    @Test
    void testFindById_SessionTypeNotFound_ReturnsNull() {
        // Given
        Integer testId = 999;
        when(sessionTypeRepository.findById(testId)).thenReturn(Optional.empty());

        // When
        SessionType result = sessionTypeService.findById(testId);

        // Then
        assertNull(result);
        verify(sessionTypeRepository, times(1)).findById(testId);
    }

    @Test
    void testFindById_NullId_ReturnsNull() {
        // Given
        Integer nullId = null;
        when(sessionTypeRepository.findById(nullId)).thenReturn(Optional.empty());

        // When
        SessionType result = sessionTypeService.findById(nullId);

        // Then
        assertNull(result);
        verify(sessionTypeRepository, times(1)).findById(nullId);
    }

    // Tests for findByName method
    @Test
    void testFindByName_SessionTypeExists_ReturnsFirstSessionType() {
        // Given
        String testName = "Training";
        List<SessionType> sessionTypeList = new ArrayList<>();
        sessionTypeList.add(testSessionType);
        when(sessionTypeRepository.findByName(testName)).thenReturn(sessionTypeList);

        // When
        SessionType result = sessionTypeService.findByName(testName);

        // Then
        assertNotNull(result);
        assertEquals(testSessionType.getId(), result.getId());
        assertEquals(testSessionType.getName(), result.getName());
        assertEquals(testSessionType.getDescription(), result.getDescription());
        verify(sessionTypeRepository, times(1)).findByName(testName);
    }

    @Test
    void testFindByName_MultipleSessionTypesExist_ReturnsFirstOne() {
        // Given
        String testName = "Training";
        SessionType secondSessionType = new SessionType();
        secondSessionType.setId(2);
        secondSessionType.setName("Training");
        secondSessionType.setDescription("Advanced training session");

        List<SessionType> sessionTypeList = new ArrayList<>();
        sessionTypeList.add(testSessionType);
        sessionTypeList.add(secondSessionType);
        when(sessionTypeRepository.findByName(testName)).thenReturn(sessionTypeList);

        // When
        SessionType result = sessionTypeService.findByName(testName);

        // Then
        assertNotNull(result);
        assertEquals(testSessionType.getId(), result.getId());
        assertEquals(testSessionType.getName(), result.getName());
        assertEquals(testSessionType.getDescription(), result.getDescription());
        // Verify it returns the first one, not the second
        assertNotEquals(secondSessionType.getId(), result.getId());
        verify(sessionTypeRepository, times(1)).findByName(testName);
    }

    @Test
    void testFindByName_SessionTypeNotFound_ReturnsNull() {
        // Given
        String testName = "NonexistentType";
        List<SessionType> emptyList = new ArrayList<>();
        when(sessionTypeRepository.findByName(testName)).thenReturn(emptyList);

        // When
        SessionType result = sessionTypeService.findByName(testName);

        // Then
        assertNull(result);
        verify(sessionTypeRepository, times(1)).findByName(testName);
    }

    @Test
    void testFindByName_NullName_ReturnsNull() {
        // Given
        String nullName = null;
        List<SessionType> emptyList = new ArrayList<>();
        when(sessionTypeRepository.findByName(nullName)).thenReturn(emptyList);

        // When
        SessionType result = sessionTypeService.findByName(nullName);

        // Then
        assertNull(result);
        verify(sessionTypeRepository, times(1)).findByName(nullName);
    }

    @Test
    void testFindByName_EmptyName_ReturnsNull() {
        // Given
        String emptyName = "";
        List<SessionType> emptyList = new ArrayList<>();
        when(sessionTypeRepository.findByName(emptyName)).thenReturn(emptyList);

        // When
        SessionType result = sessionTypeService.findByName(emptyName);

        // Then
        assertNull(result);
        verify(sessionTypeRepository, times(1)).findByName(emptyName);
    }

    // Edge case tests
    @Test
    void testFindById_ZeroId_HandlesGracefully() {
        // Given
        Integer zeroId = 0;
        when(sessionTypeRepository.findById(zeroId)).thenReturn(Optional.empty());

        // When
        SessionType result = sessionTypeService.findById(zeroId);

        // Then
        assertNull(result);
        verify(sessionTypeRepository, times(1)).findById(zeroId);
    }

}