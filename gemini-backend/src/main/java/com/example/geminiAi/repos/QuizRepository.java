package com.example.geminiAi.repos;

import com.example.geminiAi.models.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface QuizRepository extends MongoRepository<Quiz, String> {
    List<Quiz> findByCreatedBy(String adminId);
    Optional<Quiz> findByAccessCode(String accessCode);
    List<Quiz> findByStatus(String status); // SCHEDULED, ACTIVE, etc.

}
