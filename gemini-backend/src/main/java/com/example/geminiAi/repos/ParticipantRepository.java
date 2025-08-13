package com.example.geminiAi.repos;

import com.example.geminiAi.models.Participant;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ParticipantRepository extends MongoRepository<Participant, String> {
    List<Participant> findByQuizId(String quizId);
    Optional<Participant> findByQuizIdAndUserId(String quizId, String userId);
    boolean existsByQuizIdAndUserId(String quizId, String userId);


    Optional<Participant> findByQuizIdAndUsername(String quizId, String username);
}
