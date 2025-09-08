package com.example.geminiAi.controllers;

import com.example.geminiAi.services.QnAService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
//---------------it is not in the part of project it was used for learning --------------------------
@RestController
@RequestMapping("/api/qna")
public class QnaController {

    @Autowired
    private QnAService service;

    @PostMapping("/ask")
    public ResponseEntity<?> askQuestion(@RequestBody Map<String,String> qna)
    {
        String response =service.getAnswer(qna.get("question"));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
