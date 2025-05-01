package com.example.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Integer> {
    List<User> findByEmail(String email);
    List<User> findByFirstName(String firstName);
    List<User> findBySurname(String surname);
    List<User> findByVerified(boolean verified);
    List<User> findByPassword(String password);
}
