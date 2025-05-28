package com.example.responses;

import java.util.List;

import com.example.entities.Session;

public class InitialSessionGrabResponse {
    
    private Session gameSession;
    private List<Session> trainingSessions;

    private String message;
    private boolean response;

    public InitialSessionGrabResponse(Session gameSession, List<Session> trainingSessions, String message, boolean response) {
        this.gameSession = gameSession;
        this.trainingSessions = trainingSessions;
        this.message = message;
        this.response = response;
    }

    public Session getGameSession() {
        return gameSession;
    }

    public void setGameSession(Session gameSession) {
        this.gameSession = gameSession;
    }

    public List<Session> getTrainingSessions() {
        return trainingSessions;
    }

    public void setTrainingSessions(List<Session> trainingSessions) {
        this.trainingSessions = trainingSessions;
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
