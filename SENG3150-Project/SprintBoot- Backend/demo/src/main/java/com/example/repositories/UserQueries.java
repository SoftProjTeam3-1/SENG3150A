package com.example.repositories;

import javax.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

import com.example.entities.User;

public class UserQueries implements UserRepository {
    @Autowired  
    private EntityManager entityManager;

    @Override
    public User findByEmail(String email) {
        String query = "SELECT u FROM User u WHERE u.email = :email";
        return entityManager.createQuery(query, User.class)
                            .setParameter("email", email)
                            .getSingleResult();
    }

    @Override
    public List<User> findByFirstName(String firstName) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<User> findBySurname(String surname) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<User> findByVerified(boolean verified) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<User> findByPassword(String password) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<User> findById(int id) {
        // TODO Auto-generated method stub
        return null;
    }
}