package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.entities.Attendance;
import com.example.entities.Player;
import com.example.entities.Roll;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
    Attendance findByID(int id);
    List<Attendance> findByPlayer(Player player);
    List<Attendance> findByRoll(Roll roll);
    List<Attendance> findByAttended(boolean attended);
}
