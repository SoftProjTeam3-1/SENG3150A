package com.example.stored_procedures;

import com.example.entities.User;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;

import com.example.repositories.*;

public class ValidateUser {

    private String email;
    private String password;

    public ValidateUser(String email, String password) {
        // Constructor logic here
        this.email = email;
        this.password = password;
    }

    public boolean validateUser(){
        Transaction transaction = null;
        Session session = null;
        Configuration configuration = new Configuration().configure("hibernate.cfg.xml");

        configuration.addAnnotatedClass(com.example.entities.User.class);

        StandardServiceRegistry serviceRegistry =
            new StandardServiceRegistryBuilder().applySettings(configuration.getProperties()).build();
        SessionFactory sessionFactory = configuration.buildSessionFactory(serviceRegistry);

        try{
            session = sessionFactory.openSession();
            transaction = session.beginTransaction();
            UserQueries userQuery = new UserQueries();
            User retrievedUser = userQuery.findByEmail(email);

            if(retrievedUser.getEmail().equals(email) && retrievedUser.getPassword().equals(password)){
                System.out.println("User is valid");
                return true;
            } else {
                System.out.println("User is invalid");
                return false;
            }
        } catch(Exception e){
            System.out.println("Error has occurred: " + e.toString());
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
        return false;
    }
}
