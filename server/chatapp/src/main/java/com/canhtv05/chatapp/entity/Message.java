package com.canhtv05.chatapp.entity;

import java.time.Instant;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

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
    Instant timestamp;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    Chat chat;
}
