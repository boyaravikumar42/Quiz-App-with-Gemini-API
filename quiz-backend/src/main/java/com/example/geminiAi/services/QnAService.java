package com.example.geminiAi.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class QnAService {

    @Value("${api.key}")
    private String key;
    @Value("${api.url}")
    private  String url;

    private WebClient webClient;

    QnAService(WebClient.Builder webClientBuilder)
    {
        this.webClient=webClientBuilder.build();
    }
    public String getAnswer(String question) {

        Map<String, Object> requestBody = Map.of("contents",new Object[]
                {
                  Map.of("parts",new Object[]{
                     Map.of("text",question)
                  })
                });

                String response = webClient.post()
                .uri(url+key)
                .header("Content-Type","application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return response;
    }
}

//      {
//        "contents": [
//          {
//                "parts": [
//                             {
//                                   "text": "Tell me a fun fact about space."
//                              }
//                          ]
//          }
//        ]
//       }

