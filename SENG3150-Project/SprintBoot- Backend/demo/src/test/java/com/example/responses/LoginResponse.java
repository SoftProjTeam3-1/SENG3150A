package com.example.responses;

import com.example.entities.User;

public class LoginResponse {
    
    private LoginResponse response = new LoginResponse(true, "", new User());
    private LoginResponse responseDefault = new LoginResponse();
}
