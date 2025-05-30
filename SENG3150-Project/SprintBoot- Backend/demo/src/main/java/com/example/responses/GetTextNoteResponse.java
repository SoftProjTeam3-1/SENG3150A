/*
 * Author: Harrison Armstrong
 */

package com.example.responses;

public class GetTextNoteResponse {
    
    private String text;
    private String message;
    private boolean response;

    public GetTextNoteResponse(String text, String message, boolean response) {
        this.text = text;
        this.message = message;
        this.response = response;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
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
