package com.memoryflip.controller;

import com.memoryflip.dto.HealthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<HealthResponse> getHealth() {
        HealthResponse response = new HealthResponse(
                "UP",
                "Memory Flip - Master Backend",
                "1.0.0",
                LocalDateTime.now(),
                "H2 Embedded File Storage Connected"
        );
        return ResponseEntity.ok(response);
    }
}
