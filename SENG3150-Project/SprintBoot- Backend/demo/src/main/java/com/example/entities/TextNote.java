/*
 * Author: Harrison Armstrong (c3430852)
 * Date: 09042025
 * Description: This class represents a TextNote entity in the database.
 * It contains fields for textNoteID and text.
 */

package com.example.entities;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class TextNote {
    @Id
    private int textNoteID;

    private String text;

    public TextNote(String text) {
        this.text = text;
    }

    public int getTextNoteID() {
        return textNoteID;
    }

    public void setTextNoteID(int textNoteID) {
        this.textNoteID = textNoteID;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
