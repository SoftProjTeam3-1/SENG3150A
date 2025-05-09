package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {

  private PopulateDatabase databaseBuilder;

  public static void main(String[] args) {
    Main mainInstance = new Main();
    mainInstance.populateDatabaseOnStartup();

    SpringApplication.run(Main.class, args);
  }

  public void populateDatabaseOnStartup() {
    databaseBuilder.run();
  }
}