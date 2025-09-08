package com.example.geminiAi.services;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.geminiAi.models.Quiz;
import com.example.geminiAi.models.QuizQuestion;
import com.example.geminiAi.models.QuizRequest;
import com.example.geminiAi.repos.QuizRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final WebClient.Builder webClientBuilder;

    @Value("${api.key}")
    private String key;

    @Value("${api.url}")
    private String url;

    public List<QuizQuestion> generateQuizQuestions(String topic, int count,String difficulty) {
        String prompt = String.format(
                "Generate %d multiple-choice questions with 4 options each on the topic \"%s\" at a %s difficulty level. "
                        + "Each question must include exactly four options and one correct answer. "
                        + "Respond strictly in JSON format like: "
                        + "[{\"question\": \"...\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"answer\": \"A\"}]",
                count, topic, difficulty.toUpperCase()
        );


        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        try {
            WebClient webClient = webClientBuilder.build();

            Map<String, Object> response = webClient.post()
                    .uri(url + key)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String text = sanitize((String) parts.get(0).get("text"));

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(text, new TypeReference<>() {});

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    public Quiz createQuiz(QuizRequest request) {
        List<QuizQuestion> questions = generateQuizQuestions(request.getTopic(), request.getQuestionCount(),request.getDifficulty());

        Quiz quiz = Quiz.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .topic(request.getTopic())
                .difficulty(request.getDifficulty())
                .createdBy(request.getCreatedBy())
                .accessCode(UUID.randomUUID().toString().substring(0, 6))
                .questions(questions)
                .questionCount(questions.size())
                .status("SCHEDULED")
                .startTime(LocalDateTime.parse(request.getStartTime())) // default 10 minutes from now
                .duration(request.getDuration())
                .build();

        return quizRepository.save(quiz);
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Optional<Quiz> getQuizById(String id) {
        return quizRepository.findById(id);
    }
    public Quiz updateQuiz(String id, Quiz updatedQuiz, String email) {
        return quizRepository.findById(id).map(existing -> {
            if (!existing.getCreatedBy().equals(email)) {
                throw new SecurityException("Only the creator can update this quiz");
            }
            updatedQuiz.setId(existing.getId());
            return quizRepository.save(updatedQuiz);
        }).orElseThrow(() -> new NoSuchElementException("Quiz not found with ID: " + id));
    }

    public void deleteQuiz(String id,String accescode,String email) {
        
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Quiz not found with ID: " + id));
        if(!quiz.getAccessCode().equals(accescode)){
            throw new SecurityException("Access code is incorrect");
        }
        if (!quiz.getCreatedBy().equals(email)) {
            throw new SecurityException("Only the creator can delete this quiz");
        }
        quizRepository.deleteById(id);
    }




    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName(); // typically email or username
    }


    private String sanitize(String text) {
        text = text.trim();
        if (text.startsWith("```")) {
            int start = text.indexOf("[");
            int end = text.lastIndexOf("]");
            if (start != -1 && end != -1) {
                text = text.substring(start, end + 1);
            }
        }
        if (text.toLowerCase().contains("here is")) {
            int start = text.indexOf("[");
            if (start != -1) {
                text = text.substring(start);
            }
        }
        return text;
    }
    public boolean doesQuizExistByAccessCode(String accessCode) {
        return quizRepository.findByAccessCode(accessCode).isPresent();
    }

    public Optional<Quiz> getQuizByAccessCode(String accessCode) {
        return quizRepository.findByAccessCode(accessCode);
    }

    public List<Quiz> getQuizzesByUserId(String mail) {
       List<Quiz>res = quizRepository.findByCreatedBy(mail);
       return res;
    }

    public Quiz updateMetaOfQuiz(String id, Quiz updatedQuiz, String email) {
        return quizRepository.findById(id).map(existing -> {
            if (!existing.getCreatedBy().equals(email)) {
                throw new SecurityException("Only the creator can update this quiz");
            }
            // Update only meta fields
            existing.setDescription(updatedQuiz.getDescription());
            existing.setStartTime(updatedQuiz.getStartTime());
            existing.setDuration(updatedQuiz.getDuration());
            existing.setStatus(updatedQuiz.getStatus());
            return quizRepository.save(existing);
        }).orElseThrow(() -> new NoSuchElementException("Quiz not found with ID: " + id));
    }

    public Quiz updateQuizStatus(String quizId, String status, String startTime, String email) {
        return quizRepository.findById(quizId).map(existing -> {
            if (!existing.getCreatedBy().equals(email)) {
                throw new SecurityException("Only the creator can update this quiz");
            }
            // Update only status and startTime fields
            if(status!=null){
                existing.setStatus(status);
            }
            if(startTime!=null){
                existing.setStartTime(LocalDateTime.parse(startTime));
            }
            return quizRepository.save(existing);
        }).orElseThrow(() -> new NoSuchElementException("Quiz not found with ID: " + quizId));
        
    }

    
}
