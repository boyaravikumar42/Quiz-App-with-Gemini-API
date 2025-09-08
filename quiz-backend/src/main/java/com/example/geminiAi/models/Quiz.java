package com.example.geminiAi.models;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "quizzes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz {

    @Id
    private String id;

    private String title;
    private String description;
    private String topic;
    private String difficulty; // EASY, MEDIUM, HARD

    private String createdBy; // Admin ID or username
    private String accessCode;

    private LocalDateTime  startTime;
    private Integer duration; // in minutes
    private String status; // SCHEDULED, LIVE, COMPLETED

    private List<QuizQuestion> questions;

    private Integer questionCount; // NEW: Total number of questions

    @Builder.Default
    private Date createdAt = new Date();
}
