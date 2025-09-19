package com.example.entities;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

public class TextNoteTest {
    @Test
    public void testGettersAndSetters(){
        TextNote tn = new TextNote();

        tn.setId(0);
        tn.setSession(new Session());
        tn.setText("lorem ipsum");

        assertNotNull(tn.getId());
        assertNotNull(tn.getSession());
        assertNotNull(tn.getText());
    }
}
