package com.example.geminiAi.services;

import com.example.geminiAi.config.JwtUtil;
import com.example.geminiAi.models.User;
import com.example.geminiAi.repos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public String register(User user) {
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        user.setPassword(encoder.encode(user.getPassword()));
        userRepo.save(user);

        return "User registered successfully";
    }

    public String login(String email, String password) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return jwtUtil.generateToken(email);
    }

    public String resetPassword(String email, String newPassword) {
        Optional<User> optionalUser = userRepo.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        User user = optionalUser.get();
        user.setPassword(encoder.encode(newPassword));
        userRepo.save(user);

        return "Password updated successfully";
    }

    public String updateUser(String email, User updatedUser) {
        User existingUser = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        existingUser.setUsername(updatedUser.getUsername());
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(encoder.encode(updatedUser.getPassword()));
        }

        userRepo.save(existingUser);
        return "User updated successfully";
    }

    public User getUserByEmail(String email) {
        Optional user =userRepo.findByEmail(email);
        if(user.isPresent())
            return (User)user.get();
        return null;
        

    }
}
