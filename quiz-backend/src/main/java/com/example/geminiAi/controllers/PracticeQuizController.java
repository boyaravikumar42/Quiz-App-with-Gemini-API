package com.example.geminiAi.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.geminiAi.services.QuizService;
import org.springframework.web.bind.annotation.PostMapping;


import com.example.geminiAi.models.QuizQuestion;
import com.example.geminiAi.models.QuizRequest;


@Component
@RestController
@RequestMapping("/api/practice-quiz")
public class PracticeQuizController {
    @Autowired
    private QuizService service;

    @PostMapping("/generate-quiz")
public ResponseEntity<List<QuizQuestion>> generatePracticeQuiz(@RequestBody QuizRequest request) {
    List<QuizQuestion> questions = service.generateQuizQuestions(
        request.getTopic(), 
        request.getQuestionCount(), 
        request.getDifficulty()
    );

    if (questions.isEmpty()) {
        return ResponseEntity.status(500).build();
    }
    return ResponseEntity.ok(questions);
}

    
}
