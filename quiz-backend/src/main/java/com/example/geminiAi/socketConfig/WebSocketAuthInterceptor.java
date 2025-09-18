package com.example.geminiAi.socketConfig;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import com.example.geminiAi.config.JwtUtil;

import java.util.List;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    
    private JwtUtil jwtUtil = new JwtUtil();

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            try {
                String token = accessor.getFirstNativeHeader("Authorization");

                if (token == null || !token.startsWith("Bearer ")) {
                    throw new IllegalArgumentException("Missing or invalid token");
                }

                token = token.substring(7); // Remove "Bearer "

                // Validate token
                if (!jwtUtil.validateToken(token)) {
                    throw new IllegalArgumentException("Invalid or expired JWT token");
                }

                // Optionally extract username from token
                String username = jwtUtil.getEmailFromToken(token);

                // Attach authentication principal (important for per-user messaging)
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(username, null, List.of());
                accessor.setUser(auth);

                System.out.println("✅ WebSocket CONNECT authenticated for user: " + username);

            } catch (Exception e) {
                System.err.println("❌ WebSocket authentication failed: " + e.getMessage());
                throw new IllegalArgumentException("Authentication failed: " + e.getMessage());
            }
        }

        return message;
    }
}
