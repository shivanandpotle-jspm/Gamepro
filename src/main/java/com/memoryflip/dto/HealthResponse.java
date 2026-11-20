package com.memoryflip.dto;

import java.time.LocalDateTime;

public class HealthResponse {

    private String status;
    private String application;
    private String version;
    private LocalDateTime timestamp;
    private String database;

    public HealthResponse() {
    }

    public HealthResponse(String status, String application, String version, LocalDateTime timestamp, String database) {
        this.status = status;
        this.application = application;
        this.version = version;
        this.timestamp = timestamp;
        this.database = database;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getApplication() {
        return application;
    }

    public void setApplication(String application) {
        this.application = application;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }
}
