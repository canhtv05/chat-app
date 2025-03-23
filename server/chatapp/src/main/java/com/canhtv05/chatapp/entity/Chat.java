package com.canhtv05.chatapp.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "chat")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Chat extends AbstractEntity<String> {

    @Column(name = "chat_name")
    String chatName;

    @Column(name = "chat_image")
    String chatImage;

    @ManyToMany
    @JoinTable(
            name = "chat_admins",
            joinColumns = @JoinColumn(name = "chat_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    Set<User> admins = new HashSet<>();

    @Column(name = "is_group", nullable = false)
    Boolean isGroup;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    User createdBy;

    @Builder.Default
    @ManyToMany
    @JoinTable(
            name = "chat_users",
            joinColumns = @JoinColumn(name = "chat_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    Set<User> users = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true)
    List<Message> messages = new ArrayList<>();

    @Override
    public boolean equals(Object object) {
        if (object == null || getClass() != object.getClass()) return false;
        Chat chat = (Chat) object;
        return Objects.equals(chatName, chat.chatName) &&
                Objects.equals(chatImage, chat.chatImage) &&
                Objects.equals(isGroup, chat.isGroup) &&
                Objects.equals(createdBy, chat.createdBy) &&
                Objects.equals(users, chat.users) &&
                Objects.equals(messages, chat.messages);
    }

    @Override
    public int hashCode() {
        return Objects.hash(chatName, chatImage, isGroup, createdBy, users, messages);
    }
}
