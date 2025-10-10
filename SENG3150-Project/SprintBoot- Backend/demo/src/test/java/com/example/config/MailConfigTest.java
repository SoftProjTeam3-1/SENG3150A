package com.example.config;

import java.util.Properties;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

public class MailConfigTest {

    @Test
    @DisplayName("javaMailSender bean is configured with expected host, port and properties")
    void testJavaMailSenderBeanConfiguration() {
        MailConfig cfg = new MailConfig();
        JavaMailSender sender = cfg.javaMailSender();
        assertNotNull(sender);
        assertTrue(sender instanceof JavaMailSenderImpl);
        JavaMailSenderImpl impl = (JavaMailSenderImpl) sender;

        assertEquals("smtp.gmail.com", impl.getHost());
        assertEquals(587, impl.getPort());
        assertNotNull(impl.getUsername());
        // Do not assert on actual password value; just ensure it's set/non-null for configuration
        assertNotNull(impl.getPassword());

        Properties p = impl.getJavaMailProperties();
        assertEquals("smtp", p.getProperty("mail.transport.protocol"));
        assertEquals("true", p.getProperty("mail.smtp.auth"));
        assertEquals("true", p.getProperty("mail.smtp.starttls.enable"));
        assertEquals("true", p.getProperty("mail.debug"));
    }
}
