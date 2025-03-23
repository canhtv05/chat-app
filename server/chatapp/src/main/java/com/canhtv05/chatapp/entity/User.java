package com.canhtv05.chatapp.entity;

import com.canhtv05.chatapp.common.Gender;
import com.canhtv05.chatapp.common.UserStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "users")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User extends AbstractEntity<String> implements UserDetails {

    @Column(name = "first_name", nullable = false)
    String firstName;

    @Column(name = "last_name", nullable = false)
    String lastName;

    @Column(name = "dob", nullable = false)
    LocalDate dob;

    @Column(name = "email", nullable = false, unique = true)
    String email;

    @Column(name = "phone", nullable = false, unique = true)
    String phone;

    @Column(name = "profile_picture")
    String profilePicture;

    @JsonIgnore
    @Column(name = "refresh_token", columnDefinition = "TEXT")
    String refreshToken;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_status", nullable = false)
    UserStatus userStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    Gender gender;

    @JsonIgnore
    @Column(name = "password", nullable = false)
    String password;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // no role added
        return List.of();
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired(); // default true
    }

    @Override
    public boolean isAccountNonLocked() {
        return !this.userStatus.equals(UserStatus.BANNED); // default true
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired(); // default true
    }

    @Override
    public boolean isEnabled() {
        return this.userStatus.equals(UserStatus.ACTIVE); // default true
    }

    @Override
    public boolean equals(Object object) {
        if (object == null || getClass() != object.getClass()) return false;
        User user = (User) object;
        return Objects.equals(firstName, user.firstName) && Objects.equals(lastName, user.lastName) && Objects.equals(dob, user.dob) && Objects.equals(email, user.email) && Objects.equals(phone, user.phone) && Objects.equals(profilePicture, user.profilePicture) && Objects.equals(refreshToken, user.refreshToken) && userStatus == user.userStatus && gender == user.gender && Objects.equals(password, user.password);
    }

    @Override
    public int hashCode() {
        return Objects.hash(firstName, lastName, dob, email, phone, profilePicture, refreshToken, userStatus, gender, password);
    }
}

/*
1. isAccountNonExpired() --> Kiểm tra xem tài khoản của người dùng có bị hết hạn hay không.
                         --> Một tài khoản hết hạn thường được sử dụng để vô hiệu hóa người dùng sau một
                             khoảng thời gian nhất định.

2.isAccountNonLocked() --> Kiểm tra xem tài khoản của người dùng có bị khóa hay không.
                       --> Thường được sử dụng để tạm thời vô hiệu hóa tài khoản của người dùng nếu có hành
                           vi đáng ngờ, như nhập sai mật khẩu nhiều lần.

3.isCredentialsNonExpired() --> Kiểm tra xem thông tin xác thực (mật khẩu) của người dùng có bị hết hạn hay không.
                            --> Thường được sử dụng khi bạn muốn yêu cầu người dùng thay đổi mật khẩu sau một
                                khoảng thời gian.

4.isEnabled --> được sử dụng để kiểm tra xem tài khoản của người dùng có được kích hoạt hay không.
            --> nếu Khi phương thức này trả về false, Spring Security sẽ ngăn người dùng đăng nhập,
                ngay cả khi họ nhập đúng tên đăng nhập và mật khẩu.
*/