package com.example.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import jakarta.servlet.FilterChain;

public class CustomCorsConfigTest {

    @Test
    @DisplayName("Preflight OPTIONS handled with CORS headers and does not call chain")
    void testPreflightRequestHandledByCorsFilter() throws Exception {
        CustomCorsConfig cfg = new CustomCorsConfig();
        var filter = cfg.corsFilter();

        String origin = "http://localhost:5173";
        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setMethod("OPTIONS");
        req.setRequestURI("/api/test");
        req.addHeader("Origin", origin);
        req.addHeader("Access-Control-Request-Method", "GET");
        req.addHeader("Access-Control-Request-Headers", "Content-Type");

        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(req, res, chain);

        assertEquals(origin, res.getHeader("Access-Control-Allow-Origin"));
        assertEquals("true", res.getHeader("Access-Control-Allow-Credentials"));
        verify(chain, times(0)).doFilter(req, res);
    }

    @Test
    @DisplayName("Actual request sets CORS headers and proceeds down the chain")
    void testActualRequestSetsHeadersAndContinues() throws Exception {
        CustomCorsConfig cfg = new CustomCorsConfig();
        var filter = cfg.corsFilter();

        String origin = "http://localhost:5173";
        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setMethod("GET");
        req.setRequestURI("/api/anything");
        req.addHeader("Origin", origin);

        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        filter.doFilter(req, res, chain);

        assertEquals(origin, res.getHeader("Access-Control-Allow-Origin"));
        assertEquals("true", res.getHeader("Access-Control-Allow-Credentials"));
        verify(chain, times(1)).doFilter(req, res);
    }
}
