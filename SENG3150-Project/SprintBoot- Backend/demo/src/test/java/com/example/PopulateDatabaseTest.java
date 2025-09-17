package com.example;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.repositories.*;

import static org.mockito.Mockito.*;

public class PopulateDatabaseTest {

    private PopulateDatabase populateDatabase;

    private ActivityTypeRepository activityTypeRepository;
    private SessionTypeRepository sessionTypeRepository;
    private PlayerRepository playerRepository;
    private ActivityRepository activityRepository;
    private UserRepository userRepository;
    private SessionRepository sessionRepository;
    private SessionActivityRepository sessionActivityRepository;
    private TextNoteRepository textNoteRepository;
    private VoiceNoteRepository voiceNoteRepository;
    private RollRepository rollRepository;
    private AttendanceRepository attendanceRepository;
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setUp() {
        activityTypeRepository = mock(ActivityTypeRepository.class);
        sessionTypeRepository = mock(SessionTypeRepository.class);
        playerRepository = mock(PlayerRepository.class);
        activityRepository = mock(ActivityRepository.class);
        userRepository = mock(UserRepository.class);
        sessionRepository = mock(SessionRepository.class);
        sessionActivityRepository = mock(SessionActivityRepository.class);
        textNoteRepository = mock(TextNoteRepository.class);
        voiceNoteRepository = mock(VoiceNoteRepository.class);
        rollRepository = mock(RollRepository.class);
        attendanceRepository = mock(AttendanceRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);

        populateDatabase = new PopulateDatabase(
            activityTypeRepository,
            sessionTypeRepository,
            playerRepository,
            activityRepository,
            userRepository,
            sessionRepository,
            sessionActivityRepository,
            textNoteRepository,
            voiceNoteRepository,
            rollRepository,
            attendanceRepository,
            passwordEncoder
        );
    }

    /**
     * DATABASE BUILDS SUCCESSFULLY
     */
    @Test
    public void databaseBuilds() {
        populateDatabase.run();

        verify(activityTypeRepository, atLeast(3)).save(any());
        verify(sessionTypeRepository, atLeast(2)).save(any());
        verify(playerRepository, atLeast(11)).save(any());
        verify(activityRepository, atLeast(5)).save(any());
        verify(userRepository, atLeast(2)).save(any());
        verify(sessionRepository, atLeast(4)).save(any());
        verify(sessionActivityRepository, atLeast(11)).save(any());
        verify(textNoteRepository, atLeast(4)).save(any());
        verify(attendanceRepository, atLeast(44)).save(any());
    }

    /**
     * DATABASE FAILS TO BUILD
     */
    @Test
    public void databaseFailsToBuild() {
        doThrow(new RuntimeException("DB error"))
            .when(activityTypeRepository).save(any());

        try {
            populateDatabase.run();
        } catch (Exception e) {
            assert e.getMessage().contains("DB error");
        }

        verify(activityTypeRepository, times(1)).save(any());
    }
}
