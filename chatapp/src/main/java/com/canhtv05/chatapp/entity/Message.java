package com.canhtv05.chatapp.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String content;
    LocalDateTime timestamp;

    @ManyToOne
    User user;

    @ManyToOne
    Chat chat;
}
