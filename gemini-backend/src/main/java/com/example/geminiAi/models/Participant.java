package com.example.geminiAi.models;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "participants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participant {

    @Id
    private String id;

    private String quizId;     // Reference to Quiz
    private String userId;     // Reference to User (or username)

    private String username;
    private Integer score;
    private Long timeTaken;    // in seconds or milliseconds
    private Date submittedAt;

    @Builder.Default
    private Date joinedAt = new Date();

    @Builder.Default
    private boolean hasParticipated = false; // Tracks participation status


}
