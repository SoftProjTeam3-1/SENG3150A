package com.example.session_controllers;

import com.example.entities.Session;
import com.example.entities.Activity;
import com.example.entities.SessionActivity;
import com.example.entities.SessionType;
import com.example.repositories.SessionActivityRepository;
import com.example.entities.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;



public class SessionActivityServiceTest {

    @Mock
    private SessionActivityRepository sessionActivityRepository;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(sessionActivityRepository).build();
        objectMapper = new ObjectMapper();

        //create objects 
        
        Activity activity1 = new Activity();
        Session session1 = new Session();
        SessionActivity sessionActivity1 = new SessionActivity();
        //session
        //activity
    }
    
    /*
     * DELETE SESSION ACTIVITY TESTS FOR SESSIONACTIVITY SERVICE
     */

        // test for database error
    @Test
    public void testDeleteSessionActivity_DatabaseError() throws Exception {

    }
        
        // test for data not found
    @Test
    public void testDeleteSessionActivity_DataNotFound() throws Exception {

    }
        
    // test for successful deletion
    @Test
    public void testDeleteSessionActivity_SuccessfulDeletion() throws Exception {

    }

    /*
     * ADD SESSION ACTIVITY TESTS FOR SESSIONACTIVITY SERVICE
     */

        // test for database error
    @Test
    public void testAddSessionActivity_DatabaseError() throws Exception {
    
    }

        // test for data not found
    @Test
    public void testAddSessionActivity_DataNotFound() throws Exception {

    }

        // test for successful addition
    @Test
    public void testAddSessionActivity_SuccessfulAddition() throws Exception {

    }
}
