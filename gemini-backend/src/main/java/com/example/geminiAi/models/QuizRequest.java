package com.example.geminiAi.models;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class QuizRequest {
    private String topic;
    private String difficulty;
    private int questionCount;
    private String title;
    private String description;
    private String createdBy;
    private int duration; // in minutes
}

