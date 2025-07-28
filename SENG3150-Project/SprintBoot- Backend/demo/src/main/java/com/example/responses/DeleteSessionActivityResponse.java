/*
 * Author: Harrison Armstrong
 */
package com.example.responses;

public class DeleteSessionActivityResponse {
    private boolean response;
    private String message;

    public DeleteSessionActivityResponse(String message, boolean response) {
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
