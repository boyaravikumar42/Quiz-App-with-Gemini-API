package com.example.geminiAi.services;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.geminiAi.models.Participant;
import com.example.geminiAi.models.Quiz;
import com.example.geminiAi.repos.ParticipantRepository;
import com.example.geminiAi.repos.QuizRepository;
import com.example.geminiAi.repos.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ParticipantService {

    private final ParticipantRepository participantRepo;
    private final QuizRepository quizRepo;
    private final UserRepository userRepo;
    public Participant joinQuiz(String quizId, String userId) {

        if(!quizRepo.findById(quizId).isPresent())
        {
            return null;
        }
        Optional<Participant> existing = participantRepo.findByQuizIdAndUserId(quizId, userId);
        if (existing.isPresent()) {
            return existing.get();
        }


        Participant participant = Participant.builder()
                .quizId(quizId)
                .userId(userId)
                .score(0)
                .hasParticipated(false)
                .username(userRepo.findById(userId).get().getUsername())
                .build();

        return participantRepo.save(participant);
    }

    public Participant submitQuiz(String quizId, String userId, int score, long timeTaken) {
        Participant participant = participantRepo.findByQuizIdAndUserId(quizId, userId)
                .orElseThrow(() -> new NoSuchElementException("Participant not found"));

        participant.setScore(score);
        participant.setTimeTaken(timeTaken);
        participant.setHasParticipated(true);
        participant.setSubmittedAt(new Date());

        return participantRepo.save(participant);
    }

    public List<Participant> getDashboard(String quizId) {
        return participantRepo.findByQuizId(quizId);
    }

    public List<Participant> getLeaderboard(String quizId) {
        List<Participant> participants = participantRepo.findByQuizId(quizId);
        participants.sort(Comparator
                .comparing(Participant::getScore).reversed()
                .thenComparing(Participant::getSubmittedAt));
        return participants;
    }
    public Participant joinQuizByAccessCode(String accessCode, String username) {
        // 1. Find quiz by access code
        Quiz quiz=null;
        try{
             quiz = quizRepo.findByAccessCode(accessCode)
                    .orElseThrow(() -> new RuntimeException("Invalid access code"));
        }
        catch (Exception e)
        {
            return null;
        }

        // 2. Check if quiz is joinable
        if (!quiz.getStatus().equalsIgnoreCase("scheduled") &&
                !quiz.getStatus().equalsIgnoreCase("ongoing")) {
            throw new RuntimeException("Quiz is not open for joining");
        }

        // 3. Check if user already joined
        Optional<Participant> existing = participantRepo.findByQuizIdAndUsername(quiz.getId(), username);
        if (existing.isPresent()) {
            return existing.get();
        }

        // 4. Create new participant
        Participant participant = Participant.builder()
                .quizId(quiz.getId())
                .username(username)
                .build();

        return participantRepo.save(participant);
    }

    public void updateScore(String quizId, String userId, int score) {
        Participant participant = participantRepo.findByQuizIdAndUserId(quizId, userId)
                .orElseThrow(() -> new RuntimeException("Participant not found"));

        participant.setScore(score);
        participant.setSubmittedAt(new Date()); // to break ties
        participantRepo.save(participant);
    }
    public Participant isJoined(String quizId, String userId)
    {
        Optional<Participant> existing = participantRepo.findByQuizIdAndUserId(quizId, userId);
        if(existing.isEmpty()) return null;
        return existing.get();
    }
}
