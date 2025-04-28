package com.example.stored_procedures;

import com.example.entities.User;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;

public class CreateUser {
    
    private String firstName;
    private String surname;
    private String email;
    private boolean verified;
    private String password;

    public CreateUser(String firstName, String surname, String email, boolean verified, String password){
        // Constructor logic here
        this.firstName = firstName;
        this.surname = surname;
        this.email = email;
        this.verified = verified;
        this.password = password;
    }
    public CreateUser(User user){
        // Constructor logic here
        this.firstName = user.getFirstName();
        this.surname = user.getSurname();
        this.email = user.getEmail();
        this.verified = user.verified();
        this.password = user.getPassword();
    }


    public boolean processTransaction(){
        Transaction transaction = null;
        Session session = null;
        Configuration configuration = new Configuration().configure("hibernate.cfg.xml");

        configuration.addAnnotatedClass(com.example.entities.User.class);
        StandardServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
                .applySettings(configuration.getProperties()).build();
        SessionFactory sessionFactory = configuration.buildSessionFactory(serviceRegistry);

        try{
            session = sessionFactory.openSession();

            //start a transaction
            transaction = session.beginTransaction();

            User user = new User(firstName, surname, email, false, password);

            session.persist(user);
            transaction.commit();
        } catch (Exception e) {
            System.out.println("Error has occurred: " + e.toString());
            if (transaction != null) {
                transaction.rollback();
                return false;
            }
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
                return true;
            }
        }
        return false;
    }
}
