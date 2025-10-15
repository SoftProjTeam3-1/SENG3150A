package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@EnableJpaRepositories(basePackages = "com.example.repositories")
@EntityScan(basePackages = "com.example.entities")

@SpringBootApplication(scanBasePackages = {
        "com.example",
        "diag"
})
public class Main {
  public static void main(String[] args) {
    SpringApplication.run(Main.class, args);
  }
}