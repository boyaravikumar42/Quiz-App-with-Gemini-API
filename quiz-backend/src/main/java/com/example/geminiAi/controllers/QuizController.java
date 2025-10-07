package com.example.geminiAi.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.geminiAi.models.Quiz;
import com.example.geminiAi.models.QuizRequest;
import com.example.geminiAi.services.QuizService;

import io.netty.handler.codec.http.HttpScheme;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateQuiz(@RequestBody QuizRequest request, Authentication auth) {
        String email = auth.getName(); // from authenticated user
        request.setCreatedBy(email);   // set creator from auth
        Quiz quiz = quizService.createQuiz(request);
        if(quiz==null)
        {
            return new ResponseEntity<>("unable to generate tthe quiz... Try Again..!",HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return ResponseEntity.ok(quiz);
    }

    @GetMapping("/all")
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
    @PutMapping("/update-status/{quizId}")
    public ResponseEntity<?> updateQuizStatus(@PathVariable String quizId, @RequestBody Map<String, String> statusMap, Authentication auth) {
        String email = auth.getName();
        try {
            Quiz updated = quizService.updateQuizStatus(quizId, statusMap.get("status"), statusMap.get("startTime"),email);
            return ResponseEntity.ok(updated);
        } catch (SecurityException se) {
            return ResponseEntity.status(403).body("You are not authorized to update this quiz.");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuiz(@PathVariable String id, Map<String,String> accesMap, Authentication auth) {
        String email = auth.getName();
        try {
            quizService.deleteQuiz(id, accesMap.get("accessCode"),email);
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
    @GetMapping("/by-user-id/{email}")
    public ResponseEntity<List<Quiz>> getAllQuizzesByUserId(@PathVariable String email) {
        List<Quiz> res=quizService.getQuizzesByUserId(email);
        return ResponseEntity.ok(res);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateQuizById(@PathVariable String id, @RequestBody Quiz updatedQuiz, Authentication auth) {
        String email = auth.getName();
        try {
            Quiz updated = quizService.updateMetaOfQuiz(id, updatedQuiz, email);
            return ResponseEntity.ok(updated);
        } catch (SecurityException se) {
            return ResponseEntity.status(403).body("You are not authorized to update this quiz.");
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}

