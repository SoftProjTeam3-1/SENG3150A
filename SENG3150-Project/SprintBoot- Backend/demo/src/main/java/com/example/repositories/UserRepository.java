package com.example.repositories;

//import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import com.example.entities.User;

public interface UserRepository /* extends JpaRepository<User, Integer>*/ {
    User findByEmail(String email);
    List<User> findByFirstName(String firstName);
    List<User> findBySurname(String surname);
    List<User> findByVerified(boolean verified);
    List<User> findByPassword(String password);
    List<User> findById(int id);
}
