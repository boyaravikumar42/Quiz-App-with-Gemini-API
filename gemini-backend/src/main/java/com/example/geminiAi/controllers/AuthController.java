package com.example.geminiAi.controllers;

import com.example.geminiAi.models.User;
import com.example.geminiAi.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        String message = authService.register(user);
        return ResponseEntity.status(201).body(Map.of("message", message));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String token = authService.login(credentials.get("email"), credentials.get("password"));
        return ResponseEntity.ok(Map.of("message", "Login successful", "token", token));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> req) {
        String message = authService.resetPassword(req.get("email"), req.get("newPassword"));
        return ResponseEntity.ok(Map.of("message", message));
    }

    @PutMapping("/update")
    public ResponseEntity<Map<String, String>> updateUser(@RequestParam String email, @RequestBody User updatedUser) {
        String message = authService.updateUser(email, updatedUser);
        return ResponseEntity.ok(Map.of("message", message));
    }

}
