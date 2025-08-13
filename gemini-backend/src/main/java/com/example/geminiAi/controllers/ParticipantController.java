package com.example.geminiAi.controllers;

import com.example.geminiAi.models.Participant;
import com.example.geminiAi.services.ParticipantService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/participants")
@AllArgsConstructor
public class ParticipantController {

    private final ParticipantService participantService;
    private final SimpMessagingTemplate messagingTemplate;


    @PostMapping("/join")
    public ResponseEntity<?> joinQuiz(@RequestBody Map<String, String> request) {
        String quizId = request.get("quizId");
        String userId = request.get("userId");

        Participant participant = participantService.joinQuiz(quizId, userId);
        if(participant==null)
            return new ResponseEntity<>("Quiz not found",HttpStatus.NOT_FOUND);
        return ResponseEntity.ok(participant);
    }

    @PostMapping("/submit")
    public ResponseEntity<Participant> submitQuiz(@RequestBody Map<String, Object> request) {
        String quizId = (String) request.get("quizId");
        String userId = (String) request.get("userId");
        int score = (Integer) request.get("score");
        long timeTaken = Long.parseLong(request.get("timeTaken").toString());

        Participant participant = participantService.submitQuiz(quizId, userId, score, timeTaken);
        return ResponseEntity.ok(participant);
    }

    @GetMapping("/dashboard/{quizId}")
    public ResponseEntity<List<Participant>> getDashboard(@PathVariable String quizId) {
        return ResponseEntity.ok(participantService.getDashboard(quizId));
    }

    @GetMapping("/leaderboard/{quizId}")
    public ResponseEntity<List<Participant>> getLeaderboard(@PathVariable String quizId) {
        return ResponseEntity.ok(participantService.getLeaderboard(quizId));
    }

    @PostMapping("/join-by-access-code")
    public ResponseEntity<?> joinQuizByAccessCode(
            @RequestParam String accesscode,
            @RequestParam String username) {
        Participant participant = participantService.joinQuizByAccessCode(accesscode, username);
        if(participant==null)
        {
            return new ResponseEntity<>("Invalid Access code",HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(participant);
    }

    // WebSocket broadcast after score update
    @PostMapping("/update-score/{quizId}/{username}/{score}")
    public ResponseEntity<Void> updateScore(@PathVariable String quizId,
                                            @PathVariable String username,
                                            @PathVariable int score) {
        // Assume service updates participant's score
        participantService.updateScore(quizId, username, score);

        // Broadcast updated leaderboard to all clients
        List<Participant> updatedLeaderboard = participantService.getLeaderboard(quizId);
        messagingTemplate.convertAndSend("/topic/leaderboard/" + quizId, updatedLeaderboard);

        // Broadcast updated dashboard
        List<Participant> updatedDashboard = participantService.getDashboard(quizId);
        messagingTemplate.convertAndSend("/topic/dashboard/" + quizId, updatedDashboard);

        return ResponseEntity.ok().build();
    }
}
}
