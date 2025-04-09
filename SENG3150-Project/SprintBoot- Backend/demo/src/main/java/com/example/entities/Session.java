/*
 * Author: Harrison Armstrong (c3430852)
 * Date: 09042025
 * Description: This class represents a Session entity in the database.
 * It contains fields for sessionID and date.
 */

package com.example.entities;

import java.sql.Date;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Session {
    @Id
    private int sessionID;

    private Date date;

    public Session(Date date) {
        this.date = date;
    }

    public int getSessionID() {
        return sessionID;
    }

    public void setSessionID(int sessionID) {
        this.sessionID = sessionID;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
