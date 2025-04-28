package com.example.stored_procedures;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;

import com.example.entities.User;

public class GetUser {

    public User getUser(String email){
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
            User retrievedUser = session.get(User.class, 1);
            if (session != null) {
                session.close();
                return retrievedUser;
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
                return null;
            }
        }
        
        return null;
    }
}
