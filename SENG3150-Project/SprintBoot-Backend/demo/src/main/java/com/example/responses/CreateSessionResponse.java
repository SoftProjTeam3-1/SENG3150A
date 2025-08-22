/*
 * Author: Harrison Armstrong
 */

package com.example.responses;

public class CreateSessionResponse {
    
    private String message;
    private boolean success;

    public CreateSessionResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
