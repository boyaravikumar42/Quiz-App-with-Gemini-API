package com.example.geminiAi.services;

import com.example.geminiAi.models.QuizQuestion;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@Service
public class QuizGenerationService {


    @Value("${api.key}")
    private String key;
    @Value("${api.url}")
    private  String url;

    private WebClient webClient;

    QuizGenerationService(WebClient.Builder webClientBuilder)
    {

        this.webClient=webClientBuilder.build();
    }

    public List<QuizQuestion> generateQuiz(String topic) {
        String prompt = "Generate 25 multiple-choice questions with 4 options each on the topic \"" + topic + "\". "
                + "Respond strictly in JSON format like:\n"
                + "[{\"question\": \"...\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"answer\": \"A\"}]";

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );

        try {
            Map<String, Object> response = webClient.post()
                    .uri(url+key)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            // Parse response safely
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String text = (String) parts.get(0).get("text");

            // Optional: clean output in case of markdown/code blocks
            text = sanitize(text);

            // Deserialize to Java objects
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(text, new TypeReference<List<QuizQuestion>>() {});

        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
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
}
