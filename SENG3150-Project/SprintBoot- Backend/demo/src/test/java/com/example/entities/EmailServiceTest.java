package com.example.entities;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {
    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;  


    @Test
    public void sendSimpleEmail_success() {
        String toEmail = "test@example.com";
        String subject = "Test Subject";
        String body = "Hello, this is a test email!";

        emailService.sendSimpleEmail(toEmail, subject, body);

        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender, times(1)).send(messageCaptor.capture());

        SimpleMailMessage sentMessage = messageCaptor.getValue();
        assertEquals("SENG3150.Project1@gmail.com", sentMessage.getFrom());
        assertEquals(toEmail, sentMessage.getTo()[0]);
        assertEquals(subject, sentMessage.getSubject());
        assertEquals(body, sentMessage.getText());
    }

    @Test
    void sendRecoveryMail_success() {
        String toEmail = "user@example.com";

        emailService.sendRecoveryMail(toEmail);

        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(messageCaptor.capture());

        SimpleMailMessage sentMessage = messageCaptor.getValue();

        assertEquals("SENG3150.Project1@gmail.com", sentMessage.getFrom());
        assertEquals(toEmail, sentMessage.getTo()[0]);
        assertEquals("Password Recovery", sentMessage.getSubject());
        assertTrue(sentMessage.getText().contains("your password recovery code is:"));
    }

    @Test
    public void recoveryCode(){
        String code = emailService.generateRecoveryCode();

        assertNotNull(code, "Recovery code should not be null");
    }
}
