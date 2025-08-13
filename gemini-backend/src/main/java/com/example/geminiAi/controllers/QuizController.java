package com.example.geminiAi.controllers;

import com.example.geminiAi.models.Quiz;
import com.example.geminiAi.models.QuizRequest;
import com.example.geminiAi.services.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @PostMapping("/generate")
    public ResponseEntity<Quiz> generateQuiz(@RequestBody QuizRequest request, Authentication auth) {
        String email = auth.getName(); // from authenticated user
        request.setCreatedBy(email);   // set creator from auth
        Quiz quiz = quizService.createQuiz(request);
        return ResponseEntity.ok(quiz);
    }

    @GetMapping
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable String id) {
        return quizService.getQuizById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateQuiz(@PathVariable String id, @RequestBody Quiz quiz, Authentication auth) {
        String email = auth.getName();
        try {
            Quiz updated = quizService.updateQuiz(id, quiz, email);
            return ResponseEntity.ok(updated);
        } catch (SecurityException se) {
            return ResponseEntity.status(403).body("You are not authorized to update this quiz.");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuiz(@PathVariable String id, Authentication auth) {
        String email = auth.getName();
        try {
            quizService.deleteQuiz(id, email);
            return ResponseEntity.noContent().build();
        } catch (SecurityException se) {
            return ResponseEntity.status(403).body("You are not authorized to delete this quiz.");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/exists/{accessCode}")
    public ResponseEntity<?> checkQuizExistence(@PathVariable String accessCode) {
        boolean exists = quizService.doesQuizExistByAccessCode(accessCode);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/by-access-code/{accessCode}")
    public ResponseEntity<?> getQuizByAccessCode(@PathVariable String accessCode) {
        return quizService.getQuizByAccessCode(accessCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
