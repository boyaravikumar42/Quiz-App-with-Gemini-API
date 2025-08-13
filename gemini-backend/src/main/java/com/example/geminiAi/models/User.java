package com.example.geminiAi.models;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    private String username;
    private String email;
    private String password;

    @Builder.Default
    private String role = "USER";

    @Builder.Default
    private Date createAt = new Date();

    public String getEmail() {
        return email;
    }
}
