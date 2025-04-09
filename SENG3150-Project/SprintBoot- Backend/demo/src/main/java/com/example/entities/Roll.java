/*
 * Author: Harrison Armstrong (c3430852)
 * Date: 09042025
 * Description: This class represents a Roll entity in the database.
 * It contains a field for rollID.
 */

package com.example.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Roll {
    @Id
    private int rollID;

    public Roll(int rollID) {
        this.rollID = rollID;
    }

    public int getRollID() {
        return rollID;
    }

    public void setRollID(int rollID) {
        this.rollID = rollID;
    }
}
