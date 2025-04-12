/*
 * Author: Harrison Armstrong (c3430852)
 * Date: 12042025
 * Description: This class represents an Attendance entity in the database.
 * It contains fields for attendanceID and attended status.
 * 
 * It includes a many-to-one relationship with the Player entity.
 * * It includes a many-to-one relationship with the Roll entity.
 */

package com.example.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int attendanceID;

    private boolean attended;

    @ManyToOne
    @JoinColumn(name = "playerID")
    private Player player;

    @ManyToOne
    @JoinColumn(name = "rollID")
    private Roll roll;

    public Attendance(boolean attended, Player player, Roll roll) {
        this.attended = attended;
        this.player = player;
        this.roll = roll;
    }

    public int getAttendanceID() {
        return attendanceID;
    }

    public void setAttendanceID(int attendanceID) {
        this.attendanceID = attendanceID;
    }

    public boolean isAttended() {
        return attended;
    }

    public void setAttended(boolean attended) {
        this.attended = attended;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Roll getRoll() {
        return roll;
    }

    public void setRoll(Roll roll) {
        this.roll = roll;
    }
}
