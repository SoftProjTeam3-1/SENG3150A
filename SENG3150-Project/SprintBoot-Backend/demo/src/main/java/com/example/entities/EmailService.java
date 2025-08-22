package com.example.entities;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendSimpleEmail(String toEmail, String subject, String body) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("SENG3150.Project1@gmail.com"); 
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);

        System.out.println("Mail Sent Successfully...");
    }


    public void sendRecoveryMail(String toEmail) {
        
        String subject = "Password Recovery";
        String body = "your password recovery code is: " + generateRecoveryCode()  ;
        sendSimpleEmail(toEmail, subject, body);

    }


    public String generateRecoveryCode() {
        // Generate a random recovery code

        String recoveryCode = String.valueOf((int) (Math.random() * 1000000));
        
        return recoveryCode;
        // Send the recovery code to the user's email
    }


}
