package com.example.repositories;

public class UserQueries implements UserRepository {
    @Autowired
    private EntityManager entityManager;

    @Override
    public List<User> findByEmail(String email) {
        String query = "SELECT u FROM User u WHERE u.email = :email";
        return entityManager.createQuery(query, User.class)
                            .setParameter("email", email)
                            .getResultList();
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
}