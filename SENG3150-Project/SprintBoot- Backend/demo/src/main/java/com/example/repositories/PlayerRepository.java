/*
 * Author: Harrison Armstrong
 */

package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.entities.Player;

public interface PlayerRepository extends JpaRepository<Player, Integer>{
    Player findById(int id);
    List<Player> findByPlayerName(String playerName);
    List<Player> findByPosition(String position);
}
