package com.example.geminiAi.models;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

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

    private Date startTime;
    private Integer duration; // in minutes
    private String status; // SCHEDULED, ACTIVE, COMPLETED

    private List<QuizQuestion> questions;

    private Integer questionCount; // NEW: Total number of questions

    @Builder.Default
    private Date createdAt = new Date();
}
