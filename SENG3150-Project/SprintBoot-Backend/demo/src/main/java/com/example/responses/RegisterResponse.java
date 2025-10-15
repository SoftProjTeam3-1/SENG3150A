package com.example.responses;

public class RegisterResponse {

    private boolean response;
    private String message;

    public RegisterResponse(){}
    public RegisterResponse(boolean response, String message) {
        this.response = response;
        this.message = message;
    }

    public boolean isResponse() {
        return response;
    }

    public void setResponse(boolean response) {
        this.response = response;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
