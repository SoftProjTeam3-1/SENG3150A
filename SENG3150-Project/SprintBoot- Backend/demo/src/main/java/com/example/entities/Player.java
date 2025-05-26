/*
 * Author: Harrison Armstrong (c3430852)
 * Date: 09042025
 * Description: This class represents a Player entity in the database.
 * It contains fields for playerID, playerName, and position.
 */

package com.example.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;

@Entity
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int playerID;

    private String playerName;
    private String position;

    @JsonIgnore
    @OneToMany(mappedBy= "player", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Attendance> attendances = new ArrayList<>();

    public Player(){}
    public Player(String playerName, String position) {
        this.playerName = playerName;
        this.position = position;
    }

    public int getId() {
        return playerID;
    }

    public void setId(int playerID) {
        this.playerID = playerID;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public List<Attendance> getAttendances() {
        return attendances;
    }

    public void setAttendances(List<Attendance> attendances) {
        this.attendances = attendances;
    }
}
