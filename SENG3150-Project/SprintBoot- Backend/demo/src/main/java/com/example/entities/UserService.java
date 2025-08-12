package com.example.entities;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.repositories.UserRepository;
import com.example.stored_procedures.CreateUser;

@Service
@Transactional
public  class UserService {

    private final UserRepository userRepository;



    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Boolean registerUser(User user) {
        CreateUser createUser = new CreateUser(userRepository);
        boolean isCreated = createUser.createUser(user);
        return isCreated;
    }

    public User getUser(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean updatePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setPassword(newPassword); // Already hashed from frontend
            userRepository.save(user); // Persist change
            return true;
        }
        return false;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    
    public void save(User user) {
        userRepository.save(user); 
    }
    

/*    public boolean loginUser(String email, String password) {
        User existingUser = userStore.get(email);

        if (existingUser != null && passwordEncoder.matches(password, existingUser.getPassword())) {
            System.err.println("User found: " + existingUser.getFirstName());
            return true;
        } else {
            System.out.println("User not found " + email);
            return false;
        }
    } */

/*     public String[] getUserData() {
        List<String> userData = new ArrayList<>();
        for (User user : userStore.values()) {
            String data = "Name: " + user.getFirstName() + " " + user.getSurname() + ", Email: " + user.getEmail() + ", Password: " + user.getPassword();
            userData.add(data);
        }
        return userData.toArray(new String[0]);
        
    }
    
    public User getUser(String email) {
        return userStore.get(email);
    }

    } */

    
    
/*     public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(userStore.get(email));
    } */


    // public Optional<String> getEmailByToken(String token) {
    //     return Optional.ofNullable(resetCodeStore.get(token));
    // }

    @Transactional
    public void saveResetToken(String email, String code) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setEmailCodeSent(code);
            user.setEmailCodeSentTo(email);
            userRepository.save(user);
        }
    }
    


    public String getResetToken(String email) {
        User user = userRepository.findByEmail(email);
        return (user != null) ? user.getEmailCodeSent() : null;
    }
/*     public void updatePassword(String email, String newPassword) {
        User user = userStore.get(email);
        if (user != null) {
            String encodedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encodedPassword);
        }
    } */


  


    
}