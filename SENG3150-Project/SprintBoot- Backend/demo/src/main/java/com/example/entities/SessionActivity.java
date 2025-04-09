/*
 * Author: Harrison Armstrong (c3430852)
 * Date: 09042025
 * Description: This class represents a SessionActivity entity in the database.
 * It contains a field for sessionActivityID.
 * The sessionActivityID is the primary key for this entity.
 */

package com.example.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class SessionActivity {
    @Id
    private int sessionActivityID;

    public SessionActivity(int sessionActivityID) {
        this.sessionActivityID = sessionActivityID;
    }

    public int getSessionActivityID() {
        return sessionActivityID;
    }

    public void setSessionActivityID(int sessionActivityID) {
        this.sessionActivityID = sessionActivityID;
    }
}
