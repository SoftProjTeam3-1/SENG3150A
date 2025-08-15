package com.example;

import com.example.repositories.*;
import com.example.entities.*;

import com.google.common.hash.Hashing;
import java.nio.charset.StandardCharsets;
import java.sql.Date;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class PopulateDatabase implements CommandLineRunner{
    private final ActivityTypeRepository activityTypeR;
    private final SessionTypeRepository sessionTypeR;
    private final PlayerRepository playerR;
    private final ActivityRepository activityR;
    private final UserRepository userR;
    private final SessionRepository sessionR;
    private final SessionActivityRepository sessionActivityR;
    private final TextNoteRepository textNoteR;
    private final VoiceNoteRepository voiceNoteR;
    private final RollRepository rollR;
    private final AttendanceRepository attendanceR;

    public PopulateDatabase(ActivityTypeRepository activityTypeR,
        SessionTypeRepository sessionTypeR,
        PlayerRepository playerR,
        ActivityRepository activityR,
        UserRepository userR,
        SessionRepository sessionR,
        SessionActivityRepository sessionActivityR,
        TextNoteRepository textNoteR,
        VoiceNoteRepository voiceNoteR,
        RollRepository rollR,
        AttendanceRepository attendanceR){
            this.activityTypeR = activityTypeR;
            this.sessionTypeR = sessionTypeR;
            this.playerR = playerR;
            this.activityR = activityR;
            this.userR = userR;
            this.sessionR = sessionR;
            this.sessionActivityR = sessionActivityR;
            this.textNoteR = textNoteR;
            this.voiceNoteR = voiceNoteR;
            this.rollR = rollR;
            this.attendanceR = attendanceR;
        }

    @Override
    public void run(String... args){
        //clean the database
        /* attendanceR.deleteAll();
        rollR.deleteAll();
        textNoteR.deleteAll();
        voiceNoteR.deleteAll();
        sessionActivityR.deleteAll();
        sessionR.deleteAll();
        userR.deleteAll();
        activityR.deleteAll();
        playerR.deleteAll();
        sessionTypeR.deleteAll();
        activityTypeR.deleteAll(); */

        //create activity types
        ActivityType warmup = new ActivityType("Warmup", "Typically first in a training session");
        ActivityType skills = new ActivityType("Skills", "Focus on specific skills");
        ActivityType game = new ActivityType("Game", "Focus on gameplay");

        //create session types
        SessionType trainingSession = new SessionType("Training", "Training Session");
        SessionType gameSession = new SessionType("Game", "Weekend Competitive Game");

        //create players
        Player player1 = new Player("Harrison Armstrong", "Defensive Midfielder");
        Player player2 = new Player("Darcy Studdert", "Winger");
        Player player3 = new Player("Oscar Scorgie", "Forward");
        Player player4 = new Player("David Hong", "Striker");
        Player player5 = new Player("John McDonald", "Goalkeeper");
        Player player6 = new Player("Tommy McDonald", "Attacking Midfielder");
        Player player7 = new Player("Ethan McDonald", "Central Midfielder");
        Player player8 = new Player("Liam Jones", "Wing-back");
        Player player9 = new Player("Oliver Zhang", "Sweeper");
        Player player10 = new Player("Samuel Garcia", "Full-back");
        Player player11 = new Player("Muhammad Kingston", "Centre-back");

        //create activities
        Activity laps = new Activity("Laps", "Run Laps around the field", 1, "15mins", warmup);
        Activity stretching = new Activity("Stretching", "Limber players up by stretching before strenuous activity", 1, "5mins", warmup);
        Activity passes = new Activity("Passing", "Practice passing the ball between players", 2, "15mins", skills);
        Activity dribbling = new Activity("Dribbling", "Practice dribbling the ball around cones", 1, "15mins", skills);
        Activity miniGame = new Activity("Mini Game", "Play a small sided game to practice skills", 8, "30mins", game);

        //create users
        String stuartPassword = Hashing.sha256()
            .hashString("SENG3150isfun!", StandardCharsets.UTF_8)
            .toString();
        
        String assistantCoachPassword = Hashing.sha256()
            .hashString("JasminSchmidt123#", StandardCharsets.UTF_8)
            .toString();
        User coach = new User("Stuart", "Mendes", "stuart.mendes@gmail.com", false, stuartPassword);
        User assistantCoach = new User("Jasmin", "Schmidt", "jazzyschnitzel@hotmail.com", false, assistantCoachPassword);

        //create sessions
        Session trainingSession1 = new Session(new Date(1746118800000L), coach, trainingSession);
        Session trainingSession2 = new Session(new Date(1746550800000L), coach, trainingSession);
        Session trainingSession3 = new Session(new Date(1746723600000L), coach, trainingSession);
        Session gameSession1 = new Session(new Date(1746291600000L), coach, gameSession);

        //create SessionActivities
        SessionActivity sessionActivity1 = new SessionActivity(trainingSession1, laps);
        SessionActivity sessionActivity2 = new SessionActivity(trainingSession1, stretching);
        SessionActivity sessionActivity3 = new SessionActivity(trainingSession1, miniGame);

        SessionActivity sessionActivity4 = new SessionActivity(trainingSession2, laps);
        SessionActivity sessionActivity5 = new SessionActivity(trainingSession2, stretching);
        SessionActivity sessionActivity6 = new SessionActivity(trainingSession2, passes);
        SessionActivity sessionActivity7 = new SessionActivity(trainingSession2, miniGame);
        
        SessionActivity sessionActivity8 = new SessionActivity(trainingSession3, stretching);
        SessionActivity sessionActivity9 = new SessionActivity(trainingSession3, passes);
        SessionActivity sessionActivity10 = new SessionActivity(trainingSession3, dribbling);
        SessionActivity sessionActivity11 = new SessionActivity(trainingSession3, miniGame);

        //making notes for the sessions
        TextNote textNote1 = new TextNote("The team could ALL use practice passing accurately", trainingSession1);
        TextNote textNote2 = new TextNote("Timmy needs more endurance training so he can run longer without getting puffed", trainingSession2);
        TextNote textNote3 = new TextNote("Ethan is a great player, but he needs to work dribbing around defenders", trainingSession3);
        TextNote textNote4 = new TextNote("Muhummad should work on his confidnce in his defending", gameSession1);

        //making the roll for each session created
        Roll roll1 = new Roll(trainingSession1);
        trainingSession1.setRoll(roll1);
        Roll roll2 = new Roll(trainingSession2);
        trainingSession2.setRoll(roll2);
        Roll roll3 = new Roll(trainingSession3);
        trainingSession3.setRoll(roll3);
        Roll roll4 = new Roll(gameSession1);
        gameSession1.setRoll(roll4);

        //marking the attendance for each player
        Attendance attendance1 = new Attendance(true, player1, roll1);
        Attendance attendance2 = new Attendance(true, player1, roll2);
        Attendance attendance3 = new Attendance(true, player1, roll3);
        Attendance attendance4 = new Attendance(true, player1, roll4);

        Attendance attendance5 = new Attendance(true, player2, roll1);
        Attendance attendance6 = new Attendance(true, player2, roll2);
        Attendance attendance7 = new Attendance(true, player2, roll3);
        Attendance attendance8 = new Attendance(true, player2, roll4);

        Attendance attendance9 = new Attendance(true, player3, roll1);
        Attendance attendance10 = new Attendance(true, player3, roll2);
        Attendance attendance11 = new Attendance(true, player3, roll3);
        Attendance attendance12 = new Attendance(true, player3, roll4);

        Attendance attendance13 = new Attendance(true, player4, roll1);
        Attendance attendance14 = new Attendance(true, player4, roll2);
        Attendance attendance15 = new Attendance(true, player4, roll3);
        Attendance attendance16 = new Attendance(true, player4, roll4);

        Attendance attendance17 = new Attendance(true, player5, roll1);
        Attendance attendance18 = new Attendance(true, player5, roll2);
        Attendance attendance19 = new Attendance(false, player5, roll3);
        Attendance attendance20 = new Attendance(true, player5, roll4);

        Attendance attendance21 = new Attendance(false, player6, roll1);
        Attendance attendance22 = new Attendance(false, player6, roll2);
        Attendance attendance23 = new Attendance(false, player6, roll3);
        Attendance attendance24 = new Attendance(true, player6, roll4);

        Attendance attendance25 = new Attendance(true, player7, roll1);
        Attendance attendance26 = new Attendance(true, player7, roll2);
        Attendance attendance27 = new Attendance(true, player7, roll3);
        Attendance attendance28 = new Attendance(true, player7, roll4);

        Attendance attendance29 = new Attendance(false, player8, roll1);
        Attendance attendance30 = new Attendance(true, player8, roll2);
        Attendance attendance31 = new Attendance(true, player8, roll3);
        Attendance attendance32 = new Attendance(true, player8, roll4);

        Attendance attendance33 = new Attendance(false, player9, roll1);
        Attendance attendance34 = new Attendance(false, player9, roll2);
        Attendance attendance35 = new Attendance(true, player9, roll3);
        Attendance attendance36 = new Attendance(true, player9, roll4);

        Attendance attendance37 = new Attendance(false, player10, roll1);
        Attendance attendance38 = new Attendance(false, player10, roll2);
        Attendance attendance39 = new Attendance(false, player10, roll3);
        Attendance attendance40 = new Attendance(false, player10, roll4);

        Attendance attendance41 = new Attendance(false, player11, roll1);
        Attendance attendance42 = new Attendance(false, player11, roll2);
        Attendance attendance43 = new Attendance(false, player11, roll3);
        Attendance attendance44 = new Attendance(false, player11, roll4);

        try{
            activityTypeR.save(warmup);
            activityTypeR.save(skills);
            activityTypeR.save(game);

            sessionTypeR.save(trainingSession);
            sessionTypeR.save(gameSession);

            playerR.save(player1);
            playerR.save(player2);
            playerR.save(player3);
            playerR.save(player4);
            playerR.save(player5);
            playerR.save(player6);
            playerR.save(player7);
            playerR.save(player8);
            playerR.save(player9);
            playerR.save(player10);
            playerR.save(player11);

            activityR.save(laps);
            activityR.save(stretching);
            activityR.save(passes);
            activityR.save(dribbling);
            activityR.save(miniGame);

            userR.save(coach);
            userR.save(assistantCoach);

            sessionR.save(trainingSession1);
            sessionR.save(trainingSession2);
            sessionR.save(trainingSession3);
            sessionR.save(gameSession1);

            sessionActivityR.save(sessionActivity1);
            sessionActivityR.save(sessionActivity2);
            sessionActivityR.save(sessionActivity3);
            sessionActivityR.save(sessionActivity4);
            sessionActivityR.save(sessionActivity5);
            sessionActivityR.save(sessionActivity6);
            sessionActivityR.save(sessionActivity7);
            sessionActivityR.save(sessionActivity8);
            sessionActivityR.save(sessionActivity9);
            sessionActivityR.save(sessionActivity10);
            sessionActivityR.save(sessionActivity11);

            textNoteR.save(textNote1);
            textNoteR.save(textNote2);
            textNoteR.save(textNote3);
            textNoteR.save(textNote4);

            attendanceR.save(attendance1);
            attendanceR.save(attendance2);
            attendanceR.save(attendance3);
            attendanceR.save(attendance4);
            attendanceR.save(attendance5);
            attendanceR.save(attendance6);
            attendanceR.save(attendance7);
            attendanceR.save(attendance8);
            attendanceR.save(attendance9);
            attendanceR.save(attendance10);
            attendanceR.save(attendance11);
            attendanceR.save(attendance12);
            attendanceR.save(attendance13);
            attendanceR.save(attendance14);
            attendanceR.save(attendance15);
            attendanceR.save(attendance16);
            attendanceR.save(attendance17);
            attendanceR.save(attendance18);
            attendanceR.save(attendance19);
            attendanceR.save(attendance20);
            attendanceR.save(attendance21);
            attendanceR.save(attendance22);
            attendanceR.save(attendance23);
            attendanceR.save(attendance24);
            attendanceR.save(attendance25);
            attendanceR.save(attendance26);
            attendanceR.save(attendance27);
            attendanceR.save(attendance28);
            attendanceR.save(attendance29);
            attendanceR.save(attendance30);
            attendanceR.save(attendance31);
            attendanceR.save(attendance32);
            attendanceR.save(attendance33);
            attendanceR.save(attendance34);
            attendanceR.save(attendance35);
            attendanceR.save(attendance36);
            attendanceR.save(attendance37);
            attendanceR.save(attendance38);
            attendanceR.save(attendance39);
            attendanceR.save(attendance40);
            attendanceR.save(attendance41);
            attendanceR.save(attendance42);
            attendanceR.save(attendance43);
            attendanceR.save(attendance44);
        } catch(Exception e){
            System.out.println("Error while building database: " + e.getMessage());
            e.printStackTrace();            
        }
    }
}