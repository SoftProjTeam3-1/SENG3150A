/*
 * Author: Harrison Armstrong (c3430852)
 * Date: 12042025
 * Description: This class represents a Roll entity in the database.
 * It contains a field for rollID.
 * 
 * It includes a one-to-one relationship with the Session entity.
 */

package com.example.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class Roll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int rollID;

    @OneToOne
    @JoinColumn(name = "sessionID")
    private Session session;

    public Roll(){}
    public Roll(Session session) {
        this.session = session;
    }

    public int getId() {
        return rollID;
    }

    public void setId(int rollID) {
        this.rollID = rollID;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }
}
