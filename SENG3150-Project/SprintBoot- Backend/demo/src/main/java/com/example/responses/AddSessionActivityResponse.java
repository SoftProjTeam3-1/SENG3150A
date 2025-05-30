package com.example.responses;

public class AddSessionActivityResponse {
    private String message;
    private boolean response;

    public AddSessionActivityResponse(String message, boolean response) {
        this.message = message;
        this.response = response;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isResponse() {
        return response;
    }

    public void setResponse(boolean response) {
        this.response = response;
    }
}
