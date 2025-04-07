package com.canhtv05.chatapp.entity;

import java.io.Serializable;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "invalidate_token")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvalidateToken extends AbstractEntity<String> implements Serializable {

    @Column(name = "jit", nullable = false)
    String jit;

    @Column(name = "expiry_time", nullable = false)
    Date expiryTime;
}
