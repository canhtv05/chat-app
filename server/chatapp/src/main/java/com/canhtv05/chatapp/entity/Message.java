package com.canhtv05.chatapp.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "message")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Message extends AbstractEntity<String> {

    @Column(name = "content", nullable = false)
    String content;

    @Column(name = "timestamp", nullable = false)
    LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    Chat chat;
}
