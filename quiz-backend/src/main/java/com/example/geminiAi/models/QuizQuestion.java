package com.example.geminiAi.models;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizQuestion {
    private String question;
    private List<String> options;
    private String answer;
    private String explanation;
}
