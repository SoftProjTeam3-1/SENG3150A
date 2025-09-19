package com.example.entities;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.ArrayList;

public class PlayerTest {
    
    @Test
    public void getterTest(){
        Player player = new Player();
        Player player2 = new Player("John Smith", "Defender");
        player2.setId(2);
        player2.setAttendances(new ArrayList<Attendance>());


        int id = player2.getId();
        String playerName = player2.getPlayerName();
        String playerPos = player2.getPosition();
        ArrayList<Attendance> playerAtt = new ArrayList<>(player2.getAttendances());

        assert(id==2);
        assert(playerName.equals("John Smith"));
        assert(playerPos.equals("Defender"));
        assert(playerAtt.equals(new ArrayList<Attendance>()));
    }

    @Test
    public void setterTest(){
        Player player = new Player();
        player.setId(2);
        player.setPlayerName("John Smith");
        player.setPosition("Defender");
        player.setAttendances(new ArrayList<Attendance>());

        assertNotNull(player.getId());
        assertNotNull(player.getPlayerName());
        assertNotNull(player.getPosition());
        assertNotNull(player.getAttendances());

    }
}
