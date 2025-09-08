package com.example.geminiAi.controllers;

import com.example.geminiAi.config.JwtUtil;
import com.example.geminiAi.models.User;
import com.example.geminiAi.services.AuthService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

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
    @GetMapping("/get")
    public ResponseEntity<?> getUser(HttpServletRequest req)
    {
        String token = req.getHeader("Authorization");
        token=token.substring(7);
        String email=jwtUtil.getEmailFromToken(token);
        User user = authService.getUserByEmail(email);
        if(user!=null)
        {
            return new ResponseEntity<>(user,HttpStatus.OK);
        }
        return new ResponseEntity<>("user not found",HttpStatus.NOT_FOUND);


    }
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(HttpServletRequest req,@RequestBody User updatedUser)
    {
        String token = req.getHeader("Authorization");
        token=token.substring(7);
        String email=jwtUtil.getEmailFromToken(token);
        String message = authService.updateUser(email, updatedUser);
        return ResponseEntity.ok(Map.of("message", message));
    }

}
