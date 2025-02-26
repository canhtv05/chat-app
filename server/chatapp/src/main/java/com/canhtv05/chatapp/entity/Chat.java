package com.canhtv05.chatapp.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String chat_name;
    String chat_image;

    @ManyToMany
    Set<User> admins = new HashSet<>();

    Boolean is_group;

    @ManyToOne
    User created_by;

    @ManyToMany
    Set<User> users = new HashSet<>();

    @OneToMany
    List<Message> messages = new ArrayList<>();

    @Override
    public boolean equals(Object object) {
        if (object == null || getClass() != object.getClass()) return false;
        Chat chat = (Chat) object;
        return Objects.equals(id, chat.id) && Objects.equals(chat_name, chat.chat_name) && Objects.equals(chat_image, chat.chat_image) && Objects.equals(is_group, chat.is_group) && Objects.equals(created_by, chat.created_by) && Objects.equals(users, chat.users) && Objects.equals(messages, chat.messages);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, chat_name, chat_image, is_group, created_by, users, messages);
    }
}
