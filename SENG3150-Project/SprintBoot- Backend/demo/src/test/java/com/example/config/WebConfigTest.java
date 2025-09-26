package com.example.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import org.springframework.web.servlet.config.annotation.CorsRegistration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

public class WebConfigTest {

    @Test
    @DisplayName("addCorsMappings registers expected CORS configuration")
    void testAddCorsMappings() {
        WebConfig cfg = new WebConfig();
        CorsRegistry registry = mock(CorsRegistry.class);
        CorsRegistration reg = mock(CorsRegistration.class);

        when(registry.addMapping("/**")).thenReturn(reg);
        when(reg.allowedOrigins(eq("http://localhost:5173"))).thenReturn(reg);
        when(reg.allowedMethods(eq("*"))).thenReturn(reg);
        when(reg.allowedHeaders(eq("*"))).thenReturn(reg);
        when(reg.allowCredentials(true)).thenReturn(reg);

        cfg.addCorsMappings(registry);

        verify(registry, times(1)).addMapping("/**");
        verify(reg, times(1)).allowedOrigins("http://localhost:5173");
        verify(reg, times(1)).allowedMethods("*");
        verify(reg, times(1)).allowedHeaders("*");
        verify(reg, times(1)).allowCredentials(true);
        verifyNoMoreInteractions(registry, reg);
    }
}
