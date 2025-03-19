package com.example;

import com.example.entities.User;
import java.util.HashMap;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebController {
  @GetMapping("/")
  @CrossOrigin(origins = "*")
  public HashMap<String, Object> home() {
    HashMap<String, Object> map = new HashMap<>();
    map.put("message", "Hello, Spring Boot SSR!");
    map.put("items", List.of("Item 1", "Item 2", "Item 3"));
    return map;
  }

  @GetMapping("/user")
  public User user() {
    User user = new User("Mark Wallis", "mark.wallis@newcastle.edu.au");
    return user;
  }
}