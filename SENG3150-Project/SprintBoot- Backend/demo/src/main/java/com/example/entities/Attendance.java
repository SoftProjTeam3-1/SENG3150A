/*
 * Author: Harrison Armstrong (c3430852)
 * Date: 09042025
 * Description: This class represents an Attendance entity in the database.
 * It contains fields for attendanceID and attended status.
 */

package com.example.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Attendance {
    @Id
    private int attendanceID;

    private boolean attended;

    public Attendance(boolean attended){
        this.attended = attended;
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
}
