package com.example.session_controllers;

import com.example.entities.Session;
import com.example.entities.Activity;
import com.example.entities.SessionActivity;
import com.example.entities.SessionType;
import com.example.entities.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.sql.Date;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class SessionActivityServiceTest {
    
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
